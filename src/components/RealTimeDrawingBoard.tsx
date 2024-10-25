import { Button } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Sheet from "../media/sheet.png";
import { GrPowerReset } from "react-icons/gr";

const RealTimeDrawing: React.FC<{ channel: any }> = ({ channel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    draw(offsetX, offsetY, false); 
  };

  
  const draw = (x: number, y: number, emit: boolean = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineTo(x, y);
    context.stroke();

   
    if (emit && channel) {
      channel.send({
        type: "broadcast",
        event: "draw",
        payload: { x, y },
      });
    }
  };

 
  const stopDrawing = () => {
    setIsDrawing(false);
  };

 
  const handleMouseMove = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    draw(offsetX, offsetY);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    channel.send({
      type: "broadcast",
      event: "clear_draw",
    });
  };

  channel.on("broadcast", { event: "draw" }, (payload: any) => {
    const { payload: x, payload: y } = payload;
    draw(x.x, y.y, false);
  });

  channel.on("broadcast", { event: "clear_draw" }, (payload: any) => {
    clearCanvas();
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        alignContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 24,
      }}
    >
      <div>
        <GrPowerReset
          onClick={clearCanvas}
          title="Clear drawing"
          style={{
            position: "absolute",
            marginTop: "30px",
            marginLeft: "145px",
            cursor: "pointer",
          }}
        />
      </div>
      <div
        style={{
          backgroundImage: `url("${Sheet}")`,
          backgroundRepeat: "no-repeat",
          background: "cover",
        }}
      >
        <canvas
          ref={canvasRef}
          width={350}
          height={525}
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default RealTimeDrawing;
