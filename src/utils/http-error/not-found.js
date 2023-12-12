import { HttpError } from "../http-error.js";

export class NotFound extends HttpError {
  constructor(message = "The page you requested does not exist", details = {}) {
    super(404, "404 - Not Found", message, details);
  }
}
