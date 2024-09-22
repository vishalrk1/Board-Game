import React, { useCallback, useEffect, useState } from "react";
import { Cell, Character, Position, TerrainType } from "../../lib/Types";

import PlainTile from "../../assets/plainTile.jpg";
import ForestTile from "../../assets/grassTile.jpg";
import WaterTile from "../../assets/waterTile.jpg";

const terrainColors: Record<TerrainType, string> = {
  PLAIN: PlainTile,
  FOREST: ForestTile,
  WATER: WaterTile,
};

interface GameBoardProps {
  board: Cell[][];
  // selectedCharacter: Position | null;
  validMoves?: Position[];
  isMyTurn: boolean;
  onCellClick?: (row: number, col: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
}) => {
  const [cellSize, setCellSize] = useState(40);
  // State to keep track of the currently selected character
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  // State to store the positions of cells that should be highlighted
  const [highlightedCells, setHighlightedCells] = useState<Position[]>([]);

  // Effect to update cell size based on window size
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

  // Function to get adjacent cells for a given position
  const getAdjacentCells = (pos: Position, boardSize: number): Position[] => {
    const { row, col } = pos;
    const adjacent: Position[] = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
    // Filter out cells that are outside the board boundaries
    return adjacent.filter(
      (cell) =>
        cell.row >= 0 &&
        cell.row < boardSize &&
        cell.col >= 0 &&
        cell.col < boardSize
    );
  };

  // Function to check if a cell is highlighted
  const getIsHighlighted = (pos: Position): boolean => {
    return highlightedCells.some(
      (cell) => cell.row === pos.row && cell.col === pos.col
    );
  };

  // Function to handle cell click for character movement
  // const handleCellClick = useCallback((row: number, col: number) => {
  //   if (selectedCharacter && isHighlighted({ row, col })) {
  //     onMoveCharacter(selectedCharacter.id, { row, col });
  //     setSelectedCharacter(null);
  //     setHighlightedCells([]);
  //   }
  // }, [selectedCharacter, onMoveCharacter, isHighlighted]);

  const handleCharacterClick = useCallback(
    (character: Character | null, cell: Cell) => {
      if (character) {
        setSelectedCharacter(character);
        const adjacentCells = getAdjacentCells(cell.position, board.length);
        setHighlightedCells(adjacentCells);
      }
    },
    [board.length]
  );

  const renderCell = useCallback(
    (cell: Cell, row: number, col: number) => {
      const isHighlightedCell = getIsHighlighted({ row, col });

      return (
        <div
          key={`${row}-${col}`}
          className={`
           flex items-center justify-center 
            cursor-pointer
            ${isHighlightedCell ? "border-2 border-yellow-400" : ""} 
            border border-gray-950
            relative
          `}
          onClick={() => {}}
        >
          <img
            src={terrainColors[cell.terrain]}
            className="w-full h-full object-cover"
            alt="Terrain"
          />
          {/* Render the character if present */}
          {cell.character && (
            <div
              className="absolute w-3/4 h-3/4 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent cell click event
                handleCharacterClick(cell.character, cell);
              }}
            >
              {cell.character.id}: {cell.character.health}
            </div>
          )}
        </div>
      );
    },
    [highlightedCells, handleCharacterClick]
  );

  return (
    <div className="h-full flex items-center justify-center">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${board.length}, ${cellSize}px)`,
          width: `${cellSize * board.length}px`,
          height: `${cellSize * board.length}px`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
