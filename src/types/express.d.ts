declare namespace Express {
    export interface Request {
        user?: {
            id: number;
            role: string;
        };
        file?: Express.Multer.File;
    }
}
