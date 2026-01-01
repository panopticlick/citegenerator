export interface ValidationResult {
  valid: boolean;
  sanitized?: string;
  error?: string;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
