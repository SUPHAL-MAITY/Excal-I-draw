import axios from "axios"
import { HTTP_BACKEND } from "../config";




type Shape={
    type: "rect";
    x   : number ;
    y   : number;
    width : number;
    height : number ;
} | {
     type : "circle";
     centerX: number;
     centerY: number;
     radius: number ;
}

export async function initDraw(canvas :HTMLCanvasElement, roomId :string , socket : WebSocket){
    const ctx=canvas.getContext("2d")
    console.log("roomid in init as params",roomId)


    if(!ctx)  return ;


    let existingShapes: Shape[] =[]


    socket.onmessage=(event)=>{
        const message=JSON.parse(event.data)

        if(message.type == "chat"){
            const parsedShape =JSON.parse(message.message)
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes,canvas,ctx)
        }
    }




    clearCanvas(existingShapes,canvas,ctx)

    let clicked=false;
    let startX=0;
    let startY=0;


    canvas.addEventListener("mousedown",(e)=>{
       clicked=true;
       startX=e.clientX;
       startY=e.clientY;
       console.log("moude down",e.clientX)

    })



     canvas.addEventListener("mouseup",(e)=>{

        clicked=false;
        const width= e.clientX - startX;
        const height= e.clientY - startY;
        
        const shape :Shape={
            type:"rect",
            x: startX,
            y: startY,
            height,
            width

        }

        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({
                shape
            }),
            roomId
        }))

    })

     canvas.addEventListener("mousemove",(e)=>{

        if(clicked){
            const width= e.clientX - startX;
            const height= e.clientY - startY;
            clearCanvas(existingShapes,canvas,ctx)
            ctx.strokeStyle="rgba(255,255,255)"
            ctx.strokeRect(startX,startY,width,height)
        }

    })


}


function clearCanvas( existingShapes:Shape[] ,canvas: HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle="rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    
    existingShapes.map((shape)=>{
        if(shape.type==="rect"){
            ctx.strokeStyle="rgba(255,255,255)";
            ctx.strokeRect(shape.x,shape.y, shape.width, shape.height);
        }
    })

}


// async function getExistingShapes(roomId:string){
//     const res=await axios
// }
