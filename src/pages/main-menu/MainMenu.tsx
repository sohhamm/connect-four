import styles from './main-menu.module.css'
import pvp from '../../assets/images/player-vs-player.svg'
import cpu from '../../assets/images/player-vs-cpu.svg'
import Logo from '../../components/logo/Logo'
import Button from '../../components/button/Button'
import {A} from '@solidjs/router'
import type {Component} from 'solid-js'

const MainMenu: Component = () => {
  return (
    <div class={styles.box}>
      <div class={styles.menu}>
        <Logo />

        <A href='/game?mode=pvp'>
          <Button imgSrc={pvp} imgAlt='play versus player' btnStyles={styles.btnStart}>
            PLAY VS PLAYER
          </Button>
        </A>

        <A href='/game?mode=cpu'>
          <Button imgSrc={cpu} imgAlt='play versus computer' btnStyles={styles.btnStart}>
            PLAY VS CPU
          </Button>
        </A>

        <A href='/rules'>
          <Button btnStyles={styles.btnRules}>GAME RULES</Button>
        </A>
      </div>
    </div>
  )
}

export default MainMenu
