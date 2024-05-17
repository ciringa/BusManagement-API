import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {array, number, z} from "zod"


export async function Process(app:FastifyInstance) {
     
    app.withTypeProvider<ZodTypeProvider>().put("/process/:BusId",{
        schema:{
            params:z.object({
                BusId:z.string().uuid()
            }),
            description:"Process the passenger position based in the specified passenger Targets, following the criterion stabilished by API standards. This method uses the BusId to update all the passengers inside the bus",
            response:{
                200:z.object({
                    StatusCode:z.number(),
                    Description:z.string(),
                    UpdatedObjects:z.array(z.object({
                        Id:z.number(),
                        Name:z.string(),
                        position:z.number().int().nullable()
                    }))
                }),
                404:z.object({
                    StatusCode:z.number().int(),
                    Description:z.string()
                })
            }
        }
    },async(req,res)=>{
        const [getSpecifiedBus,passengers] = await Promise.all([
            prisma.bus.findUnique({
                where:{Id:req.params.BusId}
            }),
            prisma.passager.findMany({
                where:{BusId:req.params.BusId}
            })
        ])
        if(getSpecifiedBus){
            var highPriority:number[] = []
            var MediunmPriority:number[] = []
            var lowPriority:number[] = []
            var altList:number[] = []


            passengers.forEach((Element) =>{
                if(Element.Target=="A"){
                   //console.log(Element.Id)
                   highPriority.push(Element.Id)
                }else if(Element.Target=="B"){
                    //console.log(Element.Id)
                    MediunmPriority.push(Element.Id)
                }else{
                   //console.log(Element.Id)
                    lowPriority.push(Element.Id)
                }
            })

            altList = highPriority.concat(MediunmPriority,lowPriority)
            
            altList.forEach(updater)
            async function updater(item:number, index:number){
                const updatedFunction = await prisma.passager.update({
                    where:{
                        Id:item
                    },
                    data:{
                        position:index
                    }

                })
                console.log("updated following Id:",item," to position:",index, "to follow the target:",updatedFunction.Target)
            }

            res.status(200).send({
                StatusCode:200,
                Description:"all passengers where alocated to meet reported standards.",
                UpdatedObjects:await prisma.passager.findMany({
                    where:{
                        BusId:req.params.BusId
                    },
                    select:{
                        Id:true,position:true,Name:true,busnew:false,BusId:false
                    }
                })
            })
        }else{
            res.status(404).send({
                StatusCode:404,
                Description:"the specified bus din't exists"
            })
        }

    })


}