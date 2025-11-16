import debounce from "lodash.debounce";
import { useCallback, useRef } from "react";
import { toast } from "react-toastify";

interface UseRateLimitedApiOptions {
  debounceMs?: number;
  maxRetries?: number;
  retryDelay?: number;
  showRateLimitWarning?: boolean;
}

interface ApiError {
  status?: number;
  message?: string;
  retryAfter?: string;
}

export const useRateLimitedApi = (options: UseRateLimitedApiOptions = {}) => {
  const {
    debounceMs = 500,
    maxRetries = 3,
    retryDelay = 1000,
    showRateLimitWarning = true,
  } = options;

  const retryCount = useRef<number>(0);
  const isRateLimited = useRef<boolean>(false);

  // Check if response indicates rate limiting
  const isRateLimitError = (error: ApiError): boolean => {
    return (
      error?.status === 429 ||
      error?.message?.includes("Too many") ||
      error?.message?.includes("rate limit") ||
      error?.message?.includes("Rate limit")
    );
  };

  // Handle rate limit response
  const handleRateLimit = useCallback(
    (error: ApiError) => {
      isRateLimited.current = true;

      if (showRateLimitWarning) {
        const retryAfter = error?.retryAfter || "מספר דקות";
        toast.warn(`יותר מדי בקשות. אנא נסה שוב בעוד ${retryAfter}`, {
          toastId: "rate-limit-warning",
          autoClose: 5000,
        });
      }

      // Reset rate limit flag after delay
      setTimeout(() => {
        isRateLimited.current = false;
        retryCount.current = 0;
      }, retryDelay * 2);
    },
    [showRateLimitWarning, retryDelay]
  );

  // Retry with exponential backoff
  const retryWithBackoff = useCallback(
    async <T>(apiCall: () => Promise<T>, attempt: number = 1): Promise<T> => {
      try {
        const result = await apiCall();
        retryCount.current = 0; // Reset on success
        return result;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        if (isRateLimitError(apiError)) {
          handleRateLimit(apiError);
          throw error;
        }

        if (attempt < maxRetries) {
          retryCount.current = attempt;
          const delay = retryDelay * Math.pow(2, attempt - 1);

          console.log(
            `API call failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return retryWithBackoff(apiCall, attempt + 1);
        }

        throw error;
      }
    },
    [maxRetries, retryDelay, handleRateLimit]
  );

  // Create debounced API call wrapper
  const createDebouncedCall = useCallback(
    <T extends (...args: unknown[]) => Promise<unknown>>(
      apiCall: T,
      customDebounceMs?: number
    ) => {
      return debounce(async (...args: Parameters<T>) => {
        // Skip if currently rate limited
        if (isRateLimited.current) {
          console.warn("API call skipped due to rate limiting");
          throw new Error("Rate limited");
        }

        const wrappedCall = () => apiCall(...args);
        return retryWithBackoff(wrappedCall);
      }, customDebounceMs || debounceMs);
    },
    [debounceMs, retryWithBackoff]
  );

  return {
    createDebouncedCall,
    isRateLimited: () => isRateLimited.current,
    retryCount: () => retryCount.current,
  };
};
