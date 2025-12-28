import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function SignIn(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useUser()

  function handleSubmit(e){
    e.preventDefault()
    // Placeholder auth: accept any non-empty email/password
    if(!email.trim() || !password.trim()){
      alert('Please enter email and password')
      return
    }
    // In a real app authenticate here. For now set a mock user and token
    const mockUser = { email }
    const mockToken = 'mock-token-' + Date.now()
    // call login
    login(mockUser, mockToken)
    navigate('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border rounded" />
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-primary-from to-primary-to text-white">Sign In</button>
            <Link to="/signup" className="text-sm text-primary-from hover:underline">Create account</Link>
          </div>
          <div className="pt-2">
            <button type="button" onClick={()=>{ try{ sessionStorage.setItem('softcode_guest_notice_needed','1') }catch(e){}; login({ name: 'Guest' }, 'guest-token', { persist: false, guest: true }); navigate('/chat', { state: { showGuestNotice:true } }) }} className="w-full text-left text-sm text-gray-600 hover:underline">I'll do it later</button>
          </div>
        </form>
      </div>
    </div>
  )
}
