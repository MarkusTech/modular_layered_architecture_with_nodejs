// Support for serverless-http
declare module "serverless-http";

// Extend Express Request type
import "express-serve-static-core";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: number;
            role: string;
        };
    }
}
