# Frontend Mentor - Connect Four game solution

This is a solution to the [Connect Four game challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/connect-four-game-6G8QVH923s). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the game rules
- Play a game of Connect Four against another human player (alternating turns on the same computer)
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- **Bonus**: See the discs animate into their position when a move is made
- **Bonus**: Play against the computer

### Screenshot

![Connect Four Game Screenshot](./preview.jpg)

### Links

- Solution URL: [GitHub Repository](https://github.com/yourusername/connect-four)
- Live Site URL: [Live Demo](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- CSS Modules
- CSS Grid
- Mobile-first workflow
- [SolidJS](https://www.solidjs.com/) - JS library
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [SolidJS Router](https://github.com/solidjs/solid-router) - Client-side routing

### What I learned

This project helped me explore SolidJS's reactive primitives and signals. I implemented a complete Connect Four game with:

- **Game Logic**: 6x7 board matrix with win detection for horizontal, vertical, and diagonal connections
- **Turn Timer**: 30-second countdown per turn with automatic forfeit
- **Score Tracking**: Persistent scores throughout multiple rounds
- **Winning Animation**: Visual highlighting of winning disc sequences

Key implementation highlights:

```typescript
const checkWin = (board: Cell[][], row: number, col: number, player: number): boolean => {
  // Check all four directions: horizontal, vertical, and both diagonals
  // Returns true if 4 or more consecutive pieces are found
}
```

```typescript
// Timer management with SolidJS effects
createEffect(() => {
  if (gameState() !== 'playing' || !isTimerActive()) return
  
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        const otherPlayer = currentPlayer() === 1 ? 2 : 1
        handleWin(otherPlayer)
        return 30
      }
      return prev - 1
    })
  }, 1000)

  return () => clearInterval(timer)
})
```

### Continued development

Future enhancements to focus on:

- **AI Opponent**: Implement minimax algorithm for computer player
- **Disc Animations**: Add smooth drop animations when pieces are placed
- **Sound Effects**: Audio feedback for moves and wins
- **Online Multiplayer**: Real-time gameplay between remote players
- **Accessibility**: Enhanced keyboard navigation and screen reader support

## Author

- Frontend Mentor - [@yourusername](https://www.frontendmentor.io/profile/yourusername)
- GitHub - [@yourusername](https://github.com/yourusername)