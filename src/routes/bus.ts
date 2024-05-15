import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod";
import { z } from "zod";
import { error } from "console";

export async function Bus(app: FastifyInstance) {
    //app.register(ZodTypeProvider);


    //bus reading
    app.withTypeProvider<ZodTypeProvider>().get("/bus",{
        schema: {
            description:"Route used to return all the buses and it's informations including the passengers list",
            response:{
                200: z.array(z.object({
                    Id: z.string().uuid(),
                    Model: z.string(),
                    color: z.string().nullable(),
                }),),
            },
            tags:["Bus"]
        },
    }, async (req, res) => {
        const sla = await prisma.bus.findMany({
            include:{
                Passagers:false,
            }
        });
        res.status(200).send(sla);
    });


    //BUS creation
    app.withTypeProvider<ZodTypeProvider>().post("/bus",{
        schema:{
            description:"Route used to create Bus",
            body:z.object({
                Model:z.string(),
                color:z.string().nullable()
            }),
            response:{
                200:z.object({
                    StatusCode:z.number().int(),
                    Description:z.string(),
                    CreatedObject:z.object({})
                }),
                400:z.object({
                    StatusCode:z.number().int(),
                    Description:z.string()
                })
            },
            tags:["Bus"]
    }
    },async (req,res)=>{
        const dataSchema = z.object({
                Model: z.string(),
                color: z.string().optional(),
            })

         const {Model,color} = dataSchema.parse(req.body)
         const CreatedObject = await prisma.bus.create({
            data:{
                Model,
                color
             }
         })
         if(CreatedObject){
            res.status(201).send({
                StatusCode:201,
                Description:"object created",
                CreatedObject,
            })
         }else{
            res.status(400).send({
                StatusCode:400,
                Description:"object wasn't created, there's no enougth information or some data is in bad format"
            })
         }

    })
    
    //get specific data about some bus
    app.withTypeProvider<ZodTypeProvider>().get("/bus/:BusID",{
        schema:{
            description:"Route used to return informations about a specific Bus, including all its infos and all the passengers inside it",
            params:z.object({
                BusID:z.string().uuid()
            }),
            response:{
                200:z.object({
                    TrigeredBus:z.object({
                        Id:z.string().uuid(),
                        color: z.string().nullable(),
                        Model: z.string(),

                    }),
                    UsersInBus:z.array(z.object({
                        Id:z.number().int(),
                        Name:z.string(),
                        Target:z.string(),
                        position:z.number().nullable()
                    },))
                })
            },
            tags:["Bus"]
        }
    },async(req,res)=>{
        const [findUnique,findMany] = await Promise.all([ 
            prisma.bus.findUnique({
                where:{
                    Id:req.params.BusID
                },
                select:{
                    Id:true,
                    Model:true,
                    color:true,
                    Passagers:false
                }
                }),
            prisma.passager.findMany({
                    where:{
                        BusId:req.params.BusID
                    },
                    select:{
                        Id:true,
                        Name:true,
                        Target:true,
                        position:true,
                        BusId:false,
                        busnew:false
                    }
                })
        ])
        res.status(200).send({
            TrigeredBus:findUnique,
            UsersInBus:findMany
        })
    })  

}
