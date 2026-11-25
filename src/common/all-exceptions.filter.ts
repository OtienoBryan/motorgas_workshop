import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

/** Logs full errors server-side; in production, 5xx responses expose no internal details. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const req = host.switchToHttp().getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= 500) {
      console.error(`❌ [Error] ${req.method} ${req.url}:`, exception);
    }

    if (exception instanceof HttpException && (status < 500 || process.env.NODE_ENV !== 'production')) {
      const body = exception.getResponse();
      return res.status(status).json(typeof body === 'string' ? { statusCode: status, message: body } : body);
    }

    const message = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (exception as Error)?.message ?? 'Internal server error';
    return res.status(status).json({ statusCode: status, message });
  }
}
