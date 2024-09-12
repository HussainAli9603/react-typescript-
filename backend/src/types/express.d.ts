import 'express';

declare module 'express' {
  interface Response {
    cookie(name: string, value: string, options?: any): this;
  }
}
