export class HttpError extends Error {
  constructor(httpErrorCode, defaultMessage = "Unknown error", message = "", details = {}) {
    super(`<h1>${defaultMessage}</h1><strong>${message}</strong>`);

    this.httpErrorCode = httpErrorCode;
    this.details = details;
  }
}
