import {createSignal, type JSX, type Component, For, Show, createEffect} from 'solid-js'
import styles from './game.module.css'
import Logo from '../../components/logo/Logo'
import {useNavigate} from '@solidjs/router'

import boardWhite from '../../assets/images/board-layer-white-large.svg'
import boardBlack from '../../assets/images/board-layer-black-large.svg'
import counterRed from '../../assets/images/counter-red-large.svg'
import counterYellow from '../../assets/images/counter-yellow-large.svg'
import p1 from '../../assets/images/player-one.svg'
import p2 from '../../assets/images/player-two.svg'
import markerRed from '../../assets/images/marker-red.svg'
import markerYellow from '../../assets/images/marker-yellow.svg'

// player: 0=>empty, 1=>p1, 2=>p2
// matched boolean => to show after 4 connects

type Cell = {
  player: number
  matched: boolean
}

type GameState = 'playing' | 'won' | 'draw'

const Game: Component = () => {
  const navigate = useNavigate()
  const [currentPlayer, setCurrentPlayer] = createSignal(1)
  const [board, setBoard] = createSignal(createEmptyBoard())
  const [gameState, setGameState] = createSignal<GameState>('playing')
  const [winner, setWinner] = createSignal<number | null>(null)
  const [playerScores, setPlayerScores] = createSignal({player1: 0, player2: 0})
  const [timeLeft, setTimeLeft] = createSignal(30)
  const [isTimerActive, setIsTimerActive] = createSignal(true)
  const [hoveredColumn, setHoveredColumn] = createSignal<number | null>(null)
  const [droppingPiece, setDroppingPiece] = createSignal<{column: number, row: number, player: number} | null>(null)

  // Timer effect
  createEffect(() => {
    if (gameState() !== 'playing' || !isTimerActive()) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - other player wins
          const otherPlayer = currentPlayer() === 1 ? 2 : 1
          handleWin(otherPlayer)
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  })

  const dropDisc = (column: number) => {
    if (gameState() !== 'playing' || droppingPiece()) return

    const currentBoard = board()
    
    // Check if column is full
    if (currentBoard[0][column].player !== 0) {
      // Column is full - could add visual feedback here
      return
    }
    
    // Find the lowest empty row in the column
    for (let row = 5; row >= 0; row--) {
      if (currentBoard[row][column].player === 0) {
        const player = currentPlayer()
        
        // Start drop animation
        setDroppingPiece({ column, row, player })
        
        // Add piece to board after animation
        setTimeout(() => {
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
        }, 500) // Animation duration
        break
      }
    }
  }

  const handleBoardClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const columnWidth = rect.width / 7
    const column = Math.floor(x / columnWidth)
    
    if (column >= 0 && column < 7) {
      dropDisc(column)
    }
  }

  const handleBoardMouseMove: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (gameState() !== 'playing') return
    
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

  const checkWin = (board: Cell[][], row: number, col: number, player: number): boolean => {
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
      return true
    }

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

  const handleWin = (player: number) => {
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
          <p class={`heading-xs ${styles.playerLabel}`}>PLAYER 1</p>
          <p class={`${styles.scoreText} heading-l`}>{playerScores().player1}</p>
          <img src={p1} class={styles.playerLogo} />
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
                <p class={`heading-xs ${styles.turnLabel}`}>PLAYER 2'S TURN</p>
                <p class={`heading-l ${styles.turnTimer}`}>{timeLeft()}s</p>
              </div>
            }>
              <div class={`${styles.turn} ${styles.turn1}`}>
                <p class={`heading-xs ${styles.turnLabel}`}>PLAYER 1'S TURN</p>
                <p class={`heading-l ${styles.turnTimer}`}>{timeLeft()}s</p>
              </div>
            </Show>
          </Show>

          <Show when={gameState() === 'won'}>
            <div class={`${styles.winState} ${winner() === 1 ? styles.win1 : styles.win2}`}>
              <p class={`heading-xs ${styles.winLabel}`}>PLAYER {winner()}</p>
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
          <p class={`heading-xs ${styles.playerLabel}`}>PLAYER 2</p>
          <p class={`${styles.scoreText} heading-l`}>{playerScores().player2}</p>
          <img src={p2} class={styles.playerLogo} />
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

const initialBoard = createEmptyBoard()
