import { createContext, useContext, useEffect, useRef, useState } from "react";
import supabase from "../supabaseClient";

const AppContext = createContext<any>({});

const AppContextProvider = ({ children }: any) => {
  let myChannel: any = null;
  const [username, setUsername] = useState<any>();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState<any>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [newIncomingMessageTrigger, setNewIncomingMessageTrigger] =
    useState(null);

  const getInitialMessages = async () => {
    if (messages.length) return;

    const { data, error }: any = await supabase
      .from("messages")
      .select()
      .range(0, 49)
      .order("id", { ascending: false });
    // console.log(`data`, data);

    setLoadingInitial(false);
    if (error) {
      setError(error.message);
      return;
    }

    setIsInitialLoad(true);
    setMessages(data);
    // scrollToBottom(); // not sure why this stopped working, meanwhile using useEffect that's listening to messages and isInitialLoad state.
  };
  const getMessagesAndSubscribe = async () => {
    setError("");

    await getInitialMessages();

    if (!myChannel) {
      myChannel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            handleNewMessage(payload);
          }
        )
        .subscribe();
    }
  };

  const handleNewMessage = (payload: any) => {
    setMessages((prevMessages: any) => [payload.new, ...prevMessages]);
    //* needed to trigger react state because I need access to the username state
    setNewIncomingMessageTrigger(payload.new);
  };
  const initializeUser = (session: any) => {
    setSession(session);
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    let username;
    if (session) {
      username = session.user.user_metadata.user_name;
    } else {
      username = localStorage.getItem("username");
    }
    setUsername(username);
    localStorage.setItem("username", username);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      initializeUser(session);
    });

    getMessagesAndSubscribe();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("onAuthStateChange", { _event, session });
      initializeUser(session);
    });

    return () => {
      // Remove supabase channel subscription by useEffect unmount
      if (myChannel) {
        supabase.removeChannel(myChannel);
      }

      authSubscription.unsubscribe();
    };
  }, []);
  return (
    <AppContext.Provider
      value={{
        username,
        setUsername,
        messages,
        loadingInitial,
        error,
        getMessagesAndSubscribe,

        session,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContext as default, AppContextProvider, useAppContext };
