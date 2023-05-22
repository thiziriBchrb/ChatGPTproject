import {addDoc, collection, getFirestore, updateDoc ,doc,getDoc} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { MdPublic } from 'react-icons/md';
import './newPost.css'
import {getAuth} from "firebase/auth";
import {useParams} from "react-router-dom";
import axios from 'axios';
const NewPost = (props) => {
    const { userId } = props;
    const auth = getAuth();
    const firestore = getFirestore();
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPostText, setNewPostText] = useState("");
    const [newCommentText, setNewCommentText] = useState("");
    const [newReplyText, setNewReplyText] = useState("");
    const [ comments,setComments] = useState([]);


    const [ setReplies] = useState([]);
    const [postComments] = useState("");
    const [showCommentModal, setShowCommentModal] = useState(false);
    const getUsername = async (userId) => {
        const firestore = getFirestore();
        const userDocRef = doc(firestore, "users", userId);
    
        const userDocSnapshot = await getDoc(userDocRef);
    
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
    
          return userData.firstname + ' ' + userData.name;
    
        }
    
        return null;
      };

      function addPost(text) {
        axios.post('http://127.0.0.1:5000/analyze-sentiment', { text })
          .then(response => {
            const sentimentResult = response.data.result;
            // Ajoutez le texte du poste et le résultat de l'analyse de sentiment dans la collection de posts
            const newPost = {
              text: text,
              sentiment: sentimentResult
            };
            // Faites quelque chose pour ajouter newPost à votre collection de posts (par exemple, une fonction ou un appel API pour ajouter à une base de données)
          })
          .catch(error => {
            console.error('Erreur lors de l\'appel à l\'API', error);
          });
      }
    const handleNewPostSubmit = async (event) => {
        event.preventDefault();
        if (newPostText.trim() !== "") {
            console.log("newPostText", newPostText);
            try {
                // Ajouter un nouveau post à la base de données Firebase
                const username = await getUsername(userId)
                const docRef = await addDoc(collection(firestore, "posts"), {
                    text: newPostText.trim(),
                    createdAt: new Date(),
                    userId: userId,
                    likes: 0,
                    shares:0,
                    comments: [],
                    username: username
                });

            
      const response = await fetch('http://127.0.0.1:5000/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newPostText }),
      });
      const data = await response.json();
      const sentimentResult = data.sentiment;

      // Ajouter l'attribut "sentiment" avec le résultat de l'analyse de sentiment
      console.log("ssssssssssssss",sentimentResult)
      await updateDoc(docRef, { sentiment: sentimentResult });

      // Mettre à jour le champ id_post avec l'ID du document
      await updateDoc(docRef, { id_post: docRef.id });
      setNewPostText("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
        }
    };


    return (
       
        <div className="newpost">


    <header>
        
        <h1> <MdPublic size={30}  />SpeakUp</h1>
        
    </header>
            <form className="new-post-form" onSubmit={handleNewPostSubmit}>
                <div className="newpostdiv">
                    <textarea type="text" placeholder="What's happening" value={newPostText} onChange={(event) => setNewPostText(event.target.value)} />
                </div>
                <button className="tweetBox__tweetButton" type="submit">Share</button>
            </form>
        </div>
    );
}

export default NewPost;
