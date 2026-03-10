import { createContext, useContext, useEffect, useState } from "react"
import { auth, onAuthStateChanged, logOut } from "../lib/firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading, null = not signed in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading: user === undefined, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
