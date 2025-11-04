import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Cat from './pages/cat';
import Car from './pages/car';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cat" element={<Cat />} />
        <Route path="/car" element={<Car />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;