import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { paths } from './pages/paths';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Searchresults from './pages/Searchresults';

function App() {
  return (
    <>
      <Header/>
      <Routes>

        <Route path={paths.Home} element={<Home />} />
        <Route path={paths.Profile} element={<Profile />} />
        <Route path={paths.Login} element={<Login />} />
        <Route path={paths.Registration} element={<Registration />} />
        <Route path={paths.Searchresults} element={<Searchresults/>} />
        <Route path='*' element={<NotFound/>}/>

      </Routes>
      <Footer/>
    </>
  );
}

export default App;
