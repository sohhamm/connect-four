import MainMenu from './pages/main-menu/MainMenu'
import Game from './pages/game/Game'
import NotFound from './pages/not-found/NotFound'
import {Route} from '@solidjs/router'
import type {Component} from 'solid-js'
import Rules from './pages/rules/Rules'

const App: Component = () => {
  return (
    <>
      <Route path='/' component={MainMenu} />
      <Route path='/game' component={Game} />
      <Route path='/rules' component={Rules} />
      <Route path='*404' component={NotFound} />
    </>
  )
}

export default App
