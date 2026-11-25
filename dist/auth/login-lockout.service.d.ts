export declare class LoginLockoutService {
    private readonly attempts;
    isLocked(email: string): boolean;
    recordFailure(email: string): void;
    recordSuccess(email: string): void;
}
