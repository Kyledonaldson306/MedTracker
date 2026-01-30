import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMedication from './pages/AddMedication';
import EditMedication from './pages/EditMedication';
import Schedule from './pages/Schedule';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMedication />} />
          <Route path="/edit/:id" element={<EditMedication />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;