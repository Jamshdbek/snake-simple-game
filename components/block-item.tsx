"use client"

import { useDrag } from "react-dnd"
import { type Block, CategoryType } from "@/lib/types"

interface BlockItemProps {
  block: Block
  onAddBlock?: (block: Block) => void
  isWorkspace?: boolean
  onRemove?: () => void
  index?: number
}

export default function BlockItem({ block, onAddBlock, isWorkspace = false, onRemove, index }: BlockItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BLOCK",
    item: { block, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case CategoryType.EVENTS:
        return "bg-yellow-500"
      case CategoryType.MOVEMENT:
        return "bg-blue-500"
      case CategoryType.LOGIC:
        return "bg-green-500"
      case CategoryType.CUSTOM:
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleClick = () => {
    if (!isWorkspace && onAddBlock) {
      onAddBlock(block)
    }
  }

  return (
    <div
      ref={drag}
      className={`${getCategoryColor(block.category)} p-3 rounded-lg cursor-grab shadow-sm 
        ${isDragging ? "opacity-50" : "opacity-100"}
        ${isWorkspace ? "mb-1 relative" : ""}
      `}
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-white">{block.label}</span>

        {isWorkspace && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="text-white hover:text-red-200 ml-2"
          >
            ✕
          </button>
        )}
      </div>

      {block.params.length > 0 && (
        <div className="mt-1 space-y-1">
          {block.params.map((param, i) => (
            <div key={i} className="flex items-center gap-1 text-sm">
              <span className="text-white">{param.name}:</span>
              <input
                type={param.type === "number" ? "number" : "text"}
                value={param.value}
                onChange={(e) => {
                  // In a real implementation, we would update the param value here
                  // This is simplified for the example
                }}
                className="bg-white/20 text-white rounded px-1 w-20 text-center"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
