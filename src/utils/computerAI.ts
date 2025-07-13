import type { Cell, Player } from '../types/game'

export interface AIMove {
  column: number
  score: number
}

export class ConnectFourAI {
  private readonly ROWS = 6
  private readonly COLUMNS = 7
  private readonly WIN_CONDITION = 4
  private readonly MAX_DEPTH = 6

  private readonly SCORES = {
    WIN: 100000,
    BLOCK_WIN: 50000,
    THREE_IN_A_ROW: 50,
    TWO_IN_A_ROW: 10,
    CENTER_COLUMN: 3
  }

  getBestMove(board: Cell[][], aiPlayer: Player, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): number {
    const depth = this.getDepthByDifficulty(difficulty)
    
    if (difficulty === 'easy') {
      return this.getRandomValidMove(board)
    }
    
    const result = this.minimax(board, depth, -Infinity, Infinity, true, aiPlayer)
    return result.column
  }

  private getDepthByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): number {
    switch (difficulty) {
      case 'easy': return 1
      case 'medium': return 4
      case 'hard': return this.MAX_DEPTH
      default: return 4
    }
  }

  private getRandomValidMove(board: Cell[][]): number {
    const validColumns = this.getValidMoves(board)
    return validColumns[Math.floor(Math.random() * validColumns.length)]
  }

  private minimax(
    board: Cell[][],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    aiPlayer: Player
  ): AIMove {
    const humanPlayer: Player = aiPlayer === 1 ? 2 : 1
    const currentPlayer = isMaximizing ? aiPlayer : humanPlayer

    const winner = this.checkWinner(board)
    if (winner === aiPlayer) {
      return { column: -1, score: this.SCORES.WIN + depth }
    }
    if (winner === humanPlayer) {
      return { column: -1, score: -this.SCORES.WIN - depth }
    }
    if (depth === 0 || this.isBoardFull(board)) {
      return { column: -1, score: this.evaluateBoard(board, aiPlayer) }
    }

    const validMoves = this.getValidMoves(board)
    let bestMove: AIMove = { column: validMoves[0], score: isMaximizing ? -Infinity : Infinity }

    for (const column of validMoves) {
      const row = this.findLowestEmptyRow(board, column)
      if (row === -1) continue

      const newBoard = this.makeMove(board, row, column, currentPlayer)
      const result = this.minimax(newBoard, depth - 1, alpha, beta, !isMaximizing, aiPlayer)

      if (isMaximizing) {
        if (result.score > bestMove.score) {
          bestMove = { column, score: result.score }
        }
        alpha = Math.max(alpha, result.score)
      } else {
        if (result.score < bestMove.score) {
          bestMove = { column, score: result.score }
        }
        beta = Math.min(beta, result.score)
      }

      if (beta <= alpha) {
        break
      }
    }

    return bestMove
  }

  private evaluateBoard(board: Cell[][], aiPlayer: Player): number {
    const humanPlayer: Player = aiPlayer === 1 ? 2 : 1
    let score = 0

    score += this.evaluateCenter(board, aiPlayer)
    score += this.evaluateWindows(board, aiPlayer, humanPlayer)

    return score
  }

  private evaluateCenter(board: Cell[][], aiPlayer: Player): number {
    let centerScore = 0
    const centerColumn = Math.floor(this.COLUMNS / 2)
    
    for (let row = 0; row < this.ROWS; row++) {
      if (board[row][centerColumn].player === aiPlayer) {
        centerScore += this.SCORES.CENTER_COLUMN
      }
    }
    
    return centerScore
  }

  private evaluateWindows(board: Cell[][], aiPlayer: Player, humanPlayer: Player): number {
    let score = 0

    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLUMNS; col++) {
        if (board[row][col].player !== 0) continue

        score += this.evaluatePosition(board, row, col, aiPlayer, humanPlayer)
      }
    }

    return score
  }

  private evaluatePosition(board: Cell[][], row: number, col: number, aiPlayer: Player, humanPlayer: Player): number {
    let score = 0
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal /
      [1, -1]   // diagonal \
    ]

    for (const [dr, dc] of directions) {
      const window = this.getWindow(board, row, col, dr, dc)
      score += this.scoreWindow(window, aiPlayer, humanPlayer)
    }

    return score
  }

  private getWindow(board: Cell[][], row: number, col: number, dr: number, dc: number): Player[] {
    const window: Player[] = []
    
    for (let i = 0; i < this.WIN_CONDITION; i++) {
      const newRow = row + i * dr
      const newCol = col + i * dc
      
      if (newRow >= 0 && newRow < this.ROWS && newCol >= 0 && newCol < this.COLUMNS) {
        window.push(board[newRow][newCol].player)
      }
    }
    
    return window
  }

  private scoreWindow(window: Player[], aiPlayer: Player, humanPlayer: Player): number {
    let score = 0
    const aiCount = window.filter(p => p === aiPlayer).length
    const humanCount = window.filter(p => p === humanPlayer).length
    const emptyCount = window.filter(p => p === 0).length

    if (window.length < this.WIN_CONDITION) return 0

    if (aiCount === 4) {
      score += this.SCORES.WIN
    } else if (aiCount === 3 && emptyCount === 1) {
      score += this.SCORES.THREE_IN_A_ROW
    } else if (aiCount === 2 && emptyCount === 2) {
      score += this.SCORES.TWO_IN_A_ROW
    }

    if (humanCount === 3 && emptyCount === 1) {
      score -= this.SCORES.BLOCK_WIN
    }

    return score
  }

  private getValidMoves(board: Cell[][]): number[] {
    const validMoves: number[] = []
    for (let col = 0; col < this.COLUMNS; col++) {
      if (board[0][col].player === 0) {
        validMoves.push(col)
      }
    }
    return validMoves
  }

  private findLowestEmptyRow(board: Cell[][], column: number): number {
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (board[row][column].player === 0) {
        return row
      }
    }
    return -1
  }

  private makeMove(board: Cell[][], row: number, column: number, player: Player): Cell[][] {
    const newBoard = board.map(r => r.map(cell => ({ ...cell })))
    newBoard[row][column].player = player
    return newBoard
  }

  private checkWinner(board: Cell[][]): Player | null {
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLUMNS; col++) {
        const player = board[row][col].player
        if (player === 0) continue

        if (this.checkWinFromPosition(board, row, col, player)) {
          return player
        }
      }
    }
    return null
  }

  private checkWinFromPosition(board: Cell[][], row: number, col: number, player: Player): boolean {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal /
      [1, -1]   // diagonal \
    ]

    for (const [dr, dc] of directions) {
      let count = 1

      // Check in positive direction
      for (let i = 1; i < this.WIN_CONDITION; i++) {
        const newRow = row + i * dr
        const newCol = col + i * dc
        if (newRow >= 0 && newRow < this.ROWS && newCol >= 0 && newCol < this.COLUMNS &&
            board[newRow][newCol].player === player) {
          count++
        } else {
          break
        }
      }

      // Check in negative direction
      for (let i = 1; i < this.WIN_CONDITION; i++) {
        const newRow = row - i * dr
        const newCol = col - i * dc
        if (newRow >= 0 && newRow < this.ROWS && newCol >= 0 && newCol < this.COLUMNS &&
            board[newRow][newCol].player === player) {
          count++
        } else {
          break
        }
      }

      if (count >= this.WIN_CONDITION) {
        return true
      }
    }

    return false
  }

  private isBoardFull(board: Cell[][]): boolean {
    return board.every(row => row.every(cell => cell.player !== 0))
  }
}

export const computerAI = new ConnectFourAI()