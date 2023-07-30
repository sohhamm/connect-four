import {createSignal, type Component} from 'solid-js'
import styles from './game.module.css'
import Logo from '../../components/logo/Logo'

import boardWhite from '../../assets/images/board-layer-white-large.svg'
import boardBlack from '../../assets/images/board-layer-black-large.svg'
import p1 from '../../assets/images/player-one.svg'
import p2 from '../../assets/images/player-two.svg'
import {JSX} from 'solid-js/web/types/jsx'

// player: 0=>empty, 1=>p1, 2=>p2
// matched boolean => to show after 4 connects

const Game: Component = () => {
  const isP1 = true
  const [player, setPlayer] = createSignal(1)
  const [positions, setPositions] = createSignal(initialScore)

  const handleUpdatePosition: JSX.EventHandler<HTMLDivElement, MouseEvent> = e => {
    const offset = e.target.getClientRects()[0]

    const {width, height, left, top} = offset

    const x1 = e.clientX - left
    const y1 = e.clientY - top

    const colWidth = width / 7
    const rowHeight = height / 7

    const colNo = Math.ceil(x1 / colWidth)
    const rowNo = Math.ceil(y1 / rowHeight)

    setPositions(prevPos => {
      const newPos = [...prevPos]
      newPos[colNo - 1][rowNo - 1].player = player()
      return newPos
    })

    setPlayer(oldPlayer => {
      if (oldPlayer === 1) {
        return 2
      } else {
        return 1
      }
    })
    console.log(positions())
  }

  console.log(positions())

  return (
    <div class={styles.box}>
      <div class={styles.header}>
        <button class={`${styles.headerBtn} heading-xs`}>MENU</button>
        <Logo />
        <button class={`${styles.headerBtn} heading-xs`}>RESTART</button>
      </div>

      <div class={styles.boardBox}>
        <div class={styles.score}>
          <p class={`heading-xs ${styles.playerLabel}`}>PLAYER 1</p>
          <p class={`${styles.scoreText} heading-l`}>12</p>
          <img src={p1} class={styles.playerLogo} />
        </div>
        <div class={styles.board}>
          <div onClick={handleUpdatePosition}>
            <img src={boardWhite} class={styles.boardWhite} />
            <img src={boardBlack} class={styles.boardBlack} />
          </div>

          {isP1 ? (
            <div class={`${styles.turn} ${styles.turn1}`}>
              <p class={`heading-xs ${styles.turnLabel}`}>PLAYER 1&apos;S TURN</p>
              <p class={`heading-l ${styles.turnTimer}`}>3s</p>
            </div>
          ) : (
            <div class={`${styles.turn} ${styles.turn2}`}>
              <p class={`heading-xs ${styles.turnLabel}`}>PLAYER 2&apos;S TURN</p>
              <p class={`heading-l ${styles.turnTimer}`}>14s</p>
            </div>
          )}
        </div>
        <div class={styles.score}>
          <p class={`heading-xs ${styles.playerLabel}`}>PLAYER 2</p>
          <p class={`${styles.scoreText} heading-l`}>24</p>
          <img src={p2} class={styles.playerLogo} />
        </div>
      </div>
    </div>
  )
}

export default Game

// columns x rows  7 x 6
const initialScore = [
  [
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
  ],
  [
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
  ],
  [
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
  ],
  [
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
  ],
  [
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
  ],
  [
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
  ],
  [
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
    {player: 0, matched: false},
  ],
]
