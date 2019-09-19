const defaultError = "<h1>404 - Not Found</h1>";

export class NotFound extends Error {
  constructor(errorMessage) {
    super(defaultError + errorMessage);
    this.httpErrorCode = 404;
  }
}
