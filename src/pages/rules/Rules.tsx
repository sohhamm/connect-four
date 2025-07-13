import type {Component} from 'solid-js'
import styles from './rules.module.css'
import {A} from '@solidjs/router'
import Button from '../../components/button/Button'

const Rules: Component = () => {
  return (
    <div class={styles.box}>
      <div class={styles.container}>
        <h1 class={`${styles.title} heading-l`}>RULES</h1>
        
        <div class={styles.content}>
          <h2 class={`${styles.subtitle} heading-xs`}>OBJECTIVE</h2>
          <p class={`${styles.text} body`}>
            Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).
          </p>

          <h2 class={`${styles.subtitle} heading-xs`}>HOW TO PLAY</h2>
          <div class={styles.steps}>
            <div class={styles.step}>
              <span class={`${styles.stepNumber} heading-xs`}>1</span>
              <p class={`${styles.stepText} body`}>Red goes first in the first game.</p>
            </div>
            <div class={styles.step}>
              <span class={`${styles.stepNumber} heading-xs`}>2</span>
              <p class={`${styles.stepText} body`}>Players must alternate turns, and only one disc can be dropped in each turn.</p>
            </div>
            <div class={styles.step}>
              <span class={`${styles.stepNumber} heading-xs`}>3</span>
              <p class={`${styles.stepText} body`}>The game ends when there is a 4-in-a-row or a stalemate.</p>
            </div>
            <div class={styles.step}>
              <span class={`${styles.stepNumber} heading-xs`}>4</span>
              <p class={`${styles.stepText} body`}>The starter of the previous game goes second on the next game.</p>
            </div>
          </div>

          <h2 class={`${styles.subtitle} heading-xs`}>TIMER</h2>
          <p class={`${styles.text} body`}>
            Each player has 30 seconds to make their move. If the timer runs out, the other player wins the round.
          </p>
        </div>

        <A href='/'>
          <Button btnStyles={styles.checkBtn}>
            <div class={styles.checkIcon}></div>
          </Button>
        </A>
      </div>
    </div>
  )
}

export default Rules
