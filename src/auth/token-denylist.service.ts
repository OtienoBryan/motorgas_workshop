import { Injectable } from '@nestjs/common';

/** In-memory denylist of revoked token ids (jti). Entries are dropped once the token would have expired anyway. */
@Injectable()
export class TokenDenylistService {
  private readonly revoked = new Map<string, number>();

  revoke(jti: string, expSeconds: number): void {
    this.revoked.set(jti, expSeconds);
    this.prune();
  }

  isRevoked(jti?: string): boolean {
    return !!jti && this.revoked.has(jti);
  }

  private prune(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [jti, exp] of this.revoked) {
      if (exp < now) this.revoked.delete(jti);
    }
  }
}
