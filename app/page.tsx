"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import BlockPalette from "@/components/block-palette"
import WorkspaceArea from "@/components/workspace-area"
import GamePreview from "@/components/game-preview"
import type { Block } from "@/lib/types"

export default function SnakeEditor() {
  const [workspace, setWorkspace] = useState<Block[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  // Game state for preview
  const [gameState, setGameState] = useState({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: "RIGHT",
    speed: 100,
    score: 0,
    gameOver: false,
    gridSize: 20,
    boardSize: 400,
  })

  const handleAddBlock = (block: Block) => {
    setWorkspace([...workspace, { ...block, id: `block-${Date.now()}` }])
  }

  const handleRemoveBlock = (id: string) => {
    setWorkspace(workspace.filter((block) => block.id !== id))
  }

  const handleMoveBlock = (dragIndex: number, hoverIndex: number) => {
    const newWorkspace = [...workspace]
    const draggedBlock = newWorkspace[dragIndex]
    newWorkspace.splice(dragIndex, 1)
    newWorkspace.splice(hoverIndex, 0, draggedBlock)
    setWorkspace(newWorkspace)
  }

  const handlePlay = () => {
    // Reset game state
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: { x: 5, y: 5 },
      direction: "RIGHT",
      speed: 100,
      score: 0,
      gameOver: false,
      gridSize: 20,
      boardSize: 400,
    })
    setIsPlaying(true)
  }

  const handleStop = () => {
    setIsPlaying(false)
  }

  // Apply initial settings from blocks
  useEffect(() => {
    if (isPlaying) {
      const newState = { ...gameState }

      workspace.forEach((block) => {
        if (block.action === "SET_SPEED" && block.params[0]) {
          newState.speed = Number(block.params[0].value)
        }
        if (block.action === "SET_GRID_SIZE" && block.params[0]) {
          newState.gridSize = Number(block.params[0].value)
        }
      })

      setGameState(newState)
    }
  }, [isPlaying, workspace])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-green-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Snake Scratch o'yin</h1>
            <div className="flex gap-2 items-center">
              <div className="text-sm mr-4 bg-green-800 p-1 px-2 rounded">
                <span className="font-bold">Eslatma:</span>Ilonni boshqarish uchun "Handle key press" tugmachasini qo'shing!
              </div>
              <button
                onClick={handlePlay}
                disabled={isPlaying && !gameState.gameOver}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {gameState.gameOver ? "Tozalash" : "Play"}
              </button>
              <button
                onClick={handleStop}
                disabled={!isPlaying}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                To'xtatish
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <BlockPalette onAddBlock={handleAddBlock} />

          <div className="flex flex-col md:flex-row flex-1">
            <WorkspaceArea blocks={workspace} onRemoveBlock={handleRemoveBlock} onMoveBlock={handleMoveBlock} />

            <GamePreview isPlaying={isPlaying} blocks={workspace} gameState={gameState} setGameState={setGameState} />
          </div>
        </main>
      </div>
    </DndProvider>
  )
}
