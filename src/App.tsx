import {Routes, Route} from '@solidjs/router'
import type {Component} from 'solid-js'
import MainMenu from './pages/main-menu/MainMenu'
import Game from './pages/game/Game'

const App: Component = () => {
  return (
    <Routes>
      <Route path='/' component={MainMenu} />
      <Route path='/game' component={Game} />
    </Routes>
  )
}

export default App
