export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

export interface GoogleAuthResult {
  user: {
    _id: string;
    email: string;
    name?: string;
    isAdmin?: boolean;
    googleId?: string;
  };
  token: string;
  isNewUser: boolean;
}
