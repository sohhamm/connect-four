/* @refresh reload */
import {render} from 'solid-js/web'
import '@fontsource/space-grotesk'
import './index.css'
import App from './App'
import {Router} from '@solidjs/router'

import {logger} from './utils/logger'

logger.info('Connect Four app starting up')

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  logger.error('Root element not found')
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
  )
}

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root!,
)

logger.info('Connect Four app rendered successfully')
