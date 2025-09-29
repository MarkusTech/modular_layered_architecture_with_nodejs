declare module "hpp" {
  import { RequestHandler } from "express";

  interface HPPOptions {
    whitelist?: string[];
    checkBody?: boolean;
    checkBodyOnlyForContentType?: string[];
    checkQuery?: boolean;
  }

  function hpp(options?: HPPOptions): RequestHandler;
  export default hpp;
}
