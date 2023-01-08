import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BFSVisualizer from './components/BFSVisualizer';
import Square from './components/Square';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<BFSVisualizer />} />
          <Route path='/square' element={<Square />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
