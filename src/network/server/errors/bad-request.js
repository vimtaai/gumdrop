const defaultError = "<h1>400 - Bad Request</h1>";

export class BadRequest extends Error {
  constructor(errorMessage = "", errorDetails = {}) {
    super(defaultError + errorMessage);
    this.httpErrorCode = 400;
    this.details = errorDetails;
  }
}
