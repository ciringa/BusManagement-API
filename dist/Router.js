"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/Router.ts
var Router_exports = {};
__export(Router_exports, {
  Router: () => Router
});
module.exports = __toCommonJS(Router_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/bus.ts
var import_zod = require("zod");
async function Bus(app) {
  app.withTypeProvider().get("/bus", {
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
async function Passager(app) {
}

// src/routes/process.ts
async function Process(app) {
}

// src/Router.ts
async function Router(app) {
  app.register(Bus);
  app.register(Passager);
  app.register(Process);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Router
});
