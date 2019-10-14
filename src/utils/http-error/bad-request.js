import { HttpError } from "utils/http-error";

export class BadRequest extends HttpError {
  constructor(message = "", details = {}) {
    super(300, "300 - Bad Request", message, details);
  }
}
