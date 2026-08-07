const ACCESS_TOKEN_KEY = "accessToken";

export const storage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
