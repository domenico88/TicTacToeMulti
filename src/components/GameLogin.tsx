import {
  Avatar,
  AvatarGroup,
  Button,
  Input,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Chat from "./Chat";
import RealTimeDrawing from "./RealTimeDrawingBoard";
import WhatToDrow from "./WhatToDrawGpt";
import supabase from "../supabaseClient";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import Background from "../media/background.webp";

import { IoLogOutOutline } from "react-icons/io5";

const GameLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [openChat, setOpenChat] = useState<boolean>(false);
  const handleLogin = async () => {
    if (!username) {
      alert("Please enter a username!");
      return;
    }

    const newChannel = supabase.channel("game-room", {
      config: {
        presence: {
          key: username,
        },
        broadcast: { self: true },
      },
    });

    newChannel.subscribe(async (status, error) => {
      if (error) {
        console.error("Errore nella sottoscrizione al canale:", error.message);
        return;
      }

      if (status === "SUBSCRIBED") {
        console.log(`${username} is subscribed to game-room`);

        setIsLoggedIn(true);

        newChannel
          .on("presence", { event: "sync" }, () => {
            const state = newChannel.presenceState();
            const players = Object.keys(state);
            setOnlinePlayers(players);
            console.log("Players online:", players);
          })
          .on("presence", { event: "join" }, ({ key }) => {
            console.log(`${key} has joined`);
          })
          .on("presence", { event: "leave" }, ({ key }) => {
            console.log(`${key} has left`);
          });

        newChannel.track({
          user: username,
          online_at: new Date().toISOString(),
        });

        setChannel(newChannel);
      }
    });
  };

  const handleLogout = () => {
    if (channel) {
      supabase.removeChannel(channel);
      setIsLoggedIn(false);
      setUsername("");
      setOnlinePlayers([]);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        backgroundImage: `url("${Background}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      {!isLoggedIn ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <Input
              type="text"
              placeholder="Enter username"
              value={username}
              sx={{ border: "3px solid #03045e", borderRadius: "20px" }}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              sx={{
                width: "100%",
                backgroundColor: "transparent",
                border: "3px solid #03045e",
                borderRadius: "20px",
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {openChat && <Chat channel={channel} username={username} />}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "24px",
              alignItems: "center",
              background:
                "linear-gradient(90deg, rgba(0,180,216,1) 0%, rgba(251,133,0,1) 75%)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <AvatarGroup>
                {onlinePlayers.map((player) => (
                  <Avatar
                    key={player}
                    bg="#fb8500"
                    name={player.substring(0, 1).toUpperCase()}
                  />
                ))}
              </AvatarGroup>
              <IoChatboxEllipsesOutline
                size="2em"
                color="white"
                onClick={() => setOpenChat(!openChat)}
                style={{ cursor: "pointer", marginLeft: 10 }}
              />
              {onlinePlayers.length >= 2 && <WhatToDrow />}
            </div>

            <div>
              <IoLogOutOutline
                onClick={handleLogout}
                color="white"
                size="2rem"
              />
            </div>
          </div>
          {onlinePlayers.length < 2 && (
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <span>Waiting for other players...</span>
              </div>
              <div>
                <Stack direction="row" spacing={4}>
                  <Spinner color="#355070" size="xl" />
                </Stack>
              </div>
            </div>
          )}
          {onlinePlayers.length >= 2 && <RealTimeDrawing channel={channel} />}
        </div>
      )}
    </div>
  );
};

export default GameLogin;
