import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function GuestRoute({ children, redirectTo = '/' }){
  const { user } = useUser()
  if(user) return <Navigate to={redirectTo} replace />
  return children
}
