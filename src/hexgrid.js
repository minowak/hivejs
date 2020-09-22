import { Graphics } from 'pixi.js'
import utils from './utils.js'

const EMPTY_PIECE = { border: { size: 4, color: 0x666666 }, fill: { color: 0x222222 } }
const RED_PIECE = { fill: { color: 0xFF0000 } }
const GREEN_PIECE = { fill: { color: 0x00FF00 } }

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

    if (tint) {
        hex.interactive = true
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
            let emptyHex = getHexGraphics(size, EMPTY_PIECE, true)
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
    return board
}

const drawBoard = (container, size, board) => {
    if (container.children.length > 0) {
        container.removeChildren(0, container.children.length - 1)
    }
    const w = 2 * size
    const offset = w / 2
    const h = Math.sqrt(3) * size
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const wDist = w * (3 / 4) * j
            const hDist = h * i + (j % 2 === 0 ? 0 : h / 2)
            board[i][j].graphic.x = offset + wDist
            board[i][j].graphic.y = offset + hDist
            container.addChild(board[i][j].graphic)
        }
    }
}

export default {
    initBoard,
    drawBoard,
    getHexGraphics,
    EMPTY_PIECE,
    RED_PIECE,
    GREEN_PIECE
}