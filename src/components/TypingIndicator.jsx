import React from 'react'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-from to-primary-to text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
        AI
      </div>
      <div className="max-w-[75%]">
        <div className="bubble-ai rounded-2xl rounded-tl-sm p-4">
          <div className="flex gap-1 items-center">
            <div className="typing-dot"></div>
            <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

