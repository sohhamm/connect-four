import { GameError } from './errorHandler'
import type { Cell, GameState, Player } from '../types/game'

export const validateCellStructure = (cell: any): cell is Cell => {
  return (
    typeof cell === 'object' &&
    cell !== null &&
    typeof cell.player === 'number' &&
    [0, 1, 2].includes(cell.player) &&
    typeof cell.matched === 'boolean'
  )
}

export const validateBoardStructure = (board: any): board is Cell[][] => {
  if (!Array.isArray(board) || board.length !== 6) {
    return false
  }
  
  return board.every(row => 
    Array.isArray(row) && 
    row.length === 7 && 
    row.every(validateCellStructure)
  )
}

export const isColumnFull = (board: Cell[][], column: number): boolean => {
  if (column < 0 || column >= 7) {
    throw new GameError('Column index out of bounds', 'COLUMN_OUT_OF_BOUNDS')
  }
  return board[0][column].player !== 0
}

export const findLowestEmptyRow = (board: Cell[][], column: number): number => {
  if (column < 0 || column >= 7) {
    throw new GameError('Column index out of bounds', 'COLUMN_OUT_OF_BOUNDS')
  }
  
  for (let row = 5; row >= 0; row--) {
    if (board[row][column].player === 0) {
      return row
    }
  }
  return -1
}

export const validateDropMove = (board: Cell[][], column: number): void => {
  if (column < 0 || column >= 7) {
    throw new GameError('Invalid column selection', 'INVALID_COLUMN')
  }
  
  if (isColumnFull(board, column)) {
    throw new GameError('Column is full', 'COLUMN_FULL')
  }
}