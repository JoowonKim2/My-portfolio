import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Cat from './pages/cat';
import Shiba from './pages/shiba';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cat" element={<Cat />} />
        <Route path="/shiba" element={<Shiba />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;