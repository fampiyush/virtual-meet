import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ContextProvider } from './helpers/contextProvider.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ContextProvider>
    <App />
  </ContextProvider>
  // </React.StrictMode>,
)
