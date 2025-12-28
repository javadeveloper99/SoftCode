import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('softcode_user')
      if(raw){
        const parsed = JSON.parse(raw)
        setUser(parsed.user)
        setToken(parsed.token)
        setIsGuest(false)
        return
      }
      // if a guest was set in this session, restore transient guest state
      if(sessionStorage.getItem('softcode_guest') === '1'){
        setIsGuest(true)
        // keep user as minimal guest placeholder for convenience
        setUser({ name: 'Guest' })
      }
    }catch(e){/* ignore */}

    // expose a small global bridge so SignIn/SignUp (which avoid direct import) can call login
    window.__softcode_login = (u, t, opts) => login(u, t, opts)
    window.__softcode_logout = () => logout()
    return ()=>{
      try{ delete window.__softcode_login; delete window.__softcode_logout }catch(e){}
    }
  }, [])

  // login: options { persist: true|false, guest: true|false }
  function login(userInfo, tokenVal, options = { persist: true, guest: false }){
    const { persist = true, guest = false } = options || {}
    setUser(userInfo)
    setToken(tokenVal)
    setIsGuest(!!guest)
    try{
      if(persist && !guest){
        localStorage.setItem('softcode_user', JSON.stringify({ user: userInfo, token: tokenVal }))
      }else{
        // transient guest stored in session only
        if(guest) sessionStorage.setItem('softcode_guest','1')
      }
    }catch(e){}
  }

  function logout(){
    setUser(null)
    setToken(null)
    setIsGuest(false)
    try{ localStorage.removeItem('softcode_user'); sessionStorage.removeItem('softcode_guest') }catch(e){}
  }

  return (
    <UserContext.Provider value={{ user, token, isGuest, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(){
  return useContext(UserContext)
}

export default UserContext
