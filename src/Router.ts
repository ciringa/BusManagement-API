import { FastifyInstance } from "fastify";
import { Bus } from "./routes/bus";
import { Passager } from "./routes/Passagers";
import { Process } from "./routes/process";

export async function Router(app:FastifyInstance) {


    app.get("/",(req,res)=>{
        res.send("Hey, Wellcome to the bus management API. Here you'll find all the tools to organize your bus fleet \n Check the documentation at /docs and learn about all the services that we can offer")
    })

    //rota para registro e manipulaçao de onibus
    app.register(Bus)

    //rota para registro e manipulaçao de passageiros
    app.register(Passager)

    //rota para execuçao do processamento de informações 
    app.register(Process)
    
}