import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {number, z} from "zod"

export async function Passager(app:FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/passengers",{
        schema:{
            tags:["Passengers"],
            description:"returns a list of all the passengers",
            response:{
                200:z.array(z.object({
                        Id:z.number().int(),
                        Name:z.string(),
                        Target:z.string(),
                        BusId:z.string().uuid(),
                        position:z.number().nullable()
                        })
                    ),
                400:z.object({
                    ErrorCode:z.number().int(),
                    Description: z.string()
                })
            }
        }
    },async(req,res)=>{
        const object = await prisma.passager.findMany({
            select:{
                Id:true,
                Name:true,
                Target:true,
                BusId:true,
                busnew:false,
                position:true
            }
        })
        if(object){
            res.status(200).send(object)
        }else{
            res.status(400).send({
                ErrorCode:400,
                Description: "there's no actual Passager"
            })
        }

    })

    //passager creation
    app.withTypeProvider<ZodTypeProvider>().post("/passengers",{
        schema:{
            tags:["Passengers"],
            description:"Set up the creation of the passenger",
            body:z.object({
                Name:z.string(),
                BusId:z.string().uuid(),
                position:z.number().optional(),
                Target:z.string()
            }),
            response:{
                201:z.object({
                    StatusCode:z.number().int(),
                    Description:z.string(),
                    CreatedObject:z.object({
                        Id:z.number().int(),
                        Name:z.string(),
                        BusId:z.string().uuid(),
                        position:z.number().nullable(),
                        Target:z.string()
                    })
                }),
                400:z.object({
                    StatusCode:z.number().int(),
                    Description:z.string(),
                })
            }
        }
    },async (req,res)=>{
        const getBus = await prisma.bus.findUnique({
            where:{Id:req.body.BusId}
        })
        if(getBus){
            const CreatedObject = await prisma.passager.create({
                data:req.body
            })
            res.status(201).send({
                StatusCode:201,
                Description:"Passager created",
                CreatedObject,
            })
        }else{
            res.status(400).send({
                StatusCode:400,
                Description:"the specified bus din't exists"
            })
        }
    })

    //passenger return of specific information
    app.withTypeProvider<ZodTypeProvider>().get("/passengers/:PuID",{
        schema:{
            params:z.object({
                PuID:z.string()
            }),
            description:"return an specific Passenger by recieving the Passenger Id as Parameter",
            tags:["Passengers"],
            response:{
                200:z.object({
                    StatusCode:z.number(),
                    Description:z.string(),
                    ReturnedObject:z.object({
                        Id:z.number().int(),
                        Name:z.string(),
                        BusId:z.string().uuid(),
                        position:z.number().nullable(),
                        Target:z.string()
                    })
                }),
                404:z.object({
                    StatusCode:z.number().int(),
                    Description:z.string()
                })
            }
        }
    },async (req,res)=>{
        const ReturnedObject = await prisma.passager.findUnique({
            where:{
                Id:Number(req.params.PuID)
            }
        })

        if(ReturnedObject){
            res.status(200).send({
                StatusCode:200,
                Description:"Returned successfully",
                ReturnedObject,
            })
        }else{
            res.status(404).send({
                StatusCode:404,
                Description:"Passenger not found"
            })
        }
        
    })

    //delete the Passengers
    app.withTypeProvider<ZodTypeProvider>().delete("/passengers/:PuId",{
        schema:{
            description:"Route used to delete buses by recieving the Passengers Id as parameter",
            tags:["Passengers"],
            params:z.object({
                PuId:z.string()
            }),
            response:{
                200:z.object({
                    StatusCode:z.number(),
                    Description:z.string(),
                    ReturnedObject:z.object({
                        Id:z.number().int(),
                        Name:z.string(),
                        BusId:z.string().uuid(),
                        position:z.number().nullable(),
                        Target:z.string()
                    })
                }),
                404:z.object({
                    StatusCode:z.number().int(),
                    Description:z.string()
                })
            }
        }
    },async (req,res)=>{
        const searchObject = await prisma.passager.findUnique({
            where:{
                Id:Number(req.params.PuId)
            }
        })

        if(searchObject){
            const ReturnedObject = await prisma.passager.delete({
                where:{
                    Id:Number(req.params.PuId)
                }
            })
            res.status(200).send({
                StatusCode:200,
                Description:"Passenger removed",
                ReturnedObject,
            })
        }else{
            res.status(404).send({
                StatusCode:404,
                Description:"Passenger not found"
            })
        }
    })
}

