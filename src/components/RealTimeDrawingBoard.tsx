import { Button } from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import supabase from "../supabaseClient";

const RealTimeDrawing: React.FC<{ channel: any }> = ({ channel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  // Funzione per iniziare a disegnare
  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    draw(offsetX, offsetY, false); // Disegna il punto iniziale
  };

  // Funzione che gestisce il disegno mentre il mouse si muove
  const draw = (x: number, y: number, emit: boolean = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineTo(x, y);
    context.stroke();

    // Invia le coordinate al canale di broadcast in tempo reale
    if (emit && channel) {
      channel.send({
        type: "broadcast",
        event: "draw",
        payload: { x, y },
      });
    }
  };

  // Quando il disegno termina
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Funzione che traccia il movimento del mouse
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
      }}
    >
      <div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: "1px solid black" }}
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      <div>
        <Button onClick={clearCanvas} sx={{ width: 400, marginTop: "8px" }}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default RealTimeDrawing;
