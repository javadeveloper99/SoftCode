import React, { useState } from 'react'

export default function FeedbackModal({ open, onClose }){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  if(!open) return null

  function handleSubmit(e){
    e.preventDefault()
    // For now: just log and close. In real app, post to backend.
    console.log('Feedback submitted', { name, email, message })
    alert('Thanks for your feedback!')
    setName(''); setEmail(''); setMessage('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Give Feedback</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="p-3 rounded-lg border" />
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="p-3 rounded-lg border" />
          </div>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" className="w-full p-3 rounded-lg border h-28" />
          <div className="flex justify-end">
            <button type="submit" className="px-5 py-2 rounded-full bg-indigo-600 text-white">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}
