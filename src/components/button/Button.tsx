import styles from './button.module.css'

interface ButtonProps {
  btnStyles: string
  imgSrc?: string
  text: string
}

const Button = ({text, btnStyles, imgSrc}: ButtonProps) => {
  return (
    <div class={`${styles.btn} ${btnStyles}`}>
      <p class='heading-m'>{text}</p>

      {imgSrc && <img src={imgSrc} alt='Player versus player' />}
    </div>
  )
}

export default Button
