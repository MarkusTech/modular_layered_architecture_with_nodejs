import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "My Backend API",
            version: "1.0.0",
            description: "Production-grade API documentation for my backend",
            contact: {
                name: "Developer",
                email: "developer@example.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1",
                description: "Development server",
            },
            {
                url: "https://api.myapp.com/api/v1",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "error" },
                        message: { type: "string", example: "Invalid credentials" },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/modules/auth/*.ts", "./src/modules/auth/*.routes.ts"], // <- Point to your route & service files
};

export const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
