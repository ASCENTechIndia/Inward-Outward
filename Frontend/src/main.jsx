import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoaderProvider } from './Context/LoaderContext.jsx'
import Spinner from './Components/Spinner.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoaderProvider>
      <AuthProvider>
        <Spinner />
      <App />
      </AuthProvider>
    </LoaderProvider>
  </StrictMode>,
)
   

