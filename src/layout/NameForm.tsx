import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient"; // Assicurati di avere il client Supabase configurato correttamente

const GameLogin: React.FC = () => {
  const [username, setUsername] = useState(""); // Stato per l'username
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato per tracciare il login
  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([]); // Stato per i giocatori online
  const [channel, setChannel] = useState<any>(null); // Stato per il canale

  // Funzione che si attiva al click del bottone di login
  const handleLogin = async () => {
    if (!username) {
      alert("Please enter a username!");
      return;
    }

    // Creiamo il canale di presence
    const newChannel = supabase.channel("game-room", {
      config: {
        presence: {
          key: username, // Usa l'username come chiave univoca
        },
      },
    });

    // Proviamo a sottoscriverci al canale e gestire eventuali errori
    newChannel.subscribe(async (status, error) => {
      if (error) {
        console.error("Errore nella sottoscrizione al canale:", error.message);
        return;
      }

      if (status === "SUBSCRIBED") {
        console.log(`${username} is subscribed to game-room`);

        // Imposta lo stato come loggato
        setIsLoggedIn(true);

        // Aggiungi gestione degli eventi di presence
        newChannel
          .on("presence", { event: "sync" }, () => {
            const state = newChannel.presenceState();
            const players = Object.keys(state);
            setOnlinePlayers(players); // Aggiorna la lista dei giocatori online
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
        // Salva il canale nello stato
        setChannel(newChannel);
      }
    });
  };

  // Funzione per disconnettere l'utente e rimuovere la presenza
  const handleLogout = () => {
    if (channel) {
      supabase.removeChannel(channel); // Rimuovi il canale
      setIsLoggedIn(false); // Reimposta lo stato di login
      setUsername(""); // Reset dell'username
      setOnlinePlayers([]); // Svuota la lista dei giocatori online
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {username}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <h3>Players Online</h3>
          <ul>
            {onlinePlayers.map((player) => (
              <li key={player}>{player}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameLogin;
