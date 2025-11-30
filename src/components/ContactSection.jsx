import React from 'react'

export default function ContactSection(){
  return (
    <footer className="rounded-xl p-10 bg-gradient-to-r from-white/5 to-white/3 backdrop-blur shadow-inner">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-semibold">Contact</div>
            <div className="text-sm text-gray-500">Email: hello@softcode.ai</div>
          </div>
          <div className="flex gap-3">
            <a aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center" />
            <a aria-label="GitHub" className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center" />
            <a aria-label="Twitter" className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center" />
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" className="p-3 rounded-lg bg-white/10" />
          <input placeholder="Email" className="p-3 rounded-lg bg-white/10" />
          <textarea placeholder="Message" className="md:col-span-2 p-3 rounded-lg bg-white/10 h-28" />
          <div className="md:col-span-2">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-from to-primary-to text-white">Submit</button>
          </div>
        </form>

        
      </div>
    </footer>
  )
}
