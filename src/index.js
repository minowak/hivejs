import { Application, Container } from 'pixi.js'
import hexgrid from './hexgrid.js'

const app = new Application({
	width: window.innerWidth,
	height: window.innerHeight
})
document.body.appendChild(app.view)

const boardContainer = new Container()
boardContainer.sortableChildren = true

const piecesContainer = new Container()

app.stage.addChild(boardContainer)
app.stage.addChild(piecesContainer)

const size = 50

let newPiece = null
let selectedPiece = null

const redPiece = hexgrid.getHexGraphics(size, hexgrid.PIECES.red.style)
const greenPiece = hexgrid.getHexGraphics(size, hexgrid.PIECES.green.style)

redPiece.on('pointerdown', (event) => {
	newPiece = hexgrid.PIECES.red
	selectedPiece = null
})

greenPiece.on('pointerdown', (event) => {
	newPiece = hexgrid.PIECES.green
	selectedPiece = null
})

redPiece.x = app.view.width / 2 - 100
redPiece.y = app.view.height - 50
greenPiece.x = app.view.width / 2 + 100
greenPiece.y = app.view.height - 50

piecesContainer.addChild(redPiece)
piecesContainer.addChild(greenPiece)

const onPieceClicked = (x, y) => {
	const piece = board.grid[x][y]
	if (piece.type === 'empty' && newPiece) {
		hexgrid.placePiece(board, x, y, newPiece)
	} else if (!selectedPiece && piece.type !== 'empty') {
		console.log('selecting piece')
		selectedPiece = { x, y }
	} else if (selectedPiece && piece.type === 'empty') {
		console.log('moving piece ' + selectedPiece.x + ' ' + selectedPiece.y + ' -> ' + x + ' ' + y)
		hexgrid.movePiece(board, selectedPiece.x, selectedPiece.y, x, y)
		selectedPiece = null
	}
	newPiece = null
	hexgrid.drawBoard(boardContainer, board)
}

const board = hexgrid.initBoard(10, 7, size, onPieceClicked)
hexgrid.drawBoard(boardContainer, board)
