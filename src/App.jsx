

import { useState } from 'react'
import './App.css'
import Logic from './component/Logic'
import Navbar from './component/Navbar'

function App() {
const [mode , setMode] = useState('light')
  return (
    <>
      <Navbar mode={mode} setMode={setMode}/>
      <Logic  />
    </>
  )
}

export default App
