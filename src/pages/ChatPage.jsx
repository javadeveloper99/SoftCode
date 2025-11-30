import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ChatPage(){
  const location = useLocation()
  const navigate = useNavigate()
  const initial = location.state && location.state.initialMessage ? String(location.state.initialMessage) : ''
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState(initial)
  const bottomRef = useRef(null)

  useEffect(()=>{
    if(initial){
      const t = setTimeout(()=>{ handleSend(initial) }, 250)
      return ()=>clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSend(text){
    const msg = String(text || input || '').trim()
    if(!msg) return
    setMessages(m=>[...m, {sender:'user', text: msg}])
    setInput('')
    setTimeout(()=>{
      setMessages(m=>[...m, {sender:'ai', text: `Thanks — I received: "${msg}". I can review it or suggest improvements.`}])
      bottomRef.current?.scrollIntoView({behavior:'smooth'})
    }, 700)
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(()=>{
    function onProfileOpen(){
      setMenuOpen(false)
    }
    window.addEventListener('profile-menu-opened', onProfileOpen)
    return ()=> window.removeEventListener('profile-menu-opened', onProfileOpen)
  }, [])

  return (
    <div className="min-h-screen w-full bg-slate-50">

      {/* Top bar (fixed) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/40 backdrop-blur border-b border-slate-100 z-50">
        <div className="max-w-[100vw] mx-auto h-full flex items-center px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3" role="img" aria-label="SoftCode logo">
              <div className="w-9 h-9 rounded-md bg-gradient-to-tr from-primary-from to-primary-to text-white flex items-center justify-center font-bold">SC</div>
              <span className="hidden sm:inline font-semibold">SoftCode</span>
            </div>
            {!sidebarOpen && (
              <div className="hidden md:flex items-center gap-2 ml-3">
                <button title="New Chat" aria-label="New Chat" onClick={()=>{ /* optionally open new chat */ }} className="p-2 rounded-md hover:bg-slate-100">📝</button>
                <button title="Search Chat" aria-label="Search Chat" onClick={()=>{ /* optionally open search */ }} className="p-2 rounded-md hover:bg-slate-100">🔍</button>
                <button title="Projects" aria-label="Projects" onClick={()=>{ /* optionally open projects */ }} className="p-2 rounded-md hover:bg-slate-100">📁</button>
              </div>
            )}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3 mr-16">
            <button title="Add People" className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/20 hover:shadow-md text-sm font-medium transition-all duration-150">Add People</button>
            <button title="Share" className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/20 hover:shadow-md text-sm font-medium transition-all duration-150">Share</button>

            <div className="relative">
              <button title="More" onClick={()=>setMenuOpen(v=>!v)} className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/20 hover:shadow-md text-sm font-medium transition-all duration-150">⋮</button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border">
                  <ul>
                    <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50">Pin</button></li>
                    <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50">Delete</button></li>
                    <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50">Archive</button></li>
                    <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50">Report</button></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Profile menu is rendered globally in App.jsx (fixed top-right). */}
          </div>
        </div>
      </header>

      {/* Content area */}
      <div className="pt-16 w-full h-[calc(100vh-4rem)] flex">

        {/* Sidebar (toggleable) - kept in DOM for smooth transitions */}
        <aside className={`w-[260px] bg-slate-50 border-r border-slate-100 p-4 hidden md:flex flex-col gap-4 ${sidebarOpen ? 'translate-x-0 relative' : '-translate-x-full absolute z-40 left-0 top-16 h-[calc(100vh-4rem)]'} transform transition-transform duration-300 ease-in-out`}>
          {/* hide button top-right inside sidebar */}
          <button aria-label="Hide sidebar" title="Hide sidebar" onClick={()=>setSidebarOpen(false)} className="absolute top-3 right-3 p-1 rounded-md hover:bg-slate-100">
            ◀
          </button>

          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3">📝 New Chat</button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3">🔍 Search Chat</button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3">📁 Projects</button>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-xs text-gray-400 mb-2">History</div>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3">💬 Chat with Alice <span className="ml-auto text-xs text-gray-400">2h</span></button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3">💬 Project Sync <span className="ml-auto text-xs text-gray-400">1d</span></button>
              </div>
            </div>
          </div>
        </aside>

        {/* small tab to open sidebar when it's hidden */}
        <button aria-label="Open sidebar" title="Show sidebar" onClick={()=>setSidebarOpen(true)} className={`${sidebarOpen ? 'hidden' : 'md:flex'} fixed left-0 top-20 z-50 h-10 w-8 rounded-r-full bg-white/10 hover:bg-white/20 items-center justify-center transition-all` }>
          ▶
        </button>

        {/* Chat Window */}
        <section className="flex-1 h-full w-full flex flex-col">
          <div className="flex-1 overflow-y-auto" style={{padding:'24px'}}>
            {messages.length === 0 && (
              <div className="text-center text-gray-500">No messages yet. Type below to start the conversation.</div>
            )}

            <div className="space-y-4 max-w-2xl mx-auto">
              {messages.map((m, idx)=> (
                <div key={idx} className={m.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={`p-3 rounded-2xl ${m.sender === 'user' ? 'bubble-user' : 'bubble-ai'} max-w-[60%] text-sm`}>{m.text}</div>
                </div>
              ))}
            </div>

            <div ref={bottomRef} />
          </div>

          {/* Input pinned bottom */}
          <div className="border-t border-slate-100 p-4 bg-white/0">
            <div className="max-w-2xl mx-auto w-full" style={{padding:'0 24px'}}>
              <form onSubmit={(e)=>{ e.preventDefault(); handleSend(); }} className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <input value={input} onChange={e=>setInput(e.target.value)} className="chat-input w-full rounded-lg px-4 py-3" placeholder="Message..." />
                </div>
                <button type="submit" disabled={!String(input || '').trim()} className="send-btn">Send</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
