import { Button, Input, Spinner, useStepContext } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

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
                  "Suggerisci un contesto che può essere un oggetto, un'azione, un animale , qualcosa da mangiare per disegnarlo o altro.In massimo due parole.",
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
        marginTop: "24px",
        marginBottom: "24px",
        width: "100%%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Input
        placeholder="Cosa ti piacerebbe disegnare?"
        onChange={(e) => setGptUserRequest(e.target.value)}
        style={{ width: "50%" }}
      />
      <Button
        onClick={() => getContext(gptUserRequest || "")}
        sx={{ width: "50%", marginTop: "24px" }}
      >
        Suggerisci disegno
      </Button>{" "}
      {loading ? <Spinner /> : <div>{context}</div>}
    </div>
  );
};

export default WhatToDrow;
