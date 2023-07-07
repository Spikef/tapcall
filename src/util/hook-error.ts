export interface IErrorDetail {
  type?: string;
  hook?: string;
  receiver?: string;
  stack?: string;
}

export default class HookError extends Error {
  type?: string;
  hook?: string;
  receiver?: string;

  constructor(message: string, detail: IErrorDetail) {
    super(message);

    this.name = this.constructor.name;

    this.type = detail.type;
    this.hook = detail.hook;
    this.receiver = detail.receiver;

    if (detail.stack) {
      this.stack = detail.stack;
    }
  }
}
