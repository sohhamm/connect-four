import styles from './button.module.css'
import type {JSX} from 'solid-js'

interface ButtonProps {
  btnStyles: string
  imgSrc?: string
  children: string | JSX.Element
  imgAlt?: string
}

const Button = ({children, btnStyles, imgSrc, imgAlt}: ButtonProps) => {
  return (
    <div class={`${styles.btn} ${btnStyles}`}>
      <p class='heading-m'>{children}</p>

      {imgSrc && <img src={imgSrc} alt={imgAlt} />}
    </div>
  )
}

export default Button
