import { Application, Container } from 'pixi.js'
import hexgrid from './hexgrid.js'

const app = new Application({
	width: window.innerWidth,
	height: window.innerHeight
})
document.body.appendChild(app.view)

const boardContainer = new Container()
boardContainer.sortableChildren = true

app.stage.addChild(boardContainer)

const size = 50
const board = hexgrid.initBoard(10, 8, size, (x, y) => {
	board[x][y] = 0xFF0000
	console.log(x + ' ' + y)
	hexgrid.drawBoard(boardContainer, board)
})

hexgrid.drawBoard(boardContainer, board)

// boardContainer.x = app.screen.width / 2
// boardContainer.y = app.screen.height / 2
