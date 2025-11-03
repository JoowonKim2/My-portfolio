import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Cat from './pages/cat';  // 주석 해제

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cat" element={<Cat />} />  {/* 주석 해제 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;