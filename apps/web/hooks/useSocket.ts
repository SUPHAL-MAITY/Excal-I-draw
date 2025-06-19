import { useState,useEffect } from "react"
import { WS_URL } from "../app/config"


export function useSocket(){
    const [loading,setLoading]=useState(true)
    const [socket,setSocket]=useState<WebSocket>()

    

    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjczNTU2ZC1iYTA4LTQ3ODQtOTI1OC1iZGE5ODE3ZmY3NjMiLCJpYXQiOjE3NTAyMjc0NjR9.fgzsTW9eX1Jm6Ym1ONhlH9iAaw5aClHU66iEB2IYvio`)
        ws.onopen=()=>{
            setLoading(false)
            setSocket(ws)
        }
    },[])

    return {
        socket,loading
    }


     



}
