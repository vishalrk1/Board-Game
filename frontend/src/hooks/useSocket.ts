// import {
//   AUTH_PENDING,
//   AUTH_SUCCESS,
//   AUTHENTICATE,
//   FINDING_GAME,
//   GAME_STARTED,
//   GameState,
//   INIT_GAME,
// } from "@/lib/Types";
// import { useCallback, useRef, useState } from "react";
// import useAuthStore from "./useAuthStore";

// interface WebsocketMessage {
//   type: string;
//   payload?: object;
// }

// const useSocket = () => {
//   const [gameState, setGameState] = useState<GameState | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   //   const [isMyTurn, setIsMyTurn] = useState<boolean>(false)
//   //   const [log, setLog] = useState<string[]>([])
//   const [findingGame, setFindingGame] = useState<boolean>(true);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const { token } = useAuthStore();
//   const socket = useRef<WebSocket | null>(null);

//   const handelSocketMessages = useCallback(
//     (message: WebsocketMessage) => {
//       console.log("HANDEL SOCKET MESSAGE: ", message?.type);
//       switch (message.type) {
//         case AUTH_SUCCESS:
//           setIsLoading(false);
//           socket.current?.send(
//             JSON.stringify({ type: INIT_GAME, token: token })
//           );
//           setFindingGame(true);
//           break;
//         case AUTH_PENDING:
//           setIsLoading(true);
//           break;
//         case FINDING_GAME:
//           setFindingGame(true);
//           break;
//         case GAME_STARTED:
//           console.log(message);
//           setGameState(message as GameState);
//           setFindingGame(false);
//           break;
//       }
//     },
//     [socket, token]
//   );

//   const connect = useCallback(() => {
//     socket.current = new WebSocket("ws://localhost:8080");

//     socket.current.onopen = () => {
//       console.log("WebSocket connection established");
//       if (token && socket.current) {
//         socket.current.send(
//           JSON.stringify({ type: AUTHENTICATE, token: token })
//         );
//       } else {
//         setError("No authentication token found");
//       }
//     };

//     socket.current.onmessage = (event) => {
//       const message: WebsocketMessage = JSON.parse(event.data);
//       handelSocketMessages(message);
//     };

//     socket.current.onerror = (event) => {
//       console.error("WebSocket error:", event);
//       setError("WebSocket connection error");
//     };

//     socket.current.onclose = () => {
//       console.log("WebSocket connection closed");
//     };
//   }, [token, handelSocketMessages]);

//   const startGame = useCallback(() => {
//     if (!gameState) {
//       connect();
//     } else {
//       console.log("Game already in progress");
//     }
//   }, [gameState, connect]);

//   return {
//     gameState,
//     error,
//     findingGame,
//     isLoading,
//     startGame,
//   };
// };

// export default useSocket;
