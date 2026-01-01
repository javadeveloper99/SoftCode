import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { loadConversations, saveConversations, makeConversation } from '../lib/chatStorage'
import MessageBubble from '../components/MessageBubble'
import MessageSkeleton from '../components/MessageSkeleton'
import TypingIndicator from '../components/TypingIndicator'

export default function ChatPage(){
  const location = useLocation()
  const navigate = useNavigate()
  const initial = location.state && location.state.initialMessage ? String(location.state.initialMessage) : ''
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState(initial)
  const [conversations, setConversations] = useState([])
  const [currentConvId, setCurrentConvId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState(null)
  const [showRestoredNotice, setShowRestoredNotice] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showJumpToBottom, setShowJumpToBottom] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const messagesContainerRef = useRef(null)

  useEffect(()=>{
    // Listen for chat restoration event
    const handleRestored = () => {
      setShowRestoredNotice(true)
      setTimeout(() => setShowRestoredNotice(false), 4000)
    }
    window.addEventListener('chat-restored', handleRestored)

    // Check if we should show restoration notice (check sessionStorage directly)
    try {
      const sessionData = sessionStorage.getItem('softcode_conversations_session_v1')
      const restoredShown = sessionStorage.getItem('softcode_restored_notice_shown')
      if(sessionData && !restoredShown && JSON.parse(sessionData).length > 0){
        // Will be triggered by loadConversations, but set up listener first
      }
    } catch(e) {}

    // load conversations from storage
    const convs = loadConversations()
    if(convs && convs.length){
      setConversations(convs)
      // if an initial message arrived, start a new conversation
      if(initial){
        const nc = makeConversation('New chat')
        nc.messages.push({sender:'user', text: initial, createdAt: Date.now()})
        const newConvs = [nc, ...convs]
        setConversations(newConvs)
        setCurrentConvId(nc.id)
        saveConversations(newConvs)
        const t = setTimeout(()=>{ handleSend(initial) }, 250)
        return ()=>{
          clearTimeout(t)
          window.removeEventListener('chat-restored', handleRestored)
        }
      }else{
        setCurrentConvId(convs[0].id)
      }
    }else{
      // no conversations, create one if initial or empty
      if(initial){
        const nc = makeConversation('New chat')
        nc.messages.push({sender:'user', text: initial, createdAt: Date.now()})
        setConversations([nc])
        setCurrentConvId(nc.id)
        saveConversations([nc])
        const t = setTimeout(()=>{ handleSend(initial) }, 250)
        return ()=>{
          clearTimeout(t)
          window.removeEventListener('chat-restored', handleRestored)
        }
      }else{
        const nc = makeConversation('New chat')
        setConversations([nc])
        setCurrentConvId(nc.id)
        saveConversations([nc])
      }
    }
    return () => window.removeEventListener('chat-restored', handleRestored)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-focus input on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [currentConvId])

  // Scroll to bottom on new messages
  useEffect(() => {
    const currentConv = conversations.find(c => c.id === currentConvId)
    if(currentConv && currentConv.messages.length > 0){
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [conversations, currentConvId])

  // Detect scroll position for "Jump to bottom" button
  useEffect(() => {
    const container = messagesContainerRef.current
    if(!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200
      setShowJumpToBottom(!isNearBottom && scrollHeight > clientHeight)
    }

    // Check initial state after a brief delay
    const checkTimer = setTimeout(() => handleScroll(), 100)
    
    container.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(checkTimer)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [conversations, currentConvId, streamingMessage])

  function handleSend(text){
    const msg = String(text || input || '').trim()
    if(!msg) return
    
    // Instant message send - add user message immediately
    const userMessage = { sender:'user', text: msg, createdAt: Date.now(), id: Date.now().toString() }
    
    setConversations(prev=>{
      const next = prev.map(c=>{
        if(c.id !== currentConvId) return c
        return { ...c, messages: [...c.messages, userMessage] }
      })
      saveConversations(next)
      return next
    })
    
    // Clear input and reset textarea immediately
    setInput('')
    if(inputRef.current){
      inputRef.current.style.height = '48px'
    }
    
    // Focus input immediately for instant feel
    setTimeout(() => inputRef.current?.focus(), 0)
    
    // Scroll to bottom immediately
    setTimeout(() => scrollToBottom(), 0)
    
    // Show typing indicator
    setIsTyping(true)
    setIsLoading(true)
    
    // Simulate AI response with streaming
    setTimeout(() => {
      simulateStreamingResponse(msg)
    }, 300)
  }

  function simulateStreamingResponse(userMsg){
    // Simulate occasional failures for testing (5% chance - comment out for production)
    // const shouldFail = Math.random() < 0.05
    const shouldFail = false // Disabled by default
    
    if(shouldFail){
      // Simulate failure
      setIsTyping(false)
      setIsLoading(false)
      setConversations(prev=>{
        const next = prev.map(c=>{
          if(c.id !== currentConvId) return c
          const lastMessage = c.messages[c.messages.length - 1]
          if(lastMessage && lastMessage.sender === 'user'){
            const newMessages = [...c.messages]
            newMessages[newMessages.length - 1] = { ...lastMessage, error: true }
            return { ...c, messages: newMessages }
          }
          return c
        })
        saveConversations(next)
        return next
      })
      return
    }
    
    const fullResponse = `Thanks — I received: "${userMsg}". I can review it or suggest improvements.`
    const words = fullResponse.split(' ')
    let currentText = ''
    let wordIndex = 0
    
    setIsTyping(false)
    setStreamingMessage({ sender: 'ai', text: '', createdAt: Date.now(), id: Date.now().toString() })
    
    const streamInterval = setInterval(() => {
      if(wordIndex < words.length){
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex]
        setStreamingMessage(prev => ({ ...prev, text: currentText }))
        wordIndex++
        
        // Scroll to bottom as we stream
        setTimeout(() => scrollToBottom(), 0)
      } else {
        clearInterval(streamInterval)
        // Add final message to conversation
        setConversations(prev=>{
          const next = prev.map(c=>{
            if(c.id !== currentConvId) return c
            return { ...c, messages: [...c.messages, { sender:'ai', text: currentText, createdAt: Date.now(), id: Date.now().toString() }] }
          })
          saveConversations(next)
          return next
        })
        setStreamingMessage(null)
        setIsLoading(false)
        setTimeout(() => scrollToBottom(), 100)
      }
    }, 50) // 50ms per word for smooth streaming
  }

  function scrollToBottom(smooth = true){
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  function handleRetryMessage(messageId){
    // Find the failed message and retry
    const conv = conversations.find(c => c.id === currentConvId)
    if(!conv) return
    
    const messageIndex = conv.messages.findIndex(m => m.id === messageId)
    if(messageIndex === -1) return
    
    const failedMessage = conv.messages[messageIndex]
    if(failedMessage.sender !== 'user') return
    
    // Remove error state and retry
    setConversations(prev=>{
      const next = prev.map(c=>{
        if(c.id !== currentConvId) return c
        const newMessages = [...c.messages]
        // Remove the failed message
        newMessages.splice(messageIndex, 1)
        return { ...c, messages: newMessages }
      })
      saveConversations(next)
      return next
    })
    
    // Retry sending
    handleSend(failedMessage.text)
  }

  function handleClearChat(){
    if(!showClearConfirm){
      setShowClearConfirm(true)
      return
    }
    // Clear current conversation
    setConversations(prev=>{
      const next = prev.map(c=>{
        if(c.id !== currentConvId) return c
        return { ...c, messages: [] }
      })
      saveConversations(next)
      return next
    })
    setShowClearConfirm(false)
    inputRef.current?.focus()
  }

  function handleNewChat(){
    const nc = makeConversation('New chat')
    setConversations(prev => [nc, ...prev])
    setCurrentConvId(nc.id)
    saveConversations([nc, ...conversations])
    inputRef.current?.focus()
  }

  // Check if input is empty (trimmed)
  const isInputEmpty = !String(input || '').trim()

  function formatTime(ts){
    if(!ts) return ''
    const d = new Date(ts)
    return d.toLocaleString()
  }

  function renameConversation(id){
    const title = window.prompt('Conversation title:')
    if(!title) return
    setConversations(prev=>{
      const next = prev.map(c=> c.id === id ? { ...c, title } : c)
      saveConversations(next)
      return next
    })
  }

  function deleteConversation(id){
    if(!window.confirm('Delete this conversation?')) return
    setConversations(prev=>{
      const next = prev.filter(c=>c.id !== id)
      saveConversations(next)
      if(next.length) setCurrentConvId(next[0].id)
      else{
        const nc = makeConversation('New chat')
        setCurrentConvId(nc.id)
        const nnext = [nc]
        saveConversations(nnext)
        return nnext
      }
      return next
    })
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useUser()
  const [guestMenuOpen, setGuestMenuOpen] = useState(false)
  const [guestNoticeVisible, setGuestNoticeVisible] = useState(false)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close modals with Esc
      if(e.key === 'Escape'){
        if(showClearConfirm) setShowClearConfirm(false)
        if(menuOpen) setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showClearConfirm, menuOpen])

  // Focus trap for clear confirmation modal
  useEffect(() => {
    if(!showClearConfirm) return
    
    const modal = document.querySelector('[role="dialog"]')
    if(!modal) return
    
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleTab = (e) => {
      if(e.key !== 'Tab') return
      
      if(e.shiftKey) {
        if(document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if(document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    firstElement?.focus()
    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [showClearConfirm])
  

  useEffect(()=>{
    function onProfileOpen(){
      setMenuOpen(false)
    }
    window.addEventListener('profile-menu-opened', onProfileOpen)

    // show temporary guest notice when navigating here after guest choice
    try{
      const needed = (location && location.state && location.state.showGuestNotice) || sessionStorage.getItem('softcode_guest_notice_needed') === '1'
      const shown = sessionStorage.getItem('softcode_guest_notice_shown') === '1'
      if(needed && !shown){
        setGuestNoticeVisible(true)
        const t = setTimeout(()=>{
          setGuestNoticeVisible(false)
          try{ sessionStorage.setItem('softcode_guest_notice_shown','1'); sessionStorage.removeItem('softcode_guest_notice_needed') }catch(e){}
        }, 3000)
        return ()=>clearTimeout(t)
      }
    }catch(e){}
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

            {/* Language selector moved here (exchanged with guest placement) */}
            <select aria-label="Language" className="bg-transparent text-sm text-gray-700 p-2 rounded-l">
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="hi">HI</option>
            </select>

            

            {/* Profile menu is rendered globally in App.jsx (fixed top-right). */}
          </div>
        </div>
      </header>

      {/* Guest informational popup (auto-dismiss, non-blocking) */}
      {guestNoticeVisible && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-60">
          <div role="status" aria-live="polite" className="bg-black/60 text-white text-sm px-4 py-2 rounded-md backdrop-blur-sm shadow-md opacity-95 flex items-center gap-3">
            <span>For a better experience and to save your chat history, please log in or sign up.</span>
            <Link to="/signup" className="underline text-white/90 ml-2">Sign up</Link>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="pt-16 w-full h-[calc(100vh-4rem)] flex">

        {/* Sidebar (toggleable) - kept in DOM for smooth transitions */}
        <aside className={`w-[260px] bg-slate-50 border-r border-slate-100 p-4 hidden md:flex flex-col gap-4 ${sidebarOpen ? 'translate-x-0 relative' : '-translate-x-full absolute z-40 left-0 top-16 h-[calc(100vh-4rem)]'} transform transition-transform duration-300 ease-in-out`}>
          {/* hide button top-right inside sidebar */}
          <button aria-label="Hide sidebar" title="Hide sidebar" onClick={()=>setSidebarOpen(false)} className="absolute top-3 right-3 p-1 rounded-md hover:bg-slate-100">
            ◀
          </button>

          <div className="space-y-2">
            <button 
              onClick={handleNewChat}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3"
              aria-label="New Chat"
            >
              📝 New Chat
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3">🔍 Search Chat</button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-3">📁 Projects</button>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-xs text-gray-400 mb-2">History</div>
              <div className="space-y-2">
                {conversations.map(c => (
                  <div key={c.id} className={`flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 ${c.id === currentConvId ? 'bg-slate-100' : ''}`}>
                    <button onClick={()=>setCurrentConvId(c.id)} className="flex-1 text-left">
                      💬 {c.title} <div className="text-xs text-gray-400">{formatTime(c.createdAt)}</div>
                    </button>
                    <button title="Rename" onClick={()=>renameConversation(c.id)} className="p-1 text-sm">✏️</button>
                    <button title="Delete" onClick={()=>deleteConversation(c.id)} className="p-1 text-sm">🗑️</button>
                  </div>
                ))}
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
          {/* Chat toolbar (top-right of chat area) */}
          <div className="absolute right-6 top-20 z-40 flex items-center gap-2">
            {conversations.find(c=>c.id === currentConvId)?.messages?.length > 0 && (
              <>
                <button 
                  title="Start new chat" 
                  onClick={handleNewChat}
                  className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/20 text-sm"
                  aria-label="Start new chat"
                >
                  New Chat
                </button>
                <button 
                  title="Clear current chat" 
                  onClick={handleClearChat}
                  className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/20 text-sm"
                  aria-label="Clear current chat"
                >
                  Clear
                </button>
              </>
            )}
            {conversations.find(c=>c.id === currentConvId)?.messages?.length > 0 && (
              <div className="relative">
                <button 
                  title="Chat options" 
                  onClick={()=>setMenuOpen(v=>!v)}
                  className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/20"
                  aria-label="Chat options"
                  aria-expanded={menuOpen}
                >
                  ⚙
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
                    <ul>
                      <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Pin</button></li>
                      <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Archive</button></li>
                      <li><button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Report</button></li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Clear confirmation dialog */}
          {showClearConfirm && (
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center" 
              onClick={() => setShowClearConfirm(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-dialog-title"
            >
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 id="clear-dialog-title" className="text-lg font-semibold mb-2">Clear this chat?</h3>
                <p className="text-gray-600 mb-4">This will remove all messages from the current conversation. This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleClearChat}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    aria-label="Confirm clear chat"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Restoration notice */}
          {showRestoredNotice && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-60">
              <div role="status" aria-live="polite" className="bg-green-500 text-white text-sm px-4 py-2 rounded-md backdrop-blur-sm shadow-md opacity-95 flex items-center gap-3">
                <span>✓ Chat restored from last session</span>
              </div>
            </div>
          )}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto relative" 
            style={{padding:'24px'}}
          >
            {(!conversations || conversations.length === 0) && (
              <div className="text-center text-gray-500">No conversations yet. Start by sending a message.</div>
            )}

            <div className="space-y-4 max-w-2xl mx-auto">
              {conversations.find(c=>c.id === currentConvId)?.messages.map((m, idx)=> (
                <MessageBubble 
                  key={m.id || idx} 
                  message={m} 
                  isUser={m.sender === 'user'}
                  onRetry={m.error ? () => handleRetryMessage(m.id) : undefined}
                />
              ))}
              {streamingMessage && (
                <MessageBubble 
                  key="streaming" 
                  message={streamingMessage} 
                  isUser={false}
                  isStreaming={true}
                />
              )}
              {isTyping && !streamingMessage && <TypingIndicator />}
              {isLoading && !isTyping && !streamingMessage && <MessageSkeleton />}
            </div>

            <div ref={bottomRef} />
            
            {/* Jump to bottom button */}
            {showJumpToBottom && (
              <button
                onClick={() => scrollToBottom()}
                className="fixed bottom-24 right-8 z-40 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
                aria-label="Jump to latest messages"
                title="Jump to latest"
              >
                <span>↓</span>
                <span>Latest</span>
              </button>
            )}
          </div>

          {/* Input pinned bottom */}
          <div className="border-t border-slate-100 p-4 bg-white/0">
            <div className="max-w-2xl mx-auto w-full" style={{padding:'0 24px'}}>
              <form 
                onSubmit={(e)=>{ 
                  e.preventDefault(); 
                  if(!isInputEmpty) handleSend(); 
                }} 
                className="flex items-center gap-3 w-full"
              >
                <div className="flex-1">
                  <textarea 
                    ref={inputRef}
                    value={input} 
                    onChange={e=>{
                      setInput(e.target.value)
                      // Auto-resize textarea
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
                    }}
                    onKeyDown={(e)=>{
                      if(e.key === 'Enter' && !e.shiftKey){
                        e.preventDefault()
                        if(!isInputEmpty) handleSend()
                      }
                    }}
                    className="chat-input w-full rounded-lg px-4 py-3 resize-none" 
                    placeholder="Message... (Shift+Enter for new line)"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '200px', overflowY: 'auto' }}
                    aria-label="Message input"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isInputEmpty} 
                  className="send-btn px-4 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  title={isInputEmpty ? "Type a message to send" : "Send message"}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
