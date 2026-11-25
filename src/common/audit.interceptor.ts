import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const LOG_DIR = process.env.AUDIT_LOG_DIR || join(process.cwd(), 'logs');

/** Writes one JSON line per state-changing request (who, what, when, outcome). Request bodies are never logged. */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (!MUTATING.has(req.method)) {
      return next.handle();
    }

    const res = context.switchToHttp().getResponse();
    const started = Date.now();
    const write = (outcome: string, status: number) => {
      const entry = {
        ts: new Date().toISOString(),
        userId: req.user?.sub ?? null,
        role: req.user?.role ?? null,
        method: req.method,
        path: String(req.originalUrl || req.url).split('?')[0],
        ip: req.ip,
        status,
        outcome,
        ms: Date.now() - started,
      };
      const line = JSON.stringify(entry);
      console.log(`📝 [Audit] ${line}`);
      mkdir(LOG_DIR, { recursive: true })
        .then(() => appendFile(join(LOG_DIR, 'audit.log'), line + '\n'))
        .catch(() => undefined);
    };

    return next.handle().pipe(
      tap({
        next: () => write('success', res.statusCode),
        error: (err) => write('failure', err?.status ?? 500),
      }),
    );
  }
}
