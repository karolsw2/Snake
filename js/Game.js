import { Board } from './Board.js'

export class Game {
  constructor () {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.resize = this.resize.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.animationFrame = this.animationFrame.bind(this)
    this.info = {
      main: document.getElementById('gameInfo__main'),
      score: document.getElementById('gameInfo__score')
    }
    this.board = new Board(23, 23, 23)
    this.highScore = 0
    this.score = 0
    this.paused = true
    this.started = false
  }

  // Initialises the game
  init () {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('resize', this.resize)
    this.resize()
    this.showInfo('Press space to start', 'main')
  }

  // Resizes canvas to standard width and height
  resize () {
    this.canvas.width = this.board.sizeX * this.board.tileWidth
    this.canvas.height = this.board.sizeY * this.board.tileWidth
  }

  togglePause () {
    this.paused = !this.paused
    if (this.paused) {
      this.showInfo('🚩 Press space to resume 🚩', 'main')
    } else {
      this.showInfo('', 'main')
    }
  }

  onKeyDown (event) {
    var keyCode = event.keyCode
    if ((keyCode === 68 || keyCode === 39) && this.board.snake.actualMoveDirection !== 'left') { // d
      this.board.snake.actualMoveDirection = 'right'
    } else if ((keyCode === 83 || keyCode === 40) && this.board.snake.actualMoveDirection !== 'up') { // s
      this.board.snake.actualMoveDirection = 'down'
    } else if ((keyCode === 65 || keyCode === 37) && this.board.snake.actualMoveDirection !== 'right') { // a
      this.board.snake.actualMoveDirection = 'left'
    } else if ((keyCode === 87 || keyCode === 38) && this.board.snake.actualMoveDirection !== 'down') { // w
      this.board.snake.actualMoveDirection = 'up'
    } else if (keyCode === 32) { // space
      if (!this.started) {
        this.started = true
        this.startInterval()
      }
      this.togglePause()
    }
    this.animationFrame()
  }

  animationFrame () {
    if (this.checkIfSnakeCrashed()) {
      this.gameOver()
    }

    if (!this.paused) {
      if (this.board.checkSnakeFoodCollision()) {
        this.score += 2
        if (this.score > this.highScore) {
          this.highScore += 2
        }
        this.board.food.changePosition()
        this.board.snake.expand = true
        this.showInfo('Score: ' + this.score + '  Highscore: ' + this.highScore, 'score')
      }
      this.draw()
    }
  }

  // Draw all objects in the game canvas
  draw () {
    this.board.snake.move()
    this.ctx.beginPath()
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = '#e1eff6'
    this.ctx.fill()
    this.drawFood()
    this.drawSnake()
  }

  drawFood () {
    this.ctx.beginPath()
    this.ctx.rect(this.board.food.posX * this.board.tileWidth, this.board.food.posY * this.board.tileWidth, this.board.tileWidth, this.board.tileWidth)
    this.ctx.fillStyle = this.board.food.color
    this.ctx.fill()
  }

  drawSnake () {
    this.ctx.fillStyle = this.board.snake.color
    for (let i = 0; i < this.board.snake.tiles.length; i++) {
      var tile = this.board.snake.tiles[i]
      this.ctx.beginPath()
      this.ctx.rect(tile.x * this.board.tileWidth, tile.y * this.board.tileWidth, this.board.tileWidth, this.board.tileWidth)
      this.ctx.fill()
    }
  }

  // Show a text information on the screen
  showInfo (text, position) {
    switch (position) {
      case 'main':
        this.info.main.innerHTML = text
        break
      case 'score':
        this.info.score.innerHTML = text
        break
    }
  }

  checkIfSnakeCrashed () {
    return (this.board.snake.checkSelfCollision() || this.board.checkSnakeWallCollision())
  }

  gameOver () {
    this.showInfo('Game over! Score: ' + this.score, 'main')
    this.reset()
  }

  reset () {
    this.score = 0
    this.board.snake.setTail(0, Math.floor(this.board.sizeY / 2))
    this.board.snake.actualMoveDirection = 'right'
    this.paused = true
  }

  startInterval () {
    setInterval(this.animationFrame, 85)
  }
}
