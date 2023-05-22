
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import {  getFirestore,doc, setDoc } from "firebase/firestore";
import { MdPublic } from 'react-icons/md';

import {React, useState } from "react";
import './login.css';

import { useNavigate } from 'react-router-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';
import { Firestore } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupFirstname, setSignupFirstname] = useState("");
  const [myStateVariable, setMyStateVariable] = useState("");



  const [error, setError] = useState("");
  const history = useNavigate();
  const auth = getAuth();
  const storage = getStorage();

  const db =  getFirestore();
  const handleSignUpClick = () => {
    history("/signup");
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      history(`/home/${userCredential.user.uid}`);
    } catch (error) {
      setError(error.message);
    }
  };
  return (


      <div className="container">
    <header>
        
        <h1> <MdPublic size={30}  />SpeakUp</h1>
        
    </header>
        <div className="row mt-5">
   
      
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSignIn}>
              <div>
                <label htmlFor="exampleInputEmail1">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="signin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>

              
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="signin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
              </div>
          
              <button type="button" class="btn btn-primary" onClick={handleSignIn}>Sign In</button>
              
              <div className="form-text text-muted">
                <p>Not a member? <a href="/signup" onClick={handleSignUpClick}>Sign up</a></p>
              </div>
            </form>
          </div>
     
      </div>
    
  );
  
  
  

}

export default Login;