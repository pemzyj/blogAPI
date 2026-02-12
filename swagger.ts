import { fileURLToPath } from 'node:url';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const swaggerSpec = swaggerJsDoc ({
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
        },

        security: [
            {
                bearerAuth: []
            }
        ]
    },
    
    apis: ['./src/routes/*.ts'] // Path to route files
});



export default swaggerSpec;