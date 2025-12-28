import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }){
  const [theme, setTheme] = useState(() => {
    try{ return localStorage.getItem('softcode_theme') || 'light' }catch(e){ return 'light' }
  })

  useEffect(()=>{
    try{ localStorage.setItem('softcode_theme', theme) }catch(e){}
    if(theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  function toggleTheme(){ setTheme(t => t === 'dark' ? 'light' : 'dark') }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(){ return useContext(ThemeContext) }

export default ThemeContext
