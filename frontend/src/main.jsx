import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // <--- IMPORTANTE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- O App TEM QUE ESTAR DENTRO DISSO */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)