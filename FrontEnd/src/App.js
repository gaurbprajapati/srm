import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Templates from './pages/templates/Templates';
import './App.css';
import { ClubHome } from './components/Clubs/ClubHome';
import { CreateClub } from './components/Clubs/CreateClub';
// import { Sportsclub } from './components/Clubs/club/Sportsclub';
import { Clubs } from './components/Clubs/club/Clubs';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Templateshome from './pages/Templateshome';
import { JobHome } from './components/Jobs/JobHome';
import ErrorPage from './components/ErrorPage/ErrorPage';
import ResourceCard from './components/LearningPages/ResourceCard/ResourceCard';
import Resource from "./components/LearningPages/ResourceCard/Resource"

function App() {

  return (
    <section className='Appp'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute>< Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute>< Profile /></ProtectedRoute>} />
          <Route path="/templates/:id" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/templates" element={<Templateshome />} />
          <Route path="/clubs" element={<ClubHome />} />
          <Route path="/CreateClub" element={<CreateClub />} />
          <Route path="/Club/:id" element={<Clubs />} />
          <Route path="/jobs" element={<JobHome />} />
          <Route path="/learning" element={<ResourceCard />} />
          <Route path="/Resources" element={<Resource />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </section>
  );
}

export default App;

// ---->>> this is called protected Routes 
// this is protection used to make sure that user cannot able to visit home page without login or register 

export function ProtectedRoute(props) {
  if (localStorage.getItem("sheyresume-user")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}