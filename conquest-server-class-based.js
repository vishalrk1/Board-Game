// File: src/game/GameEngine.js
const Player = require('./Player');
const Map = require('./Map');
const Combat = require('./Combat');
const ResourceManager = require('./ResourceManager');

class GameEngine {
  constructor(gameId, players, mapSize, difficulty) {
    this.gameId = gameId;
    this.players = players.map(p => new Player(p.id, p.name));
    this.map = new Map(mapSize);
    this.combat = new Combat();
    this.resourceManager = new ResourceManager(difficulty);
    this.currentTurn = 0;
  }

  startGame() {
    this.map.generate();
    this.players.forEach(player => {
      player.initializeUnits(this.map);
      this.resourceManager.initializeResources(player);
    });
    this.currentTurn = 1;
    return this.getGameState();
  }

  processTurn(playerId, actions) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) throw new Error('Invalid player');

    actions.forEach(action => {
      switch (action.type) {
        case 'MOVE':
          player.moveUnit(action.unitId, action.destination);
          break;
        case 'ATTACK':
          this.combat.resolveAttack(player, action.unitId, action.targetId);
          break;
        case 'COLLECT_RESOURCE':
          this.resourceManager.collectResource(player, action.resourceType, action.amount);
          break;
        // Add more action types as needed
      }
    });

    this.currentTurn++;
    this.resourceManager.updateResources(this.players);
    return this.getGameState();
  }

  getGameState() {
    return {
      gameId: this.gameId,
      currentTurn: this.currentTurn,
      map: this.map.getState(),
      players: this.players.map(p => p.getState()),
    };
  }
}

module.exports = GameEngine;

// File: src/game/Player.js
const Unit = require('./Unit');

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.units = [];
    this.resources = { gold: 0, food: 0, materials: 0 };
  }

  initializeUnits(map) {
    // Initialize player's starting units
    const startingPosition = map.getRandomEmptyPosition();
    this.units.push(new Unit('warrior', startingPosition));
    // Add more starting units as needed
  }

  moveUnit(unitId, destination) {
    const unit = this.units.find(u => u.id === unitId);
    if (unit) unit.move(destination);
  }

  getState() {
    return {
      id: this.id,
      name: this.name,
      units: this.units.map(u => u.getState()),
      resources: { ...this.resources },
    };
  }
}

module.exports = Player;

// File: src/game/Unit.js
class Unit {
  constructor(type, position) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.position = position;
    this.health = 100;
    this.attack = 10;
    this.defense = 5;
    // Add more properties based on unit type
  }

  move(destination) {
    this.position = destination;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }

  getState() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      health: this.health,
    };
  }
}

module.exports = Unit;

// File: src/game/Map.js
class Map {
  constructor(size) {
    this.size = size;
    this.grid = [];
  }

  generate() {
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = this.generateTile();
      }
    }
  }

  generateTile() {
    const terrainTypes = ['plains', 'forest', 'mountain', 'water'];
    const terrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
    return {
      terrain,
      resource: Math.random() < 0.3 ? this.generateResource() : null,
    };
  }

  generateResource() {
    const resourceTypes = ['gold', 'food', 'materials'];
    const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    return {
      type,
      amount: Math.floor(Math.random() * 50) + 10,
    };
  }

  getRandomEmptyPosition() {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.size);
      y = Math.floor(Math.random() * this.size);
    } while (this.grid[x][y].terrain === 'water');
    return { x, y };
  }

  getState() {
    return this.grid;
  }
}

module.exports = Map;

// File: src/game/Combat.js
class Combat {
  resolveAttack(attacker, attackerUnitId, targetUnitId) {
    const attackerUnit = attacker.units.find(u => u.id === attackerUnitId);
    const targetPlayer = this.players.find(p => p.units.some(u => u.id === targetUnitId));
    const targetUnit = targetPlayer.units.find(u => u.id === targetUnitId);

    if (!attackerUnit || !targetUnit) throw new Error('Invalid units');

    const damage = Math.max(0, attackerUnit.attack - targetUnit.defense);
    targetUnit.takeDamage(damage);

    if (targetUnit.health <= 0) {
      targetPlayer.units = targetPlayer.units.filter(u => u.id !== targetUnitId);
    }
  }
}

module.exports = Combat;

// File: src/game/ResourceManager.js
class ResourceManager {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.baseIncomeRate = {
      easy: 10,
      medium: 7,
      hard: 5
    };
  }

  initializeResources(player) {
    player.resources = {
      gold: 100,
      food: 100,
      materials: 100
    };
  }

  collectResource(player, resourceType, amount) {
    player.resources[resourceType] += amount;
  }

  updateResources(players) {
    const incomeRate = this.baseIncomeRate[this.difficulty];
    players.forEach(player => {
      player.resources.gold += incomeRate;
      player.resources.food += incomeRate;
      player.resources.materials += incomeRate;
    });
  }
}

module.exports = ResourceManager;

// File: src/network/WebSocketServer.js
const WebSocket = require('ws');
const MessageHandler = require('./MessageHandler');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.messageHandler = new MessageHandler();
  }

  init() {
    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        const response = this.messageHandler.handleMessage(JSON.parse(message));
        ws.send(JSON.stringify(response));
      });
    });
  }

  broadcast(gameId, data) {
    this.wss.clients.forEach((client) => {
      if (client.gameId === gameId) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

module.exports = WebSocketServer;

// File: src/network/MessageHandler.js
const GameEngine = require('../game/GameEngine');

class MessageHandler {
  constructor() {
    this.games = new Map();
  }

  handleMessage(message) {
    switch (message.type) {
      case 'CREATE_GAME':
        return this.createGame(message.players, message.mapSize, message.difficulty);
      case 'JOIN_GAME':
        return this.joinGame(message.gameId, message.playerId);
      case 'PROCESS_TURN':
        return this.processTurn(message.gameId, message.playerId, message.actions);
      default:
        throw new Error('Unknown message type');
    }
  }

  createGame(players, mapSize, difficulty) {
    const gameId = Math.random().toString(36).substr(2, 9);
    const game = new GameEngine(gameId, players, mapSize, difficulty);
    this.games.set(gameId, game);
    return { type: 'GAME_CREATED', gameId, initialState: game.startGame() };
  }

  joinGame(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    // Logic to add player to game if needed
    return { type: 'GAME_JOINED', gameState: game.getGameState() };
  }

  processTurn(gameId, playerId, actions) {
    const game = this.games.get(gameId);
    if (!game) throw new Error('Game not found');
    const newState = game.processTurn(playerId, actions);
    return { type: 'TURN_PROCESSED', gameState: newState };
  }
}

module.exports = MessageHandler;

// File: src/utils/Logger.js
class Logger {
  static log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  static error(message) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
  }
}

module.exports = Logger;

// File: src/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocketServer = require('./network/WebSocketServer');
const Logger = require('./utils/Logger');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer(server);

const PORT = process.env.PORT || 3000;

wss.init();

server.listen(PORT, () => {
  Logger.log(`Server is running on port ${PORT}`);
});

// File: package.json
{
  "name": "conquest-server",
  "version": "1.0.0",
  "description": "Server for Conquest: Rivals of the Realm",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "ws": "^8.2.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}

// File: .env
PORT=3000
NODE_ENV=development
