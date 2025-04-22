"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { Block } from "@/lib/types"

interface GameState {
  snake: { x: number; y: number }[]
  food: { x: number; y: number }
  direction: string
  speed: number
  score: number
  gameOver: boolean
  gridSize: number
  boardSize: number
}

interface GamePreviewProps {
  isPlaying: boolean
  blocks: Block[]
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

export default function GamePreview({ isPlaying, blocks, gameState, setGameState }: GamePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snakeColor, setSnakeColor] = useState("#4CAF50")
  const [foodColor, setFoodColor] = useState("#F44336")
  const [message, setMessage] = useState("")
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const lastRenderTimeRef = useRef<number>(0)

  // Apply customization blocks
  useEffect(() => {
    blocks.forEach((block) => {
      if (block.action === "SET_SNAKE_COLOR" && block.params[0]) {
        setSnakeColor(block.params[0].value as string)
      }
      if (block.action === "SET_FOOD_COLOR" && block.params[0]) {
        setFoodColor(block.params[0].value as string)
      }
    })
  }, [blocks])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameState.gameOver) return

      // Check if "Handle key press" block exists
      const keyPressBlock = blocks.find((block) => block.action === "KEY_PRESS")
      if (!keyPressBlock) return

      // Check if "Change direction" block exists
      const changeDirectionBlock = blocks.find((block) => block.action === "CHANGE_DIRECTION")
      if (!changeDirectionBlock) return

      const { direction } = gameState
      let newDirection = direction

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") newDirection = "UP"
          break
        case "ArrowDown":
          if (direction !== "UP") newDirection = "DOWN"
          break
        case "ArrowLeft":
          if (direction !== "RIGHT") newDirection = "LEFT"
          break
        case "ArrowRight":
          if (direction !== "LEFT") newDirection = "RIGHT"
          break
      }

      if (newDirection !== direction) {
        setGameState((prev) => ({ ...prev, direction: newDirection }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying, gameState, blocks, setGameState])

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameState.gameOver) {
      const updateGame = () => {
        // Check if "Move snake" block exists
        const moveSnakeBlock = blocks.find((block) => block.action === "MOVE_SNAKE")
        if (!moveSnakeBlock) return

        const { snake, direction, food, gridSize, boardSize } = gameState
        const cellSize = boardSize / gridSize
        const head = { ...snake[0] }

        // Move snake head based on direction
        switch (direction) {
          case "UP":
            head.y -= 1
            break
          case "DOWN":
            head.y += 1
            break
          case "LEFT":
            head.x -= 1
            break
          case "RIGHT":
            head.x += 1
            break
        }

        // Check wall collision
        const checkWallBlock = blocks.find((block) => block.action === "CHECK_WALL")
        if (checkWallBlock) {
          if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            const gameOverBlock = blocks.find((block) => block.action === "GAME_OVER")
            if (gameOverBlock) {
              setGameState((prev) => ({ ...prev, gameOver: true }))
              setMessage("Game Over! You hit a wall.")
              return
            }
          }
        }

        // Check self collision
        const checkSelfBlock = blocks.find((block) => block.action === "CHECK_SELF")
        if (checkSelfBlock) {
          for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
              const gameOverBlock = blocks.find((block) => block.action === "GAME_OVER")
              if (gameOverBlock) {
                setGameState((prev) => ({ ...prev, gameOver: true }))
                setMessage("Game Over! You hit yourself.")
                return
              }
            }
          }
        }

        // Create new snake array
        const newSnake = [head, ...snake]

        // Check food collision
        const checkFoodBlock = blocks.find((block) => block.action === "CHECK_FOOD")
        let newFood = food
        let newScore = gameState.score

        if (checkFoodBlock && head.x === food.x && head.y === food.y) {
          // Generate new food position
          let foodX, foodY
          do {
            foodX = Math.floor(Math.random() * gridSize)
            foodY = Math.floor(Math.random() * gridSize)
            // Make sure food doesn't spawn on snake
          } while (newSnake.some((segment) => segment.x === foodX && segment.y === foodY))

          newFood = { x: foodX, y: foodY }
          newScore += 1
          setMessage(`Score: ${newScore}`)

          // Check if "Grow snake" block exists
          const growSnakeBlock = blocks.find((block) => block.action === "GROW_SNAKE")
          if (!growSnakeBlock) {
            // If no grow block, remove tail
            newSnake.pop()
          }
        } else {
          // Remove tail if no food eaten
          newSnake.pop()
        }

        // Update game state
        setGameState((prev) => ({
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
        }))
      }

      // Set up game loop with the speed from game state
      gameLoopRef.current = setInterval(updateGame, gameState.speed)

      // Draw game
      const drawGame = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const { snake, food, gridSize, boardSize } = gameState
        const cellSize = boardSize / gridSize

        // Clear canvas
        ctx.clearRect(0, 0, boardSize, boardSize)

        // Draw grid (optional)
        ctx.strokeStyle = "#E0E0E0"
        ctx.lineWidth = 0.5
        for (let i = 0; i <= gridSize; i++) {
          ctx.beginPath()
          ctx.moveTo(i * cellSize, 0)
          ctx.lineTo(i * cellSize, boardSize)
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(0, i * cellSize)
          ctx.lineTo(boardSize, i * cellSize)
          ctx.stroke()
        }

        // Draw food
        ctx.fillStyle = foodColor
        ctx.beginPath()
        ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, cellSize / 2, 0, Math.PI * 2)
        ctx.fill()

        // Draw snake
        snake.forEach((segment, index) => {
          ctx.fillStyle = index === 0 ? snakeColor : `${snakeColor}CC` // Head is full opacity, body is slightly transparent
          ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize)

          // Add eyes to head
          if (index === 0) {
            ctx.fillStyle = "white"
            const eyeSize = cellSize / 5
            const eyeOffset = cellSize / 3

            // Position eyes based on direction
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY

            switch (gameState.direction) {
              case "UP":
                leftEyeX = segment.x * cellSize + eyeOffset
                leftEyeY = segment.y * cellSize + eyeOffset
                rightEyeX = segment.x * cellSize + cellSize - eyeOffset - eyeSize
                rightEyeY = segment.y * cellSize + eyeOffset
                break
              case "DOWN":
                leftEyeX = segment.x * cellSize + eyeOffset
                leftEyeY = segment.y * cellSize + cellSize - eyeOffset - eyeSize
                rightEyeX = segment.x * cellSize + cellSize - eyeOffset - eyeSize
                rightEyeY = segment.y * cellSize + cellSize - eyeOffset - eyeSize
                break
              case "LEFT":
                leftEyeX = segment.x * cellSize + eyeOffset
                leftEyeY = segment.y * cellSize + eyeOffset
                rightEyeX = segment.x * cellSize + eyeOffset
                rightEyeY = segment.y * cellSize + cellSize - eyeOffset - eyeSize
                break
              case "RIGHT":
                leftEyeX = segment.x * cellSize + cellSize - eyeOffset - eyeSize
                leftEyeY = segment.y * cellSize + eyeOffset
                rightEyeX = segment.x * cellSize + cellSize - eyeOffset - eyeSize
                rightEyeY = segment.y * cellSize + cellSize - eyeOffset - eyeSize
                break
              default:
                leftEyeX = segment.x * cellSize + eyeOffset
                leftEyeY = segment.y * cellSize + eyeOffset
                rightEyeX = segment.x * cellSize + cellSize - eyeOffset - eyeSize
                rightEyeY = segment.y * cellSize + eyeOffset
            }

            ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize)
            ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize)
          }
        })

        // Draw game over screen
        if (gameState.gameOver) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
          ctx.fillRect(0, 0, boardSize, boardSize)

          ctx.fillStyle = "white"
          ctx.font = "30px Arial"
          ctx.textAlign = "center"
          ctx.fillText("GAME OVER", boardSize / 2, boardSize / 2 - 30)

          ctx.font = "20px Arial"
          ctx.fillText(`Score: ${gameState.score}`, boardSize / 2, boardSize / 2 + 10)
          ctx.fillText("Press Play to restart", boardSize / 2, boardSize / 2 + 40)
        }

        requestAnimationFrame(drawGame)
      }

      drawGame()

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current)
        }
      }
    }
  }, [isPlaying, gameState, blocks, snakeColor, foodColor, setGameState])

  // Reset message when game restarts
  useEffect(() => {
    if (isPlaying && !gameState.gameOver) {
      setMessage("Use arrow keys to move")
    }
  }, [isPlaying, gameState.gameOver])

  return (
    <div className="w-full md:w-1/2 bg-gray-700 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white">Game Preview</h2>

      <div className="relative flex-1 bg-white rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
        {!isPlaying ? (
          <div className="text-gray-800 text-center">
            <p className="text-xl mb-2">Snake Game</p>
            <p>Click "Play" to start the game</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-xl font-semibold text-gray-800">{message || `Score: ${gameState.score}`}</div>
            <canvas
              ref={canvasRef}
              width={gameState.boardSize}
              height={gameState.boardSize}
              className="border border-gray-300 shadow-lg"
            />
          </>
        )}
      </div>

      <div className="mt-4 bg-gray-800 rounded-lg p-3">
        <h3 className="text-white font-medium mb-2">Ko'rsatmalar:</h3>
        <ul className="text-gray-300 text-sm space-y-1">
         
357 / 5 000
<li>• Bloklarni palitradan ish maydoniga torting</li> 
<li>• Oʻyiningizni sinab koʻrish uchun “Oʻynash” tugmasini bosing</li> 
<li>• Majburiy bloklar: "Klaviaturani bosish", "Yo'nalishni o'zgartirish" va "Ilonni siljitish"</li> 
<li>• Ilonni boshqarish uchun strelka tugmalaridan foydalaning</li> 
<li>• Oziq-ovqat iste'mol qilganda ilon o'sishi uchun "Oziq-ovqatlarni tekshirish" va "Ilon o'sishi" ni qo'shing</li>
        </ul>
      </div>
    </div>
  )
}
