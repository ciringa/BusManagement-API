"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_fastify = require("fastify");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/bus.ts
var import_zod = require("zod");
async function Bus(app2) {
  app2.withTypeProvider().get("/bus", {
    schema: {
      response: {
        200: import_zod.z.array(import_zod.z.object({
          Id: import_zod.z.string().uuid(),
          Model: import_zod.z.string(),
          color: import_zod.z.string().nullable(),
          Passagers: import_zod.z.array(import_zod.z.object({}))
        }))
      }
    }
  }, async (req, res) => {
    const sla = await prisma.bus.findMany({
      include: {
        Passagers: true
      }
    });
    res.status(200).send(sla);
  });
}

// src/routes/Passagers.ts
async function Passager(app2) {
}

// src/routes/process.ts
async function Process(app2) {
}

// src/Router.ts
async function Router(app2) {
  app2.register(Bus);
  app2.register(Passager);
  app2.register(Process);
}

// src/lib/swagger.ts
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");
async function SwaggerOPT(app2) {
  app2.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
  app2.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
  app2.register(import_swagger.default, {
    openapi: {
      info: {
        title: "Bus API",
        description: "A Professional Bus Organizer sistem for enterprises",
        version: "1.0.0"
      },
      servers: []
    },
    transform: import_fastify_type_provider_zod.jsonSchemaTransform
  });
  app2.register(import_swagger_ui.default, {
    routePrefix: "/docs"
  });
}

// src/server.ts
var app = (0, import_fastify.fastify)();
var port = 2333;
app.register(Router);
app.register(SwaggerOPT);
app.listen({
  port: process.env.PORT ? Number(process.env.port) : port
}, (err, path) => {
  console.log(err || path);
});
