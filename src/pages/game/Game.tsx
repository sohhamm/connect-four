import type {Component} from 'solid-js'
import styles from './game.module.css'
import Logo from '../../components/logo/Logo'

import boardWhite from '../../assets/images/board-layer-white-large.svg'
import boardBlack from '../../assets/images/board-layer-black-large.svg'
import p1 from '../../assets/images/player-one.svg'
import p2 from '../../assets/images/player-two.svg'
import turn1 from '../../assets/images/turn-background-red.svg'
import turn2 from '../../assets/images/turn-background-yellow.svg'

const Game: Component = () => {
  const isP1 = false
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
          <img src={boardWhite} class={styles.boardWhite} />
          <img src={boardBlack} class={styles.boardBlack} />

          {isP1 ? (
            <div class={`${styles.turn} ${styles.turn1}`}>
              <p class={`heading-xs ${styles.turnLabel}`}>PLAYER 1&apos;S TURN</p>
              <p class={`heading-l ${styles.turnTimer}`}>3s</p>
              <img src={turn1} alt='' class={styles.turnImg} />
            </div>
          ) : (
            <div class={`${styles.turn} ${styles.turn2}`}>
              <p class={`heading-xs ${styles.turnLabel}`}>PLAYER 2&apos;S TURN</p>
              <p class={`heading-l ${styles.turnTimer}`}>14s</p>
              <img src={turn2} alt='' class={styles.turnImg} />
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
