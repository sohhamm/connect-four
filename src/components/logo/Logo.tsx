import type {Component} from 'solid-js'
import styles from './logo.module.css'
import logo from '../../assets/images/logo.svg'

const Logo: Component = () => {
  return <img src={logo} alt='Connect four logo' class={styles.logo} />
}

export default Logo
