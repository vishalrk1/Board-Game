export type TerrainType = "PLAIN" | "FOREST" | "WATER";

export interface Character {
  id: string;
  health: number;
  //   attack: number;
  //   defense: number;
  //   movement: number;
  //   canCrossWater: boolean;
}

export interface Cell {
  position: Position;
  terrain: TerrainType;
  character: Character | null;
}

export interface Position {
  row: number;
  col: number;
}

// export interface GameState {
//   map: {
//     size: number;
//     board: Cell[][];
//   };
//   players: Record<string, any>; // You may want to define a more specific type for players
//   winner?: string;
// }

export interface ServerMessage {
  type: "GAME_STATE" | "VALID_MOVES" | "TURN_CHANGE" | "GAME_OVER" | "GAME_LOG";
  state?: []; //GameState;
  moves?: Position[];
  isMyTurn?: boolean;
  log?: string[];
}

export interface ClientMessage {
  type: "MOVE" | "GET_VALID_MOVES" | "NEW_GAME";
  from?: Position;
  to?: Position;
  position?: Position;
}

export const boardData: Cell[][] = [
  [
    {
      position: {
        row: 0,
        col: 0,
      },
      terrain: "PLAIN",
      character: {
        id: "4875a4ec-68e4-491d-9581-cd34d6b28716",
        health: 100,
      },
    },
    {
      position: {
        row: 0,
        col: 1,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 0,
        col: 2,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 0,
        col: 3,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 0,
        col: 4,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 0,
        col: 5,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 0,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 0,
        col: 7,
      },
      terrain: "PLAIN",
      character: {
        id: "09be40a3-a444-47c3-b2fc-bff8d5c65139",
        health: 100,
      },
    },
  ],
  [
    {
      position: {
        row: 1,
        col: 0,
      },
      terrain: "PLAIN",
      character: {
        id: "37878f09-6429-4e30-b3de-5a45e7fc5299",
        health: 100,
      },
    },
    {
      position: {
        row: 1,
        col: 1,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 1,
        col: 2,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 1,
        col: 3,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 1,
        col: 4,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 1,
        col: 5,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 1,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 1,
        col: 7,
      },
      terrain: "PLAIN",
      character: {
        id: "851d79e8-42c9-4d41-ad00-bbf813742d76",
        health: 100,
      },
    },
  ],
  [
    {
      position: {
        row: 2,
        col: 0,
      },
      terrain: "PLAIN",
      character: {
        id: "da54304b-d0e0-4c0a-bae4-4338b15b55b7",
        health: 70,
      },
    },
    {
      position: {
        row: 2,
        col: 1,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 2,
        col: 2,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 2,
        col: 3,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 2,
        col: 4,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 2,
        col: 5,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 2,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 2,
        col: 7,
      },
      terrain: "PLAIN",
      character: {
        id: "0880f33b-cdd6-42b2-9e47-d3309d623733",
        health: 70,
      },
    },
  ],
  [
    {
      position: {
        row: 3,
        col: 0,
      },
      terrain: "PLAIN",
      character: {
        id: "5f79446b-cc5d-488e-8e64-19837df5659e",
        health: 85,
      },
    },
    {
      position: {
        row: 3,
        col: 1,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 3,
        col: 2,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 3,
        col: 3,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 3,
        col: 4,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 3,
        col: 5,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 3,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 3,
        col: 7,
      },
      terrain: "PLAIN",
      character: {
        id: "c3f96def-46f4-4b44-8928-0ea9791c5d86",
        health: 85,
      },
    },
  ],
  [
    {
      position: {
        row: 4,
        col: 0,
      },
      terrain: "WATER",
      character: {
        id: "14f74e1d-33c3-4827-afa6-cc579f3cb220",
        health: 60,
      },
    },
    {
      position: {
        row: 4,
        col: 1,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 4,
        col: 2,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 4,
        col: 3,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 4,
        col: 4,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 4,
        col: 5,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 4,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 4,
        col: 7,
      },
      terrain: "PLAIN",
      character: {
        id: "3d8f758c-232e-4ddd-a8ab-7af063883dc7",
        health: 60,
      },
    },
  ],
  [
    {
      position: {
        row: 5,
        col: 0,
      },
      terrain: "FOREST",
      character: {
        id: "afd8e5cf-e870-402e-8e73-a90f95aa7071",
        health: 65,
      },
    },
    {
      position: {
        row: 5,
        col: 1,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 5,
        col: 2,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 5,
        col: 3,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 5,
        col: 4,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 5,
        col: 5,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 5,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 5,
        col: 7,
      },
      terrain: "PLAIN",
      character: {
        id: "36da1152-a3fb-48f0-8b23-8eb600b0e110",
        health: 65,
      },
    },
  ],
  [
    {
      position: {
        row: 6,
        col: 0,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 6,
        col: 1,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 6,
        col: 2,
      },
      terrain: "FOREST",
      character: null,
    },
    {
      position: {
        row: 6,
        col: 3,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 6,
        col: 4,
      },
      terrain: "WATER",
      character: null,
    },
    {
      position: {
        row: 6,
        col: 5,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 6,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 6,
        col: 7,
      },
      terrain: "PLAIN",
      character: null,
    },
  ],
  [
    {
      position: {
        row: 7,
        col: 0,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 7,
        col: 1,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 7,
        col: 2,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 7,
        col: 3,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 7,
        col: 4,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 7,
        col: 5,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 7,
        col: 6,
      },
      terrain: "PLAIN",
      character: null,
    },
    {
      position: {
        row: 7,
        col: 7,
      },
      terrain: "PLAIN",
      character: null,
    },
  ],
];
