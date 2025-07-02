"use client"

import { useState,useEffect } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "../../config";

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket]=useState<WebSocket | null>(null)
    

    useEffect(()=>{
      const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjczNTU2ZC1iYTA4LTQ3ODQtOTI1OC1iZGE5ODE3ZmY3NjMiLCJpYXQiOjE3NTAyMjc0NjR9.fgzsTW9eX1Jm6Ym1ONhlH9iAaw5aClHU66iEB2IYvio`)

      ws.onopen=()=>{
        setSocket(ws);
        const data=JSON.stringify({
            type:"join_room",
            roomId
        });
        console.log(data)
        ws.send(data)
      }
    },[])

    if(!socket){
        return (
            <div>
                Connecting to server .....
            </div>
        )
    }


    return (
        <>
        <Canvas roomId={roomId} socket={socket} />
        </>
    )

}