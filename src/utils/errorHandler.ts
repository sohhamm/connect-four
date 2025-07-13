import { logger } from './logger'

export class GameError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'GameError'
  }
}

export const handleError = (error: Error | unknown): void => {
  if (error instanceof GameError) {
    logger.error(`Game Error [${error.code}]:`, error)
  } else if (error instanceof Error) {
    logger.error('Unexpected Error:', error)
  } else {
    logger.error('Unknown Error:', new Error(String(error)))
  }
}

export const validateGameState = (board: any[][], currentPlayer: number): void => {
  if (!Array.isArray(board) || board.length !== 6) {
    throw new GameError('Invalid board: must be 6 rows', 'INVALID_BOARD_ROWS')
  }
  
  if (!board.every(row => Array.isArray(row) && row.length === 7)) {
    throw new GameError('Invalid board: each row must have 7 columns', 'INVALID_BOARD_COLS')
  }
  
  if (![1, 2].includes(currentPlayer)) {
    throw new GameError('Invalid player: must be 1 or 2', 'INVALID_PLAYER')
  }
}

export const validateColumn = (column: number): void => {
  if (!Number.isInteger(column) || column < 0 || column >= 7) {
    throw new GameError('Invalid column: must be between 0 and 6', 'INVALID_COLUMN')
  }
}