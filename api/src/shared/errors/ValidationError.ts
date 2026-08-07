import { BaseError } from './BaseError';
import type { ZodIssue } from 'zod';

export class ValidationError extends BaseError {
  public readonly errors: ZodIssue[];

  constructor(message = 'Validation failed', errors: ZodIssue[] = []) {
    super(message, 400);
    this.errors = errors;
  }
}
