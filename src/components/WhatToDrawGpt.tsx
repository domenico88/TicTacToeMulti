import { Button, Input, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { MdOutlineDraw } from "react-icons/md";

const WhatToDrow: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [context, setContext] = useState();
  const [gptUserRequest, setGptUserRequest] = useState<string>();
  const getContext = async (gptUserRequest: string) => {
    if (gptUserRequest) {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Suggerisci un contesto che può essere un oggetto, un'azione, un animale , qualcosa da mangiare per disegnarlo o altro.In massimo tre parole.",
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: gptUserRequest,
                  },
                ],
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const generatedContext = response.data.choices[0].message.content;
        setContext(generatedContext);
      } catch (error) {
        console.error("Errore nel recupero del contesto:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Input
          placeholder="What would you like to draw?"
          onChange={(e) => setGptUserRequest(e.target.value)}
          style={{ width: "50%" }}
          sx={{
            "&::placeholder": {
              textOverflow: "ellipsis !important",
              color: "white",
            },
          }}
        />
        <MdOutlineDraw
          onClick={() => getContext(gptUserRequest || "")}
          size="2rem"
          color="white"
          style={{ marginLeft: 24, cursor: "pointer" }}
        />
      </div>
      <div>
        {loading ? (
          <Spinner />
        ) : (
          <div style={{ marginTop: 8, fontWeight: "bold", color: "white" }}>
            {context}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatToDrow;
