import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function SignUp(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useUser()

  function handleSubmit(e){
    e.preventDefault()
    if(!name.trim() || !email.trim() || !password.trim()){
      alert('Please complete all fields')
      return
    }
    // Placeholder: account "created". Navigate to /chat
    const mockUser = { name, email }
    const mockToken = 'mock-token-' + Date.now()
    login(mockUser, mockToken)
    navigate('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 border rounded" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border rounded" />
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-primary-from to-primary-to text-white">Create account</button>
            <Link to="/signin" className="text-sm text-primary-from hover:underline">Have an account? Sign in</Link>
          </div>
          <div className="pt-2">
            <button type="button" onClick={()=>{ login({ name: 'Guest' }, 'guest-token'); navigate('/chat') }} className="w-full text-left text-sm text-gray-600 hover:underline">I'll do it later</button>
          </div>
        </form>
      </div>
    </div>
  )
}
