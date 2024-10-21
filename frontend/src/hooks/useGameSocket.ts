import {
  AUTH_PENDING,
  AUTH_SUCCESS,
  AUTHENTICATE,
  FINDING_GAME,
  GAME_STARTED,
  GAME_UPDATE,
  GameState,
  INIT_GAME,
  INVALID_MOVE,
  MOVE,
} from "@/lib/Types";
import useGameStore from "./useGameStore";
import useAuthStore from "./useAuthStore";
import { useCallback, useEffect, useRef } from "react";

const useGameSocket = () => {
  const { setGameState, setSocket, setIsLoading, setFindingGame, setError } =
    useGameStore();
  const { token } = useAuthStore();

  const socketRef = useRef<WebSocket | null>(null);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case AUTH_SUCCESS:
          setIsLoading(false);
          if (socketRef.current) {
            socketRef.current.send(
              JSON.stringify({ type: INIT_GAME, token: token })
            );
          }
          setFindingGame(true);
          break;
        case AUTH_PENDING:
          setIsLoading(true);
          break;
        case FINDING_GAME:
          setFindingGame(true);
          break;
        case GAME_STARTED:
          console.log("Game started:", message);
          setGameState(message as GameState);
          setFindingGame(false);
          break;
        case GAME_UPDATE:
          setGameState(message as GameState);
          break;
        case INVALID_MOVE:
          console.error("Invalid move:", message.message);
          break;
        default:
          console.log("Unknown message type:", message.type);
          break;
      }
    },
    [setGameState, setFindingGame, setIsLoading, setError, token]
  );

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connection completed with websocket");
      setSocket(ws);
      setIsLoading(false);
      ws.send(JSON.stringify({ type: AUTHENTICATE, token: token }));
    };

    ws.onmessage = handleMessage;

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection error");
      socketRef.current = null;
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
      socketRef.current = null;
      // Attempt to reconnect after a delay
      setTimeout(connect, 5000);
    };
  }, [setSocket, setIsLoading, setError, token, handleMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const startGame = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: INIT_GAME, token: token }));
    } else {
      console.log("Not authenticated yet. Trying to reconnect...");
      connect();
    }
  }, [connect, token]);

  const makeCharacterMove = useCallback(
    (characterId: string, newX: number, newY: number) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: MOVE,
            movement: {
              characterId: characterId,
              newX: newX,
              newY: newY,
            },
          })
        );
      }
    },
    []
  );

  return {
    startGame,
    makeCharacterMove,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
  };
};

export default useGameSocket;
