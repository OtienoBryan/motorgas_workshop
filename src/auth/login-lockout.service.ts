import { Injectable } from '@nestjs/common';

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;

/** Per-account lockout after repeated failed logins (in-memory, resets on restart). */
@Injectable()
export class LoginLockoutService {
  private readonly attempts = new Map<string, { failures: number; lockedUntil: number }>();

  isLocked(email: string): boolean {
    const entry = this.attempts.get(email.toLowerCase());
    return !!entry && entry.lockedUntil > Date.now();
  }

  recordFailure(email: string): void {
    const key = email.toLowerCase();
    const entry = this.attempts.get(key) ?? { failures: 0, lockedUntil: 0 };
    if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
      entry.failures = 0;
      entry.lockedUntil = 0;
    }
    entry.failures += 1;
    if (entry.failures >= MAX_FAILURES) {
      entry.lockedUntil = Date.now() + LOCK_MS;
    }
    this.attempts.set(key, entry);
  }

  recordSuccess(email: string): void {
    this.attempts.delete(email.toLowerCase());
  }
}
