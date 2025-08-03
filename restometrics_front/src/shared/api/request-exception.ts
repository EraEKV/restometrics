import { ErrorResponse } from "./types";

export class RequestException extends Error {
  constructor(
    readonly message: string,
    readonly data?: ErrorResponse
  ) {
    super(message)
  }
}
