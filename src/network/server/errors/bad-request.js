const defaultError = "<h1>400 - Bad Request</h1>";

export class BadRequest extends Error {
  constructor(errorMessage) {
    super(defaultError + errorMessage);
    this.httpErrorCode = 400;
  }
}
