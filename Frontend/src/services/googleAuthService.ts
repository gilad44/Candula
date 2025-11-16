import { config } from "../config/config";

export interface GoogleAuthResponse {
  user: {
    _id: string;
    email: string;
    name: {
      first: string;
      last: string;
    };
    role: string;
    image?: {
      url: string;
      alt: string;
    };
  };
  token: string;
  isNewUser: boolean;
}

class GoogleAuthService {
  private baseUrl = config.API_BASE_URL;

  async authenticateWithGoogle(
    credential: string
  ): Promise<GoogleAuthResponse> {
    const response = await fetch(`${this.baseUrl}/users/google-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Google authentication failed");
    }

    const result = await response.json();
    return result;
  }
}

export const googleAuthService = new GoogleAuthService();
