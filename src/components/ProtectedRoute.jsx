import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function ProtectedRoute({ children, redirectTo = '/signin' }){
  const { user, isGuest } = useUser()
  if(!user && !isGuest) return <Navigate to={redirectTo} replace />
  return children
}
