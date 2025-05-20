"use client"

import { useMemo } from "react"
import { BlockType, type Block, CategoryType } from "@/lib/types"
import BlockItem from "./block-item"

interface BlockPaletteProps {
  onAddBlock: (block: Block) => void
}

export default function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const categories = useMemo(
    () => [
      {
        name: "Events",
        color: "bg-yellow-500",
        blocks: [
          {
            type: BlockType.EVENT,
            category: CategoryType.EVENTS,
            label: "When game starts",
            action: "GAME_START",
            params: [],
          },
          {
            type: BlockType.EVENT,
            category: CategoryType.EVENTS,
            label: "Handle key press",
            action: "KEY_PRESS",
            params: [],
          },
        ],
      },
      {
        name: "Movement",
        color: "bg-blue-500",
        blocks: [
          {
            type: BlockType.ACTION,
            category: CategoryType.MOVEMENT,
            label: "Move snake",
            action: "MOVE_SNAKE",
            params: [],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.MOVEMENT,
            label: "Change direction",
            action: "CHANGE_DIRECTION",
            params: [],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.MOVEMENT,
            label: "Set speed",
            action: "SET_SPEED",
            params: [{ name: "speed", type: "number", value: 100 }],
          },
        ],
      },
      {
        name: "Game Logic",
        color: "bg-green-500",
        blocks: [
          {
            type: BlockType.ACTION,
            category: CategoryType.LOGIC,
            label: "Check food collision",
            action: "CHECK_FOOD",
            params: [],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.LOGIC,
            label: "Grow snake",
            action: "GROW_SNAKE",
            params: [],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.LOGIC,
            label: "Check wall collision",
            action: "CHECK_WALL",
            params: [],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.LOGIC,
            label: "Check self collision",
            action: "CHECK_SELF",
            params: [],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.LOGIC,
            label: "Game over",
            action: "GAME_OVER",
            params: [],
          },
        ],
      },
      {
        name: "Customization",
        color: "bg-purple-500",
        blocks: [
          {
            type: BlockType.ACTION,
            category: CategoryType.CUSTOM,
            label: "Set snake color",
            action: "SET_SNAKE_COLOR",
            params: [{ name: "color", type: "string", value: "#4CAF50" }],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.CUSTOM,
            label: "Set food color",
            action: "SET_FOOD_COLOR",
            params: [{ name: "color", type: "string", value: "#F44336" }],
          },
          {
            type: BlockType.ACTION,
            category: CategoryType.CUSTOM,
            label: "Set grid size",
            action: "SET_GRID_SIZE",
            params: [{ name: "size", type: "number", value: 20 }],
          },
        ],
      },
    ],
    [],
  )

  return (
    <div className="w-64 bg-gray-800 text-white overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Funksiya bloklar</h2>

        {categories.map((category) => (
          <div key={category.name} className="mb-6">
            <h3 className={`text-sm font-semibold mb-2 ${category.color} p-1 rounded`}>{category.name}</h3>
            <div className="space-y-2">
              {category.blocks.map((block, index) => (
                <BlockItem key={`${category.name}-${index}`} block={block} onAddBlock={onAddBlock} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
