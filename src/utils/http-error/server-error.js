import { HttpError } from "utils/http-error";

export class ServerError extends HttpError {
  constructor(message = "", details = {}) {
    super(500, "500 - Server Error", message, details);
  }
}
