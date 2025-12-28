import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function ChatMockup(){
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()
  const { user, login } = useUser()

  function handleSend(){
    const trimmed = String(text || '').trim()
    if(!trimmed) return
    // if no user, make a transient guest so sending doesn't trigger auth flow
    if(!user){
      try{ sessionStorage.setItem('softcode_guest_notice_needed','1') }catch(e){}
      login({ name: 'Guest' }, 'guest-token', { persist: false, guest: true })
    }
    // Add message locally to mockup instead of immediately navigating
    setMessages(prev => [...prev, { from: 'user', text: trimmed }])
    setText('')
  }

  // If user explicitly wants the full chat page, they can use this button
  function openFullChat(){
    const initial = messages.length ? messages[messages.length - 1].text : text
    if(!initial) return navigate('/chat')
    // ensure guest mode if needed and signal chat page to show guest notice once
    if(!user){
      try{ sessionStorage.setItem('softcode_guest_notice_needed','1') }catch(e){}
      login({ name: 'Guest' }, 'guest-token', { persist: false, guest: true })
    }
    navigate('/chat', { state: { initialMessage: initial, showGuestNotice: !user } })
  }

  return (
    <motion.div initial={{scale:0.98,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.6}} className="rounded-chat p-6 bg-slate-50 shadow-soft">
      <div className="flex gap-4 items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-from to-primary-to flex items-center justify-center text-white font-bold">AI</div>
        <div>
          <div className="text-sm font-semibold">SoftCode Assistant</div>
          <div className="text-xs text-gray-500">Online • Responds contextually</div>
        </div>
      </div>

      <div className="h-72 overflow-y-auto p-3 space-y-4 bg-white/20 rounded-lg">
        <div className="max-w-[75%] bg-white/90 text-gray-900 p-3 rounded-lg shadow-sm">
          <div className="animate-typing">Hello! I can help review code, suggest architecture, and more.</div>
        </div>

        {messages.map((m, idx) => (
          m.from === 'user' ? (
            <div key={idx} className="flex justify-end">
              <div className="max-w-[70%] bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg shadow-lg">{m.text}</div>
            </div>
          ) : (
            <div key={idx} className="max-w-[75%] bg-white/90 text-gray-900 p-3 rounded-lg shadow-sm">{m.text}</div>
          )
        ))}

      </div>

      <div className="mt-4">
        <div className="rounded-lg p-2 bg-white shadow-sm flex items-center gap-3">
          <input value={text} onChange={e=>setText(e.target.value)} className="chat-input flex-1 py-3 text-base" placeholder="Type a message..." onKeyDown={e=>{ if(e.key === 'Enter') handleSend() }} />
          <button onClick={handleSend} className="send-btn px-4 py-3 text-base">Send</button>
          <button onClick={openFullChat} className="ml-2 text-sm text-primary-from hover:underline">Open full chat</button>
        </div>
      </div>
    </motion.div>
  )
}
