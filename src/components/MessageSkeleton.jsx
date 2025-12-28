import React from 'react'

export default function MessageSkeleton() {
  return (
    <div className="flex gap-2 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-from to-primary-to text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 animate-pulse bg-slate-200">
        AI
      </div>
      <div className="max-w-[75%]">
        <div className="bubble-ai rounded-2xl rounded-tl-sm p-4 space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    </div>
  )
}
