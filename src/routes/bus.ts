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

    //delete the specified bus
    app.withTypeProvider<ZodTypeProvider>().delete("/bus/:BusId",{
        schema:{
            description:"Route used to delete the specified bus with the Id who matches the parameter BusId. This route also deletes all the passengers inside this bus. ",
            tags:["Bus"],
            params:z.object({
                BusId: z.string().uuid()
            }),
            response:{
                200:z.object({
                    StatusCode:z.number(),
                    Description:z.string(),
                    selectedPassagersList: z.array(z.object({
                        Id:z.number(),
                        Name:z.string(),
                    }))
                }),
                404: z.object({
                    StatusCode:z.number(),
                    Description:z.string()
                })
            }
        }
    },async (req,res)=>{
        const [selectedBus,selectedPassagersList] = await Promise.all([
            prisma.bus.findUnique({
            where:{
                Id:req.params.BusId
            }
            }),
            prisma.passager.findMany({
                where:{
                    BusId:req.params.BusId
                },
                select:{
                    Name:true,Id:true,BusId:false,busnew:false,Target:false,position:false
                }
            })
        ])

        if(selectedBus){

            if(selectedPassagersList[0]){
                selectedPassagersList.forEach(async Element => {
                    await prisma.passager.delete({
                        where:{
                            Id:Element.Id
                        }
                    }).then(async()=>{
                        await prisma.bus.delete({
                            where:{
                                Id:req.params.BusId
                            }
                        })
                    })
                })
            }else{
                await prisma.bus.delete({
                    where:{Id:req.params.BusId}
                })
            }

            res.status(200).send({
                StatusCode:200,
                Description:"the specified ID exists. The bus and all its passengers where deleted",
                selectedPassagersList,
                }
            )
        }else{
            res.status(404).send({
                StatusCode:404,
                Description:"There's no bus with the specified ID"
            })
        }
    })
}
