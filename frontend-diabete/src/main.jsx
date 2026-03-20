import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DiabetesPrediction from './DiabetesPrediction.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DiabetesPrediction/>
  </StrictMode>,
)
