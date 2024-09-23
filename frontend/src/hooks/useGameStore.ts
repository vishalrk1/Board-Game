import { GameState } from "@/lib/Types";
import { create } from "zustand";

interface GameStoreStartProps {
  gameState: GameState | null;
  findingGame: boolean;
  isLoading: boolean;
  error: string | null;
  socket: WebSocket | null;
  setGameState: (gameState: GameState) => void;
  setFindingGame: (findingGame: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSocket: (socket: WebSocket | null) => void;
  startGame: () => void;
}

const useGameStore = create<GameStoreStartProps>((set) => ({
  gameState: null,
  findingGame: true,
  isLoading: false,
  error: null,
  socket: null,
  setGameState: (gameState) => set({ gameState }),
  setFindingGame: (findingGame) => set({ findingGame }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSocket: (socket) => set({ socket }),
  startGame: () => {
    set({ findingGame: true, isLoading: true, gameState: null });
  },
}));

export default useGameStore;
