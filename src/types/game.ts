export interface Cell {
  player: 0 | 1 | 2
  matched: boolean
}

export type GameState = 'playing' | 'won' | 'draw'

export type Player = 1 | 2

export interface PlayerScores {
  player1: number
  player2: number
}

export interface DroppingPiece {
  column: number
  row: number
  player: Player
}

export interface GameConfig {
  rows: 6
  columns: 7
  winCondition: 4
  timerDuration: 30
}

export interface WinCheckResult {
  hasWin: boolean
  winningCells?: [number, number][]
}

export type Direction = 'horizontal' | 'vertical' | 'diagonal-lr' | 'diagonal-rl'