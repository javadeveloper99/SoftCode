import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ChatMockup from './components/ChatMockup'
import FeedbackModal from './components/FeedbackModal'
import Lottie from 'lottie-react'
import ChatPage from './pages/ChatPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
// ProfileMenu is not shown before sign-in; we keep the component in the repo for later use
import { UserProvider, useUser } from './context/UserContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'

function Home(){
  const [data, setData] = useState(null)

  useEffect(()=>{
    let mounted = true
    fetch('https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json')
      .then(r=>r.json())
      .then(j=>{ if(mounted) setData(j) })
      .catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-white to-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-20">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6}} className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-3">🤖 SoftCode AI Chat Assistant</h1>

            <div className="space-y-4">
              <ul className="space-y-3 text-lg">
                <li>• Context-aware responses</li>
                <li>• Code review</li>
                <li>• Architecture suggestions</li>
                <li>• Bug analysis</li>
                <li>• Documentation generation</li>
              </ul>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/chat" className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-from to-primary-to text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform">Let's Improve</Link>

              <div className="w-28 h-28 bg-white/10 rounded-xl glass p-3 flex items-center justify-center">
                {data ? (
                  <Lottie animationData={data} loop={true} style={{width:80,height:80}} />
                ) : (
                  <div className="text-xs text-gray-400">AI</div>
                )}
              </div>
            </div>

            
          </motion.div>

          <ChatMockup />
        </section>

        
      </main>
    </div>
  )
}

export default function App(){
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <UserProvider>
      <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage/></ProtectedRoute>} />
            <Route path="/signin" element={<GuestRoute><SignIn/></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><SignUp/></GuestRoute>} />
          </Routes>

          {/* Top-right actions (Sign In / Sign Up / Language) - shown before authentication */}
          <HeaderActions />

          <FeedbackModal open={feedbackOpen} onClose={()=>setFeedbackOpen(false)} />
        </div>
      </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  )
}

function HeaderActions(){
  const { user, logout } = useUser()
  const { theme, toggleTheme } = useTheme()
  if(user){
    // show simple profile area; exchange language place with guest button: if guest, show guest compact button here
    const isGuest = (user.name && user.name.toLowerCase() === 'guest') || (user.email && user.email.toLowerCase().includes('guest'))
    return (
      <div className="fixed top-3 right-4 z-50">
        <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 shadow-sm">
          {isGuest ? (
            // guest compact button (opens logout)
            <div className="relative">
              <button title="Guest" onClick={()=>{ const el = document.getElementById('guest-global-menu'); if(el) el.classList.toggle('hidden'); }} className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-sm font-medium">Guest</button>
              <div id="guest-global-menu" className="hidden absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border">
                <ul>
                  <li><button onClick={()=>{ document.getElementById('guest-global-menu').classList.add('hidden'); logout(); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Logout</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <select aria-label="Language" className="bg-transparent text-sm text-gray-700 p-2 rounded-l">
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="hi">HI</option>
              </select>
              <div className="px-3 py-1 text-sm">{user.name || user.email}</div>
              <button onClick={logout} className="px-3 py-1 rounded-full text-sm font-medium hover:bg-white/10">Logout</button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-3 right-4 z-50">
      <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 shadow-sm">
        <button onClick={toggleTheme} aria-label="Toggle theme" className="px-2 py-1 rounded-full hover:bg-white/10">{theme === 'dark' ? '🌙' : '☀️'}</button>
        <select aria-label="Language" className="bg-transparent text-sm text-gray-700 p-2 rounded-l">
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="hi">HI</option>
        </select>
        <Link to="/signin" className="px-3 py-1 rounded-full text-sm font-medium hover:bg-white/10">Sign In</Link>
        <Link to="/signup" className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-from to-primary-to text-white text-sm font-semibold">Sign Up</Link>
      </div>
    </div>
  )
}
