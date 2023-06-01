
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarPlaceholder from "./images/download.jpg";
import "./UserProfile.css";
import { useParams } from "react-router-dom";
import Modal from 'react-modal';
import Navigation from './Navigation';
import { MdHome, MdExplore, MdNotifications, MdPersonOutline ,MdSearch,MdPerson,MdExitToApp } from "react-icons/md";
import { getFirestore,updateDoc, collection, addDoc, orderBy, onSnapshot, query, increment,getDoc,getDocs, FieldPath,where, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const { userId } = useParams();

  const history = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const firestore = getFirestore();
  const auth = getAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [name, setName] = useState(null);

// ...


// Fonction pour suivre l'utilisateur
  const handleFollow = async () => {

  // Vérifiez si l'utilisateur est connecté
  if (!auth.currentUser) {
  setShowModal(true); // Afficher le modal si l'utilisateur n'est pas connecté
  return;
  }
  
  
  // Ajouter l'utilisateur connecté à la liste des abonnés
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const followers = userDoc.data().followers || [];
    if (!followers.includes(auth.currentUser.uid)) {
      await updateDoc(userRef, { followers: [...followers, auth.currentUser.uid] });
     
      setIsFollowing(true);
    }
  }
  };
  

  // Définition de la classe CSS pour le style du Modal
  const customModalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
      borderRadius: "8px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
      padding: "20px",
      maxWidth: "400px",
      width: "100%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };


  useEffect(() => {
    const fetchUserData = async () => {
      // Vérifiez si l'utilisateur est connecté
      // if (!auth.currentUser) {
   
      //   setShowModal(true); // Afficher le modal si l'utilisateur n'est pas connecté
      //   return;
      // }

      if (userId) {
        console.log("is",userId);
        const userRef = collection(firestore, "users");
        const userSnapshot = await getDocs(
          query(userRef, where("id", "==", userId))
        );
        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),

        }));
       
        setUserData(userData);
        // console.log("isssssssssssssssssssssssssss",userData[0].followingCount);
       
      }
    };
    console.log('data',userData);
    fetchUserData();
  }, [auth, firestore, history, userId]);

  return (
        <div>
    
 
       <Navigation  userId={userId}/>

       {userData!=null && (
          <div className="user-profile">
            <div className="user-info">
              {/* <div className="user-avatar">
                <img
                  src="https://media.istockphoto.com/id/1313958250/fr/vectoriel/ic%C3%B4ne-de-profil-davatar-utilisateur-illustration-noire-de-vecteur-sur-le-fond.jpg?s=1024x1024&w=is&k=20&c=JmBbZIrT3YK0Zjdpco3VSboEQOuQFNCujNAjePQpCtw=" 
                  alt="Avatar"
                />
              </div> */}
              <div className="user-details">
                <div className="user-names">
                  <h2>{userData[0].email}</h2>
                  <span>@ {userData[0].name} {userData[0].firstname}</span>
                </div>
                <div className="user-stats">
                  <div className="user-stat">
                    <span className="profile-stat-count">{userData[0].tweetsCount}</span>
                    <span className="profile-stat-label">Tweets</span>
                  </div>
                  <div className="user-stat">
                    <span className="profile-stat-count">{userData[0].followersCount}</span>
                    <span className="profile-stat-label">Followers</span>
                  </div>
                  <div className="user-stat">
                    <span className="profile-stat-count">{userData[0].followingCount}</span>
                    <span className="profile-stat-label">Following</span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="user-actions">
              <button className="btn btn-primary">Follow</button>
              <button className="btn btn-outline-primary">Message</button>
            </div> */}
          {auth.currentUser && auth.currentUser.uid == userId && (
          <div className="user-actions">
            {userData[0].followers && userData[0].followers.includes(auth.currentUser.uid) ? (
              <button className="btn btn-secondary">Unfollow</button>
            ) : (
              <button className="btn btn-primary" onSubmit={(event) => handleFollow()}>Follow</button>
            )}
            <button className="btn btn-outline-primary">Message</button>
          </div>
        )}
          </div>
          )}

          </div>
          );
};
 
export default Profile;




