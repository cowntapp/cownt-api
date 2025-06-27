interface CustomErrorParams {
  message: string;
  statusCode: number;
  status: string;
}

export class CustomError extends Error {
  statusCode: number;
  status: string;

  constructor({ message, statusCode, status }: CustomErrorParams) {
    super(message);

    this.statusCode = statusCode;
    this.status = status;
  }
}
