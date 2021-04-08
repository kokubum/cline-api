export interface ApiMessage {
  [field: string]: string;
}

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly status: string;

  public readonly isOperational: boolean;

  public readonly apiMessage: ApiMessage | null;

  constructor(
    generalMessage: string,
    statusCode: number,
    apiMessage?: ApiMessage
  ) {
    super(generalMessage);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.apiMessage = apiMessage || null;
  }
}
