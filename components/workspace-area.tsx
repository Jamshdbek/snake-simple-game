"use client"
import { useDrop } from "react-dnd"
import BlockItem from "./block-item"
import type { Block } from "@/lib/types"

interface WorkspaceAreaProps {
  blocks: Block[]
  onRemoveBlock: (id: string) => void
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void
}

export default function WorkspaceArea({ blocks, onRemoveBlock, onMoveBlock }: WorkspaceAreaProps) {
  const [, drop] = useDrop(() => ({
    accept: "BLOCK",
    drop: () => ({ name: "Workspace" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  return (
    <div ref={drop} className="flex-1 bg-gray-200 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md p-4 min-h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Workspace</h2>

        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Drag blocks here to build your game</p>
          </div>
        ) : (
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <BlockItem
                key={block.id}
                block={block}
                isWorkspace={true}
                index={index}
                onRemove={() => onRemoveBlock(block.id as string)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
