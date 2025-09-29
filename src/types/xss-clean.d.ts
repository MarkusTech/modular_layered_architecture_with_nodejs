declare module "xss-clean" {
  import { RequestHandler } from "express";

  interface XSSOptions {
    // Add any specific options if needed
  }

  function xssClean(options?: XSSOptions): RequestHandler;
  export default xssClean;
}
