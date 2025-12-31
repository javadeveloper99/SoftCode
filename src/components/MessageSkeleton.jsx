import React from 'react'

export default function MessageSkeleton() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-from to-primary-to text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
        AI
      </div>
      <div className="max-w-[75%]">
        <div className="bubble-ai rounded-2xl rounded-tl-sm p-4 space-y-2">
          <div className="skeleton-line h-4 w-3/4"></div>
          <div className="skeleton-line h-4 w-full"></div>
          <div className="skeleton-line h-4 w-5/6"></div>
          <div className="skeleton-line h-4 w-4/5 mt-2"></div>
        </div>
      </div>
    </div>
  )
}
