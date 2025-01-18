import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Fib from './components/Fib'
import OtherPage from './components/OtherPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Fib/>}/>
        <Route path="/other-page" element={<OtherPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
