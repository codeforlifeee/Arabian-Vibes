// Drupal OAuth2 Authentication Service
import axios, { AxiosResponse } from 'axios';
import DRUPAL_CONFIG from '../config/drupal';

interface LoginCredentials {
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;

  private constructor() {
    this.loadTokenFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Load token from localStorage on initialization
  private loadTokenFromStorage(): void {
    this.accessToken = localStorage.getItem('access_token');
  }

  // Save token to localStorage
  private saveTokenToStorage(token: string): void {
    localStorage.setItem('access_token', token);
    this.accessToken = token;
  }

  // Remove token from localStorage
  private removeTokenFromStorage(): void {
    localStorage.removeItem('access_token');
    this.accessToken = null;
  }

  // OAuth2 login
  public async login(credentials: LoginCredentials): Promise<TokenResponse> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('client_id', DRUPAL_CONFIG.oauth.clientId);
      params.append('client_secret', DRUPAL_CONFIG.oauth.clientSecret);
      params.append('username', credentials.username);
      params.append('password', credentials.password);

      const response: AxiosResponse<TokenResponse> = await axios.post(
        `${DRUPAL_CONFIG.baseURL}${DRUPAL_CONFIG.endpoints.token}`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const tokenData = response.data;
      this.saveTokenToStorage(tokenData.access_token);

      return tokenData;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Authentication failed. Please check your credentials.');
    }
  }

  // Logout
  public logout(): void {
    this.removeTokenFromStorage();
  }

  // Get current access token
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Get authorization headers for API requests
  public getAuthHeaders(): Record<string, string> {
    if (!this.accessToken) {
      throw new Error('User is not authenticated');
    }

    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
