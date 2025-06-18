import  { WebSocket, WebSocketServer } from "ws";
import {JWT_SECRET} from "@repo/backend-common/config"
import jwt  from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

interface User {
    ws:WebSocket,
    rooms:string[],
    userId:string
}

const users:User[]=[];


const wss=new WebSocketServer({port:8080})

function checkUser(token:string):string | null {
try {
    const decoded=jwt.verify(token,JWT_SECRET)

    if(typeof decoded == "string"){
        return null;
    }

    if(!decoded || !decoded.userId){
        return null;
    }

    return decoded.userId;
    
} catch (error) {
    return null;
}


}



wss.on("connection",function connection(ws,request){
    const url=request.url;
    console.log("url",url)
    if(!url){
        return;
    }

    const queryParam= new URLSearchParams(url.split("?")[1])
    const token=queryParam.get("token") || ""

    const userId=checkUser(token)

    if(userId==null){
        ws.close()
        return;
    }

    users.push({
        userId,
        rooms:[],
        ws
    })

     ws.on("message",async function(data){
        let parsedData;
        if(typeof data !== "string"){
            parsedData=JSON.parse(data.toString())
        }else{
            parsedData=JSON.parse(data)
        }

        if(parsedData.type=="join_room"){
        const user=users.find(x =>x.ws ===ws)
        user?.rooms.push(parsedData.roomId)
        }

        if(parsedData.type === "leave_room"){
            const user=users.find(x=> x.ws ===ws)
            if(!user){
                return;
            }

            user.rooms=user?.rooms.filter(x => x !== parsedData.roomId)
        }
            console.log("message received")
            console.log(parsedData)

            if(parsedData.type==="chat"){
                const roomId=parsedData.roomId;
                const message=parsedData.message;


                await prismaClient.chat.create({
                data:{
                    roomId:Number(roomId),
                    message,
                    userId
                }
             })
             
             users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify(
                        {
                        type:"chat",
                        message:message,
                        roomId
                    }))
                }
            
             })

            }
        
   
     })

   

})

