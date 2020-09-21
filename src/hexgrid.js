import { Graphics } from 'pixi.js'

const flatHexCorner = (center, size, i) => {
    let angleDeg = 60 * i
    let angleRad = Math.PI / 180 * angleDeg
    return [
        center.x + size * Math.cos(angleRad),
        center.y + size * Math.sin(angleRad)
    ]
}

const getHexPath = (center, size) => {
    let path = []
    for (let i = 0; i < 6; i++) {
        path.push(...flatHexCorner(center, size, i))
    }
    return path
}

const getHexGraphics = (center, size, { border, fill }) => {
    let path = getHexPath(center, size)
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

    return hex
}

const drawGrid = (container, size, board, color, onHexClicked) => {
    const w = 2 * size
    const offset = w / 2
    const h = Math.sqrt(3) * size
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const wDist = w * (3 / 4) * j
            const hDist = h * i + (j % 2 === 0 ? 0 : h / 2)
            let hex = getHexGraphics({ x: offset + wDist, y: offset + hDist }, size, { border: { size: 4, color: color }, fill: { color: 0xc68f03 } })
            hex.interactive = true
            hex.on('pointerover', (event) => {
                hex.tint = 0x00FF00
                hex.zIndex = 1000
            })
            hex.on('pointerout', (event) => {
                hex.tint = 0xFFFFFF
                hex.zIndex = 0
            })
            hex.on('pointerdown', (event) => {
                if (onHexClicked) {
                    onHexClicked(i, j)
                }
            })
            container.addChild(hex)
        }
    }
}

// TODO put graphics into board
const initBoard = (w, h, size, onHexClicked) => {
    let board = []
    const w = 2 * size
    const offset = w / 2
    const h = Math.sqrt(3) * size
    for (let i = 0; i < h; i++) {
        let hexes = []
        for (let j = 0; j < w; j++) {
            const wDist = w * (3 / 4) * j
            const hDist = h * i + (j % 2 === 0 ? 0 : h / 2)
            let hex = getHexGraphics({ x: offset + wDist, y: offset + hDist }, size, { border: { size: 4, color: 0x666666 }, fill: { color: 0xc68f03 } })
            hex.interactive = true
            hex.on('pointerover', (event) => {
                hex.tint = 0x00FF00
                hex.zIndex = 1000
            })
            hex.on('pointerout', (event) => {
                hex.tint = 0xFFFFFF
                hex.zIndex = 0
            })
            hex.on('pointerdown', (event) => {
                if (onHexClicked) {
                    onHexClicked(i, j)
                }
            })
            hexes.push({ graphic: hex })
        }
        board.push(hexes)
    }
    return board
}

// TODO calculate x/y in drawBoard based on i/j
const placePiece = (board, x, y, size, color, onHexClicked) => {
    const w = 2 * size
    const offset = w / 2
    const h = Math.sqrt(3) * size

    const wDist = w * (3 / 4) * x
    const hDist = h * y + (x % 2 === 0 ? 0 : h / 2)
    let hex = getHexGraphics({ x: offset + wDist, y: offset + hDist }, size, { fill: { color: color } })
    boar
}

const drawBoard = (container, board) => {
    if (container.children.length > 0) {
        container.removeChildren(0, container.children.length - 1)
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j]) {
                container.addChild(board[i][j].graphic)
            }
        }
    }
}

export default {
    drawGrid,
    initBoard,
    drawBoard
}