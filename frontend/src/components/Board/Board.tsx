import React, { useCallback, useEffect, useState } from "react";
import { Cell, Character, Position, TerrainType } from "../../lib/Types";

import PlainTile from "../../assets/plainTile.jpg";
import ForestTile from "../../assets/grassTile.jpg";
import WaterTile from "../../assets/waterTile.jpg";

import useGameStore from "@/hooks/useGameStore";
import useGameSocket from "@/hooks/useGameSocket";

const terrainColors: Record<TerrainType, string> = {
  PLAIN: PlainTile,
  FOREST: ForestTile,
  WATER: WaterTile,
};

interface GameBoardProps {
  board: Cell[][];
  isMyTurn: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  const [cellSize, setCellSize] = useState(40);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [highlightedCells, setHighlightedCells] = useState<Position[]>([]);

  const { findingGame, gameState } = useGameStore();
  const { makeCharacterMove } = useGameSocket();

  useEffect(() => {
    const updateCellSize = () => {
      const smallestDimension = Math.min(window.innerWidth, window.innerHeight);
      const newCellSize = Math.floor(smallestDimension / board.length);
      setCellSize(newCellSize);
    };
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [board.length]);

  const getAdjacentCells = useCallback(
    (pos: Position): Position[] => {
      const { x, y } = pos;
      const adjacent: Position[] = [
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x - 1, y },
        { x: x + 1, y },
      ];
      return adjacent.filter(
        (cell) =>
          cell.x >= 0 &&
          cell.x < board.length &&
          cell.y >= 0 &&
          cell.y < board.length
      );
    },
    [board.length]
  );

  const getIsHighlighted = useCallback(
    (x: number, y: number): boolean => {
      return highlightedCells.some((cell) => cell.x === x && cell.y === y);
    },
    [highlightedCells]
  );

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (selectedCharacter && getIsHighlighted(x, y)) {
        makeCharacterMove(selectedCharacter.id, x, y);
        setSelectedCharacter(null);
        setHighlightedCells([]);
      }
    },
    [selectedCharacter, getIsHighlighted, makeCharacterMove]
  );

  const handleCharacterClick = useCallback(
    (character: Character, x: number, y: number) => {
      setSelectedCharacter(character);
      const adjacentCells = getAdjacentCells({ x, y });
      setHighlightedCells(adjacentCells);
    },
    [getAdjacentCells]
  );

  const renderCell = useCallback(
    (cell: Cell, x: number, y: number) => {
      const isHighlightedCell = getIsHighlighted(x, y);

      return (
        <div
          key={`${x}-${y}`}
          className={`
            flex items-center justify-center 
            cursor-pointer
            ${
              isHighlightedCell
                ? "border-2 border-yellow-400"
                : "border border-gray-950"
            } 
            relative
          `}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
          onClick={() => handleCellClick(x, y)}
        >
          <img
            src={terrainColors[cell.terrain]}
            className="w-full h-full object-cover"
            alt="Terrain"
          />
          {cell.character && (
            <div
              className="absolute w-3/4 h-3/4 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if(cell.character) {
                  handleCharacterClick(cell.character, x, y);
                }
              }}
            >
              {cell.character.health}
            </div>
          )}
        </div>
      );
    },
    [handleCharacterClick, getIsHighlighted, handleCellClick, cellSize]
  );

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {!findingGame && gameState ? (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${board.length}, ${cellSize}px)`,
            width: `${cellSize * board.length}px`,
            height: `${cellSize * board.length}px`,
          }}
        >
          {board.map((row, y) => row.map((cell, x) => renderCell(cell, y, x)))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GameBoard;
