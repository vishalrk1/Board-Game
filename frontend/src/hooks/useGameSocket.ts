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
import { useCallback, useEffect, useRef, useState } from "react";

const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 3;

const useGameSocket = () => {
  const { setGameState, setSocket, setIsLoading, setFindingGame, setError } =
    useGameStore();
  const { token } = useAuthStore();

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);

  // Keep track of connection status to prevent duplicate connections
  const isConnectingRef = useRef(false);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case AUTH_SUCCESS:
          setIsLoading(false);
          setIsConnected(true);
          reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful auth
          break;
        case AUTH_PENDING:
          setIsLoading(true);
          break;
        case FINDING_GAME:
          setFindingGame(true);
          break;
        case GAME_STARTED:
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
    [setGameState, setFindingGame, setIsLoading, setError]
  );

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (
      isConnectingRef.current ||
      socketRef.current?.readyState === WebSocket.CONNECTING
    ) {
      console.log("Connection attempt already in progress");
      return;
    }

    // Check if we've exceeded max reconnection attempts
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      setError(
        "Maximum reconnection attempts reached. Please refresh the page."
      );
      return;
    }

    // Don't try to reconnect if we already have an open connection
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket connection already open");
      return;
    }

    isConnectingRef.current = true;
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
      setIsLoading(false);
      isConnectingRef.current = false;
      ws.send(JSON.stringify({ type: AUTHENTICATE, token: token }));
    };

    ws.onmessage = handleMessage;

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection error");
      isConnectingRef.current = false;
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
      setIsConnected(false);
      isConnectingRef.current = false;

      // Increment reconnection attempts
      reconnectAttemptsRef.current += 1;

      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        setTimeout(connect, RECONNECT_DELAY);
      } else {
        setError("Connection lost. Maximum reconnection attempts reached.");
      }
    };
  }, [setSocket, setIsLoading, setError, token, handleMessage]);

  // Only establish connection once when component mounts
  useEffect(() => {
    connect();

    return () => {
      isConnectingRef.current = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const startGame = useCallback(() => {
    if (!isConnected) {
      console.log("Not connected. Cannot start game.");
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: INIT_GAME, token: token }));
    }
  }, [token, isConnected]);

  const makeCharacterMove = useCallback(
    (characterId: string, newX: number, newY: number) => {
      if (!isConnected) {
        console.log("Not connected. Cannot make move.");
        return;
      }

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: MOVE,
            characterId,
            newX,
            newY,
          })
        );
      }
    },
    [isConnected]
  );

  return {
    startGame,
    makeCharacterMove,
    isConnected,
  };
};

export default useGameSocket;
