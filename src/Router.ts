import { FastifyInstance } from "fastify";
import { Bus } from "./routes/bus";
import { Passager } from "./routes/Passagers";
import { Process } from "./routes/process";

export async function Router(app:FastifyInstance) {
    //rota para registro e manipulaçao de onibus
    app.register(Bus)

    //rota para registro e manipulaçao de passageiros
    app.register(Passager)

    //rota para execuçao do processamento de informações 
    app.register(Process)
    
}