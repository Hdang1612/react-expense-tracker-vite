import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import Report from './page/Report'
import TransactionPage from './page/TransactionPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/transactions' element={<TransactionPage />} />
        <Route path='/statistics' element={<Report />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App