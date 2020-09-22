import { Application, Container } from 'pixi.js'
import hexgrid from './hexgrid.js'

const app = new Application({
	width: window.innerWidth,
	height: window.innerHeight
})
document.body.appendChild(app.view)

const boardContainer = new Container()
boardContainer.sortableChildren = true
// boardContainer.interactive = true

// boardContainer.on('pointerdown', (event) => {
// 	console.log(event.data.originalEvent.layerX + ' ' + event.data.originalEvent.layerY)
// })

app.stage.addChild(boardContainer)

const onPieceClicked = (x, y) => {
	const piece = board[x][y]
	if (piece.type === 'empty') {
		piece.graphic = hexgrid.getHexGraphics(size, hexgrid.RED_PIECE)
		piece.type = 'red'
	} else if (piece.type === 'red') {
		piece.graphic = hexgrid.getHexGraphics(size, hexgrid.EMPTY_PIECE)
		piece.type = 'empty'
	}
	piece.graphic.interactive = true
	piece.graphic.on('pointerdown', (event) => {
		onPieceClicked(x, y)
	})
	hexgrid.drawBoard(boardContainer, size, board)
}

const size = 50
const board = hexgrid.initBoard(10, 8, size, onPieceClicked)
hexgrid.drawBoard(boardContainer, size, board)
