import { useEffect, useRef, useState } from "react";
import { Button, Input } from "@chakra-ui/react";

import { useAppContext } from "../context/appContext";
import supabase from "../supabaseClient";

const NameForm = () => {
  const [username, setUsername] = useState<string>("");

  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([]);
  const userStatus = {
    user: 'user-1',
    online_at: new Date().toISOString(),
  }
  useEffect(() => {
    // Crea un canale
    const channel = supabase.channel('game', {
      config: {
        presence: {
          key: 'player-' + Math.floor(Math.random() * 1000), // Un identificativo univoco per ciascun giocatore
        },
      },
    });

    // Abbonati agli eventi di presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const players = Object.keys(state);
        setOnlinePlayers(players);
        console.log('Players online:', players);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        console.log(`${key} has joined`);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        console.log(`${key} has left`);
      });

      channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') { return }
    
      const presenceTrackStatus = await channel.track(userStatus)
      console.log(presenceTrackStatus)
    })

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const handleSubmit = (e: any) => {
    setUsername(e.target.value);
  };

  return (
    <div
      style={{
        backgroundColor: "orange",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form style={{ marginRight: "20px" }}>
        <div
          style={{
            margin: "0 auto",
          }}
        >
          <Input
            onChange={handleSubmit}
            placeholder="Insert your nickname"
            sx={{ borderColor: "black" }}
          ></Input>
        </div>
        <Button
          type="submit"
          style={{ width: "100%", marginTop: 24 }}
          disabled={!username}
          onClick={() => console.log("dwq")}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default NameForm;
