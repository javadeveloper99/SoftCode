import React, { useState, useRef, useEffect } from 'react'

export default function ProfileMenu({ onFeedback }){
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(()=>{
    function onDoc(e){
      if(!ref.current) return
      if(!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return ()=>document.removeEventListener('click', onDoc)
  },[])

  useEffect(()=>{
    // notify other parts of the app when the profile menu opens
    if(open){
      try{
        window.dispatchEvent(new CustomEvent('profile-menu-opened'))
      }catch(e){ /* ignore */ }
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button aria-label="Open profile menu" title="Profile" onClick={()=>setOpen(v=>!v)} className="p-0 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary-from">
        <img src="https://ui-avatars.com/api/?name=SC&background=7c3aed&color=fff&rounded=true" alt="avatar" className="w-9 h-9 rounded-full border border-white/10" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50">
          <ul className="py-1">
            <li><a className="block px-4 py-2 text-sm hover:bg-gray-50" href="#">Your Profile</a></li>
            <li><a className="block px-4 py-2 text-sm hover:bg-gray-50" href="#">Upgrade Plan</a></li>
            <li><a className="block px-4 py-2 text-sm hover:bg-gray-50" href="#">Personalization</a></li>
            <li><a className="block px-4 py-2 text-sm hover:bg-gray-50" href="#">Settings</a></li>
            <li><a className="block px-4 py-2 text-sm hover:bg-gray-50" href="#">Help</a></li>
            <li><hr className="my-1"/></li>
            <li><button onClick={()=>{ setOpen(false); if(onFeedback) onFeedback() }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Give Feedback</button></li>
            <li><button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Profile Settings</button></li>
            <li><hr className="my-1"/></li>
            <li><button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Log Out</button></li>
          </ul>
        </div>
      )}
    </div>
  )
}
