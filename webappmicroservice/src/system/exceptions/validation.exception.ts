export class ValidationException extends Error {
  constructor(public readonly errors: Record<string, any>) {
    super();
  }
}
