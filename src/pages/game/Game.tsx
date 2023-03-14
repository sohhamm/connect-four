import type {Component} from 'solid-js'
import styles from './game.module.css'

const Game: Component = () => {
  return (
    <div class={styles.box}>
      <div class={styles.header}>
        <button>MENU</button>

        <button>RESTART</button>
      </div>
    </div>
  )
}

export default Game
