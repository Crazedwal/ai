import { createContext, useContext, useEffect, useState } from "react"
import { auth, onAuthStateChanged, logOut } from "../lib/firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading, null = not signed in
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null)
      if (firebaseUser) setIsGuest(false) // signed in — clear guest flag
    })
    return unsubscribe
  }, [])

  const continueAsGuest = () => setIsGuest(true)

  return (
    <AuthContext.Provider value={{ user, loading: user === undefined, isGuest, continueAsGuest, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
