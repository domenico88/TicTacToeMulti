import { useEffect, useState } from "react";
import supabase from "../supabaseClient";

const GameRoom = () => {
  const [channel, setChannel] = useState<any>();

  useEffect(() => {
    setChannel(
      supabase.channel("game").subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Connesso al canale");
        }
      })
    );
  }, []);
};

export default GameRoom;
