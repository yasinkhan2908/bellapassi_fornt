import "jquery";

declare module "parsleyjs";

declare global {
  interface ParsleyInstance {
    isValid(): boolean;
    validate(): boolean;
    reset(): void;
  }

  interface JQuery {
    parsley(...args: any[]): ParsleyInstance;
  }
}
