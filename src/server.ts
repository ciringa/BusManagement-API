import {fastify} from "fastify"
import { Router } from "./Router"
import { SwaggerOPT } from "./lib/swagger"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import 
{
    jsonSchemaTransform,
    createJsonSchemaTransform,
    serializerCompiler,
    validatorCompiler, 
    ZodTypeProvider 
} from "fastify-type-provider-zod";


const app = fastify()
const port = Number(process.env.PORT) || 4000



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


app.register(Router)



app.listen({
    port: port
},(err,path)=>{
    console.log(err || path)
})