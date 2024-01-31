import { BrowserRouter, Routes, Route } from "react-router-dom"
import JoinForm from './components/JoinForm'
import MainEngine from './components/mainEngine'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<JoinForm />} />
        <Route path='/:code' element={<MainEngine />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App