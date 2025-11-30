import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ChatMockup from './components/ChatMockup'
import FeedbackModal from './components/FeedbackModal'
import Lottie from 'lottie-react'
import ChatPage from './pages/ChatPage'
import ProfileMenu from './components/ProfileMenu'

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
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/chat" element={<ChatPage/>} />
        </Routes>

        {/* Global profile menu fixed top-right so it's visible on every page */}
        <div className="fixed top-3 right-4 z-50">
          <ProfileMenu onFeedback={()=>setFeedbackOpen(true)} />
        </div>

        <FeedbackModal open={feedbackOpen} onClose={()=>setFeedbackOpen(false)} />
      </div>
    </BrowserRouter>
  )
}
