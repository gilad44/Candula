import { toast } from "react-toastify";

export const useToast = () => {
  const showSuccess = (message: string) => toast.success(message);
  const showError = (message: string) => toast.error(message);
  const showInfo = (message: string) => toast.info(message);

  const showProductAction = (productTitle: string, action: 'added' | 'removed' | 'favorited' | 'unfavorited', quantity?: number) => {
    switch (action) {
      case 'added':
        return showSuccess(`${productTitle} נוסף לסל הקניות${quantity ? ` (${quantity})` : ''}`);
      case 'removed':
        return showSuccess(`${productTitle} הוסר מהסל`);
      case 'favorited':
        return showSuccess(`${productTitle} נוסף למועדפים ❤️`);
      case 'unfavorited':
        return showSuccess(`${productTitle} הוסר מהמועדפים`);
    }
  };

  const showAuthAction = (action: 'login' | 'logout' | 'signup' | 'loginRequired') => {
    switch (action) {
      case 'login':
        return showSuccess('התחברת בהצלחה!');
      case 'logout':
        return showInfo('התנתקת בהצלחה');
      case 'signup':
        return showSuccess('נרשמת בהצלחה!');
      case 'loginRequired':
        return showInfo('התחבר כדי לשמור מועדפים');
    }
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showProductAction,
    showAuthAction,
  };
};
