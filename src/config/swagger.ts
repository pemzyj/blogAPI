import swaggerJSDoc from 'swagger-jsdoc';


const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Blog API',
            version: '1.0.0',
            description: 'A RESTful Blog API with authentication',
        },

        servers: [
            {
                url: 'http://localhost:8080/api/v1',
                description: 'Development server'
            }
        ],
        
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.ts'] // Path to route files
};

export const swaggerSpec = swaggerJSDoc(options);