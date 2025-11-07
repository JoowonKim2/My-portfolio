import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Cat from './pages/cat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cat" element={<Cat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;