// Imports necessary functions from React for creating and using context.
import { createContext, useContext } from "react";
// Imports a custom hook called useAuth, presumably for authentication logic.
import { useAuth } from "../hooks/useAuth";

// Creates a context object using createContext. This object will be used to store and access authentication-related data.
const AuthContext = createContext();

// Defines a component called AuthProvider that will provide the authentication context to its children.
export function AuthProvider({ children }) {
  // Calls the useAuth hook to get the authentication data and functions.
  const auth = useAuth();
  // Returns a Provider component from the AuthContext.
  // The value prop of the Provider is set to the auth object, making it available to all consuming components.  This is how you share data across your application without prop drilling
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Defines a custom hook called useAuthContext that provides easy access to the AuthContext value.
export function useAuthContext() {
  // Uses the useContext hook to access the value of the AuthContext.  This is how you consume the data provided by the AuthContext
  // This hook can be used in any component nested within the AuthProvider to access the authentication data and functions.
  return useContext(AuthContext);
}
