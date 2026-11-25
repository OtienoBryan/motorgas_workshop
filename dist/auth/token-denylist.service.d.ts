export declare class TokenDenylistService {
    private readonly revoked;
    revoke(jti: string, expSeconds: number): void;
    isRevoked(jti?: string): boolean;
    private prune;
}
