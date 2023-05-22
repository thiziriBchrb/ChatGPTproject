
import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from "./Login";
import { auth, database } from './firebase';
import Home from "./Home";
import Modal from "./modal";
import Sidebar from "./Sidebar";
import Profile from './Profile';
import Post from "./Post";
import Logout from "./Logout";
import SignUp  from "./SignUp";
import   MainPage from './mainPage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home/:userId" element={<Home/>} />
        <Route path="/bar" element={<Post/>} />

        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/logout" element= {<Logout/>} />
        <Route path="/signup" element= {<SignUp/>} />
        <Route path="/" element= {<MainPage/>} />

      </Routes>

    </Router>
  );
}

export default App;
