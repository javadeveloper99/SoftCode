import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('softcode_user')
      if(raw){
        const parsed = JSON.parse(raw)
        setUser(parsed.user)
        setToken(parsed.token)
      }
    }catch(e){/* ignore */}
    // expose a small global bridge so SignIn/SignUp (which avoid direct import) can call login
    window.__softcode_login = (u, t) => login(u, t)
    window.__softcode_logout = () => logout()
    return ()=>{
      try{ delete window.__softcode_login; delete window.__softcode_logout }catch(e){}
    }
  }, [])

  function login(userInfo, tokenVal){
    setUser(userInfo)
    setToken(tokenVal)
    try{ localStorage.setItem('softcode_user', JSON.stringify({ user: userInfo, token: tokenVal })) }catch(e){}
  }

  function logout(){
    setUser(null)
    setToken(null)
    try{ localStorage.removeItem('softcode_user') }catch(e){}
  }

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(){
  return useContext(UserContext)
}

export default UserContext
