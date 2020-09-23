import { Graphics } from 'pixi.js'
import utils from './utils.js'

const PIECES = {
    empty: {
        type: 'empty',
        style: { fill: { color: 0x222222 } }
    },
    red: {
        type: 'red',
        style: { fill: { color: 0xFF0000 } }
    },
    green: {
        type: 'green',
        style: { fill: { color: 0x00FF00 } }
    }
}

const flatHexCorner = (size, i) => {
    let angleDeg = 60 * i
    let angleRad = Math.PI / 180 * angleDeg
    return [
        size * Math.cos(angleRad),
        size * Math.sin(angleRad)
    ]
}

const getHexPath = (size) => {
    let path = []
    for (let i = 0; i < 6; i++) {
        path.push(...flatHexCorner(size, i))
    }
    return path
}

const getHexGraphics = (size, { border, fill }, tint = false) => {
    let path = getHexPath(size)
    let hex = new Graphics()

    if (fill) {
        hex.beginFill(fill.color)
    }
    if (border) {
        hex.lineStyle(border.size, border.color, 1)
    }
    hex.drawPolygon(path)
    if (fill) {
        hex.endFill()
    }

    hex.interactive = true

    if (tint) {
        hex.on('pointerover', (event) => {
            hex.tint = 0x00FF00
            hex.zIndex = 2
        })
        hex.on('pointerout', (event) => {
            hex.tint = 0xffffff
            hex.zIndex = 0
        })
    }

    return hex
}

const initBoard = (w, h, size, onHexClicked) => {
    let board = []
    for (let i = 0; i < h; i++) {
        let hexes = []
        for (let j = 0; j < w; j++) {
            let emptyHex = getHexGraphics(size, PIECES.empty.style, true)
            emptyHex.on('pointerdown', (event) => {
                emptyHex.zIndex = 0
                if (onHexClicked) {
                    onHexClicked(i, j)
                }
            })
            hexes.push({ graphic: emptyHex, type: 'empty' })
        }
        board.push(hexes)
    }
    return { size: size, grid: board, onHexClicked: onHexClicked }
}

const drawBoard = (container, board) => {
    if (container.children.length > 0) {
        container.removeChildren(0, container.children.length - 1)
    }
    const w = 2 * board.size
    const offset = w / 2
    const h = Math.sqrt(3) * board.size
    for (let i = 0; i < board.grid.length; i++) {
        for (let j = 0; j < board.grid[i].length; j++) {
            const wDist = w * (3 / 4) * j
            const hDist = h * i + (j % 2 === 0 ? 0 : h / 2)
            board.grid[i][j].graphic.x = offset + wDist
            board.grid[i][j].graphic.y = offset + hDist
            container.addChild(board.grid[i][j].graphic)
        }
    }
}

const placePiece = (board, x, y, piece) => {
    const hex = getHexGraphics(board.size, piece.style)
    hex.on('pointerdown', (event) => {
        if (board.onHexClicked) {
            board.onHexClicked(x, y)
        }
    })
    board.grid[x][y].type = piece.type
    board.grid[x][y].graphic = hex
}

const movePiece = (board, x1, y1, x2, y2) => {
    const piece = board.grid[x1][y1]
    board.grid[x2][y2] = piece
    board.grid[x2][y2].graphic.on('pointerdown', (event) => {
        if (board.onHexClicked) {
            board.onHexClicked(x2, y2)
        }
    })

    let emptyHex = getHexGraphics(board.size, PIECES.empty.style, true)
    emptyHex.on('pointerdown', (event) => {
        emptyHex.zIndex = 0
        if (board.onHexClicked) {
            board.onHexClicked(x1, y1)
        }
    })

    board.grid[x1][y1] = { type: 'empty', graphic: emptyHex }
}

export default {
    initBoard,
    drawBoard,
    getHexGraphics,
    placePiece,
    movePiece,
    PIECES
}