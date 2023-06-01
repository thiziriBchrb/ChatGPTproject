
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc ,updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./signUp.css";
import { MdPublic } from 'react-icons/md';
import "firebase/storage";

import { ref,getStorage ,uploadBytes, getDownloadURL } from "firebase/storage";


const SignUp = () => {
  const [signupName, setSignupName] = useState("");
  const [signupFirstname, setSignupFirstname] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");
  const history = useNavigate();
  const storage = getStorage();
  const auth = getAuth();
  const db = getFirestore();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );

      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        name: signupName,
        firstname: signupFirstname,
        id: userCredential.user.uid,
        email: userCredential.user.email,
        tweetsCount: 0,
        followingCount: 0,
        followersCount: 0,
        followers: [],
        photo: ''
      });

      history(`/home/${userCredential.user.uid}`);
      console.log(auth.currentUser);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
  
    try {
      const storageRef = ref(storage, "profile-images/" + file.name);
      await uploadBytes(storageRef, file);
  
      // Récupérer l'URL de téléchargement de l'image
      const downloadURL = await getDownloadURL(storageRef);
  
      // Enregistrer l'URL dans la base de données Firebase
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        profileImageURL: downloadURL,
      });
  
      console.log("Téléchargement de l'image terminé !");
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
    }
  };
  
  
  

  return (
    <div className="container">
      <header>
      <img src={require("./logo.png")}/>
        <h1> SpeakUp</h1>
        
    </header>
      {/* <h1 className="signup-heading">Sign Up</h1> */}
      <div className="signup-form">
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="signup-name">Name</label>
            <input
              type="text"
              className="form-control"
              id="signup-name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-firstname">First Name</label>
            <input
              type="text"
              className="form-control"
              id="signup-firstname"
              value={signupFirstname}
              onChange={(e) => setSignupFirstname(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              className="form-control"
              id="signup-email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              className="form-control"
              id="signup-password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            
          </div>
          <button type="submit" className="btn btn-primary" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
