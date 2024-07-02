import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { paths } from './pages/paths';

function App() {
  return (
    <>
      <header>
        <Link to={paths.Home}>Главная</Link>
        <Link to={paths.Profile}>Профиль</Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  );
}

export default App;
