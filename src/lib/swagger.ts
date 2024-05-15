import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { FastifyInstance } from "fastify"
import 
{
    jsonSchemaTransform,
    createJsonSchemaTransform,
    serializerCompiler,
    validatorCompiler, 
    ZodTypeProvider 
} 
from "fastify-type-provider-zod";

export async function SwaggerOPT(app:FastifyInstance){

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(fastifySwagger,{
        openapi: {
            info: {
              title: 'Bus API',
              description: 'A Professional Bus Organizer sistem for enterprises',
              version: '1.0.0',
            },
            servers: [],
          },
          
          transform: jsonSchemaTransform,
    })
    app.register(fastifySwaggerUi,{
        routePrefix:"/docs",
    })
}

