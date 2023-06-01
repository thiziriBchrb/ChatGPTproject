import React from "react";
import './mainPage.css';
import { BsEnvelope } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";
import {  BiComment } from 'react-icons/bi';
import { MdSearch, MdPerson} from 'react-icons/md';

import { MdPublic } from 'react-icons/md';

const MainPage = () => {

  const history = useNavigate();

  const handleLoginClick = () => {
    history("/login");

  };

  const handleSignUpClick = () => {
    history("/signup");
  };
  return (
    <section className="main-page">

      <div className="left">
        <div className="left-content">
        <div>

            <MdSearch size={20} />
            <h3 className="left-content-heading">Find your interests</h3>
          </div>
          <div>

            <BiComment  size={20}/>
            <h3 className="left-content-heading">
              Explore what people are talking about
            </h3>
          </div>
          <div>
          <MdPerson size={20} />
            <h3 className="left-content-heading">Join the people</h3>
          </div>

        </div>
      </div>
      {/* end of left */}
      {/* right */}
      <div className="right">

        <div className="middle-content">
          <i className="fas fa-dove"></i>
          <img src={require("./logo.png")}/>
          <h1 className="app-name">SpeakUp</h1>
          <h2> Unleash your voice, empower change</h2>

          <button type="button" className="sign-up" onClick={handleSignUpClick}>
          Sign Up
        </button>
        <button type="button" className="log-in" onClick={handleLoginClick}>
          Log In
        </button>
        </div>
      </div>
      {/* end of right */}
      {/* footer */}
      <footer className="main-page-footer">
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Help</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Apps</a></li>
          <li><a href="#">Settings</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Status</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Brand</a></li>
          <li><a href="#">Developers</a></li>

        </ul>
      </footer>

    </section>
  );
};

export default MainPage;
