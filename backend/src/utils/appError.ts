export class AppError extends Error {
  public status: number;
  public success: boolean;

  constructor(message: string, status: number) {
    super(message);

    this.status = status;
    this.success = false;

    const errorConstructor = Error as ErrorConstructor & {
      captureStackTrace?: (
        targetObject: object,
        constructorOpt?: Function,
      ) => void;
    };

    errorConstructor.captureStackTrace?.(this, this.constructor);
  }
}
