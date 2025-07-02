

type Shape={
  type : "rect";
  x: number; 
  y:   number;
  width: number;
  height:number ;

} | {
    type: "circle"; 
    centerX: number ;
    centerY: number ;
    radius: number ;

}



export async function initDraw(canvas:HTMLCanvasElement){
    const ctx=canvas.getContext("2d")


    let existingShapes: Shape[]=[]

 


     
}