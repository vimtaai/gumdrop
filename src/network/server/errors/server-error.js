const defaultError = "<h1>500 - Server Error</h1>";

export class ServerError extends Error {
  constructor(errorMessage = "", errorDetails) {
    super(defaultError + errorMessage);
    this.httpErrorCode = 500;
    this.details = errorDetails;
  }
}
