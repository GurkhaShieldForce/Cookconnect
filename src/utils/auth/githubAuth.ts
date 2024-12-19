// src/utils/auth/githubAuth.ts
import { environmentConfig } from '../../config/environment.config';

export class GithubAuthService {
    private baseUrl = environmentConfig.baseUrl;

    async initiateAuth(): Promise<void> {
        const authUrl = new URL('https://github.com/login/oauth/authorize');
        
        const params = {
            client_id: environmentConfig.auth.github.clientId,
            redirect_uri: environmentConfig.auth.github.redirectUri,
            scope: 'user:email',
            state: this.generateStateParameter(),
        };

        authUrl.search = new URLSearchParams(params).toString();
        localStorage.setItem('oauth_state', params.state);

        return this.handleAuthWindow(authUrl.toString());
    }

    private handleAuthWindow(authUrl: string): Promise<void> {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            authUrl,
            'GitHubAuth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        return this.handleAuthCallback(popup);
    }

    private handleAuthCallback(popup: Window | null): Promise<void> {
        return new Promise((resolve, reject) => {
            const messageHandler = (event: MessageEvent) => {
                if (event.origin !== this.baseUrl) return;

                this.processAuthMessage(event, popup, messageHandler, resolve, reject);
            };

            window.addEventListener('message', messageHandler);
        });
    }

    private processAuthMessage(
        event: MessageEvent,
        popup: Window | null,
        messageHandler: (event: MessageEvent) => void,
        resolve: () => void,
        reject: (error: Error) => void
    ): void {
        if (event.data.type === 'GITHUB_AUTH_SUCCESS') {
            const { state } = event.data;
            
            if (state !== localStorage.getItem('oauth_state')) {
                this.cleanupAuth(popup, messageHandler);
                reject(new Error('Invalid state parameter'));
                return;
            }

            resolve();
        }

        if (event.data.type === 'GITHUB_AUTH_ERROR') {
            this.cleanupAuth(popup, messageHandler);
            reject(new Error(event.data.error));
        }
    }

    private cleanupAuth(popup: Window | null, messageHandler: (event: MessageEvent) => void): void {
        window.removeEventListener('message', messageHandler);
        localStorage.removeItem('oauth_state');
        popup?.close();
    }

    private generateStateParameter(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }
}