import type {Component} from 'solid-js'
import styles from './main-menu.module.css'
import pvp from '../../assets/images/player-vs-player.svg'
import {A} from '@solidjs/router'
import Logo from '../../components/logo/Logo'

const MainMenu: Component = () => {
  return (
    <div class={styles.box}>
      <div class={styles.menu}>
        <Logo />

        <A href='/game'>
          <div class={`${styles.btn} ${styles.btnStart}`}>
            <p class='heading-m'>PLAY VS PLAYER</p>
            <img src={pvp} alt='Player versus player' />
          </div>
        </A>

        <A href='/rules'>
          <div class={`${styles.btn} ${styles.btnRules}`}>
            <p class='heading-m'>GAME RULES</p>
          </div>
        </A>
      </div>
    </div>
  )
}

export default MainMenu
