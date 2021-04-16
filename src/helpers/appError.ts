export interface ApiMessage {
  [field: string]: string;
}

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly status: string;

  public readonly apiMessage: ApiMessage | null;

  public static buildErrorMessage(
    fields: string[],
    message: string
  ): ApiMessage {
    return fields.reduce((accumulator, field) => {
      accumulator[field] = message;
      return accumulator;
    }, {} as ApiMessage);
  }

  constructor(
    generalMessage: string,
    statusCode: number,
    apiMessage?: ApiMessage
  ) {
    super(generalMessage);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.apiMessage = apiMessage || null;
  }
}
