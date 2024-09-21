import MainMenu from './pages/main-menu/MainMenu'
import Game from './pages/game/Game'
import NotFound from './pages/not-found/Notfound'
import {Route} from '@solidjs/router'
import type {Component} from 'solid-js'

const App: Component = () => {
  return (
    <>
      <Route path='/' component={MainMenu} />
      <Route path='/game' component={Game} />
      <Route path='*404' component={NotFound} />
    </>
  )
}

export default App
