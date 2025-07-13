import {createSignal, type JSX, type Component, For, Show, createEffect} from 'solid-js'
import styles from './game.module.css'
import Logo from '../../components/logo/Logo'
import {useNavigate, useSearchParams} from '@solidjs/router'
import { handleError, validateColumn, GameError } from '../../utils/errorHandler'
import { validateDropMove, findLowestEmptyRow } from '../../utils/gameValidation'
import { perfMonitor } from '../../utils/performance'
import { logger } from '../../utils/logger'
import { computerAI } from '../../utils/computerAI'
import type { Cell, GameState, Player, PlayerScores, DroppingPiece } from '../../types/game'

import boardWhite from '../../assets/images/board-layer-white-large.svg'
import boardBlack from '../../assets/images/board-layer-black-large.svg'
import counterRed from '../../assets/images/counter-red-large.svg'
import counterYellow from '../../assets/images/counter-yellow-large.svg'
import p1 from '../../assets/images/player-one.svg'
import p2 from '../../assets/images/player-two.svg'
import cpu from '../../assets/images/cpu.svg'
import you from '../../assets/images/you.svg'
import markerRed from '../../assets/images/marker-red.svg'
import markerYellow from '../../assets/images/marker-yellow.svg'

const Game: Component = () => {
  logger.info('Game component initialized')
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const gameMode = searchParams.mode || 'pvp'
  const isVsCPU = gameMode === 'cpu'
  
  const [currentPlayer, setCurrentPlayer] = createSignal<Player>(1)
  const [board, setBoard] = createSignal<Cell[][]>(createEmptyBoard())
  const [gameState, setGameState] = createSignal<GameState>('playing')
  const [winner, setWinner] = createSignal<Player | null>(null)
  const [playerScores, setPlayerScores] = createSignal<PlayerScores>({player1: 0, player2: 0})
  const [timeLeft, setTimeLeft] = createSignal<number>(30)
  const [isTimerActive, setIsTimerActive] = createSignal<boolean>(true)
  const [hoveredColumn, setHoveredColumn] = createSignal<number | null>(null)
  const [droppingPiece, setDroppingPiece] = createSignal<DroppingPiece | null>(null)
  const [isAIThinking, setIsAIThinking] = createSignal<boolean>(false)

  // Timer effect
  createEffect(() => {
    if (gameState() !== 'playing' || !isTimerActive()) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - other player wins
          const otherPlayer: Player = currentPlayer() === 1 ? 2 : 1
          handleWin(otherPlayer)
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  })

  // AI move effect - only triggers when it's Player 2's turn in CPU mode
  createEffect(() => {
    if (gameState() !== 'playing' || !isVsCPU || currentPlayer() !== 2 || droppingPiece() || isAIThinking()) return
    
    makeAIMove()
  })

  const makeAIMove = () => {
    setIsAIThinking(true)
    
    // Add delay to make AI move feel more natural
    setTimeout(() => {
      try {
        const aiColumn = computerAI.getBestMove(board(), 2, 'medium')
        dropDisc(aiColumn)
      } catch (error) {
        handleError(error)
      } finally {
        setIsAIThinking(false)
      }
    }, 800)
  }

  const dropDisc = (column: number) => {
    try {
      if (gameState() !== 'playing' || droppingPiece()) return

      validateColumn(column)
      const currentBoard = board()
      validateDropMove(currentBoard, column)
      
      const row = findLowestEmptyRow(currentBoard, column)
      if (row === -1) {
        throw new GameError('No empty row found in column', 'NO_EMPTY_ROW')
      }

      const player = currentPlayer()
      
      // Start drop animation
      setDroppingPiece({ column, row, player })
      
      // Add piece to board after animation
      setTimeout(() => {
        try {
          const newBoard = board().map(row => [...row])
          newBoard[row][column].player = player
          setBoard(newBoard)
          setDroppingPiece(null)
          
          // Check for win
          if (checkWin(newBoard, row, column, player)) {
            handleWin(player)
          } else if (checkDraw(newBoard)) {
            setGameState('draw')
          } else {
            // Switch player and reset timer
            setCurrentPlayer(player === 1 ? 2 : 1)
            setTimeLeft(30)
          }
        } catch (error) {
          handleError(error)
          setDroppingPiece(null)
        }
      }, 500) // Animation duration
    } catch (error) {
      handleError(error)
    }
  }

  const handleBoardClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    try {
      // Prevent clicks during AI turn or when AI is thinking
      if (isVsCPU && (currentPlayer() === 2 || isAIThinking())) return
      
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const columnWidth = rect.width / 7
      const column = Math.floor(x / columnWidth)
      
      if (column >= 0 && column < 7) {
        dropDisc(column)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleBoardMouseMove: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (gameState() !== 'playing') return
    // Don't show hover during AI turn
    if (isVsCPU && (currentPlayer() === 2 || isAIThinking())) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const columnWidth = rect.width / 7
    const column = Math.floor(x / columnWidth)
    
    if (column >= 0 && column < 7) {
      setHoveredColumn(column)
    }
  }

  const handleBoardMouseLeave = () => {
    setHoveredColumn(null)
  }

  const checkWin = (board: Cell[][], row: number, col: number, player: Player): boolean => {
    perfMonitor.mark('checkWin-start')
    // Check horizontal
    let count = 1
    let winCells = [[row, col]]
    
    // Check left
    for (let i = col - 1; i >= 0 && board[row][i].player === player; i--) {
      count++
      winCells.push([row, i])
    }
    // Check right
    for (let i = col + 1; i < 7 && board[row][i].player === player; i++) {
      count++
      winCells.push([row, i])
    }
    if (count >= 4) {
      markWinningCells(board, winCells)
      return true
    }

    // Check vertical
    count = 1
    winCells = [[row, col]]
    // Check down
    for (let i = row + 1; i < 6 && board[i][col].player === player; i++) {
      count++
      winCells.push([i, col])
    }
    if (count >= 4) {
      markWinningCells(board, winCells)
      return true
    }

    // Check diagonal (top-left to bottom-right)
    count = 1
    winCells = [[row, col]]
    // Check up-left
    for (let i = 1; row - i >= 0 && col - i >= 0 && board[row - i][col - i].player === player; i++) {
      count++
      winCells.push([row - i, col - i])
    }
    // Check down-right
    for (let i = 1; row + i < 6 && col + i < 7 && board[row + i][col + i].player === player; i++) {
      count++
      winCells.push([row + i, col + i])
    }
    if (count >= 4) {
      markWinningCells(board, winCells)
      return true
    }

    // Check diagonal (top-right to bottom-left)
    count = 1
    winCells = [[row, col]]
    // Check up-right
    for (let i = 1; row - i >= 0 && col + i < 7 && board[row - i][col + i].player === player; i++) {
      count++
      winCells.push([row - i, col + i])
    }
    // Check down-left
    for (let i = 1; row + i < 6 && col - i >= 0 && board[row + i][col - i].player === player; i++) {
      count++
      winCells.push([row + i, col - i])
    }
    if (count >= 4) {
      markWinningCells(board, winCells)
      perfMonitor.mark('checkWin-end')
      perfMonitor.measure('checkWin', 'checkWin-start', 'checkWin-end')
      return true
    }

    perfMonitor.mark('checkWin-end')
    perfMonitor.measure('checkWin', 'checkWin-start', 'checkWin-end')
    return false
  }

  const markWinningCells = (board: Cell[][], cells: number[][]) => {
    cells.forEach(([row, col]) => {
      board[row][col].matched = true
    })
  }

  const checkDraw = (board: Cell[][]): boolean => {
    return board.every(row => row.every(cell => cell.player !== 0))
  }

  const handleWin = (player: Player) => {
    setGameState('won')
    setWinner(player)
    setIsTimerActive(false)
    setPlayerScores(prev => ({
      ...prev,
      [player === 1 ? 'player1' : 'player2']: prev[player === 1 ? 'player1' : 'player2'] + 1
    }))
  }

  const handleRestart = () => {
    setBoard(createEmptyBoard())
    setCurrentPlayer(1)
    setGameState('playing')
    setWinner(null)
    setTimeLeft(30)
    setIsTimerActive(true)
    setPlayerScores({player1: 0, player2: 0})
  }

  const handlePlayAgain = () => {
    setBoard(createEmptyBoard())
    // Alternate who goes first
    setCurrentPlayer(winner() === 1 ? 2 : 1)
    setGameState('playing')
    setWinner(null)
    setTimeLeft(30)
    setIsTimerActive(true)
  }

  const handleMenu = () => {
    navigate('/')
  }

  return (
    <div class={`${styles.box} ${gameState() === 'won' ? (winner() === 1 ? styles.player1Win : styles.player2Win) : ''}`}>
      <div class={styles.header}>
        <button class={`${styles.headerBtn} heading-xs`} onClick={handleMenu}>MENU</button>
        <Logo />
        <button class={`${styles.headerBtn} heading-xs`} onClick={handleRestart}>RESTART</button>
      </div>

      <div class={styles.boardBox}>
        <div class={styles.score}>
          <p class={`heading-xs ${styles.playerLabel}`}>{isVsCPU ? 'YOU' : 'PLAYER 1'}</p>
          <p class={`${styles.scoreText} heading-l`}>{playerScores().player1}</p>
          <img src={isVsCPU ? you : p1} class={styles.playerLogo} />
        </div>
        <div class={styles.board}>
          {/* Column markers */}
          <Show when={gameState() === 'playing' && hoveredColumn() !== null}>
            <div class={styles.markers}>
              <img 
                src={currentPlayer() === 1 ? markerRed : markerYellow}
                class={styles.marker}
                style={{
                  "grid-column": hoveredColumn()! + 1
                }}
              />
            </div>
          </Show>

          <div 
            class={styles.boardContainer} 
            onClick={handleBoardClick}
            onMouseMove={handleBoardMouseMove}
            onMouseLeave={handleBoardMouseLeave}
          >
            {/* Column hover preview */}
            <Show when={hoveredColumn() !== null && gameState() === 'playing'}>
              <div class={styles.columnHover}>
                <img 
                  src={currentPlayer() === 1 ? counterRed : counterYellow}
                  class={styles.hoverPreview}
                  style={{
                    "grid-column": hoveredColumn()! + 1,
                    "grid-row": 1
                  }}
                />
              </div>
            </Show>

            {/* Dropping piece animation */}
            <Show when={droppingPiece()}>
              <div class={styles.dropContainer}>
                <img 
                  src={droppingPiece()!.player === 1 ? counterRed : counterYellow}
                  class={styles.droppingPiece}
                  style={{
                    "grid-column": droppingPiece()!.column + 1,
                    "grid-row": droppingPiece()!.row + 1
                  }}
                />
              </div>
            </Show>

            <div class={styles.counters}>
              <For each={board()}>
                {(row, rowIndex) => (
                  <For each={row}>
                    {(cell, colIndex) => (
                      <Show when={cell.player !== 0}>
                        <img 
                          src={cell.player === 1 ? counterRed : counterYellow}
                          class={`${styles.counter} ${cell.matched ? styles.matched : ''}`}
                          style={{
                            "grid-column": colIndex() + 1,
                            "grid-row": rowIndex() + 1
                          }}
                        />
                      </Show>
                    )}
                  </For>
                )}
              </For>
            </div>

            {/* Win rings */}
            <div class={styles.winRings}>
              <For each={board()}>
                {(row, rowIndex) => (
                  <For each={row}>
                    {(cell, colIndex) => (
                      <Show when={cell.matched}>
                        <div 
                          class={styles.winRing}
                          style={{
                            "grid-column": colIndex() + 1,
                            "grid-row": rowIndex() + 1
                          }}
                        />
                      </Show>
                    )}
                  </For>
                )}
              </For>
            </div>
            <img src={boardWhite} class={styles.boardWhite} />
            <img src={boardBlack} class={styles.boardBlack} />
          </div>

          <Show when={gameState() === 'playing'}>
            <Show when={currentPlayer() === 1} fallback={
              <div class={`${styles.turn} ${styles.turn2}`}>
                <p class={`heading-xs ${styles.turnLabel}`}>
                  {isVsCPU ? (isAIThinking() ? 'CPU THINKING...' : 'CPU\'S TURN') : 'PLAYER 2\'S TURN'}
                </p>
                <p class={`heading-l ${styles.turnTimer}`}>{timeLeft()}s</p>
              </div>
            }>
              <div class={`${styles.turn} ${styles.turn1}`}>
                <p class={`heading-xs ${styles.turnLabel}`}>{isVsCPU ? 'YOUR TURN' : 'PLAYER 1\'S TURN'}</p>
                <p class={`heading-l ${styles.turnTimer}`}>{timeLeft()}s</p>
              </div>
            </Show>
          </Show>

          <Show when={gameState() === 'won'}>
            <div class={`${styles.winState} ${winner() === 1 ? styles.win1 : styles.win2}`}>
              <p class={`heading-xs ${styles.winLabel}`}>
                {isVsCPU ? (winner() === 1 ? 'YOU' : 'CPU') : `PLAYER ${winner()}`}
              </p>
              <p class={`heading-l ${styles.winText}`}>WINS</p>
              <button class={`${styles.playAgainBtn} heading-xs`} onClick={handlePlayAgain}>
                PLAY AGAIN
              </button>
            </div>
          </Show>

          <Show when={gameState() === 'draw'}>
            <div class={styles.winState}>
              <p class={`heading-l ${styles.winText}`}>DRAW</p>
              <button class={`${styles.playAgainBtn} heading-xs`} onClick={handlePlayAgain}>
                PLAY AGAIN
              </button>
            </div>
          </Show>
        </div>
        <div class={styles.score}>
          <p class={`heading-xs ${styles.playerLabel}`}>{isVsCPU ? 'CPU' : 'PLAYER 2'}</p>
          <p class={`${styles.scoreText} heading-l`}>{playerScores().player2}</p>
          <img src={isVsCPU ? cpu : p2} class={styles.playerLogo} />
        </div>
      </div>
    </div>
  )
}

export default Game

// rows x columns  6 x 7
const createEmptyBoard = (): Cell[][] => {
  return Array(6).fill(null).map(() => 
    Array(7).fill(null).map(() => ({
      player: 0,
      matched: false
    }))
  )
}
