import { getFirestore,updateDoc, collection, addDoc,doc, orderBy, onSnapshot, query, increment,getDoc,getDocs, FieldPath,where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import Navigation from './Navigation';
import './home.css'
import { format } from 'date-fns';
import NewPost from "./newPost";
import {Avatar} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IoChatboxOutline } from 'react-icons/io5';
import { AiOutlineHeart } from 'react-icons/ai';
import CommentIcon from '@mui/icons-material/Comment';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import PostSentiment from './nlp.js';
import axios from 'axios';

const Home= () => {
  const auth = getAuth();
  const { userId } = useParams();
  const firestore = getFirestore();
  const [idpost, setPostId] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [newCommentText, setNewCommentText] = useState("");
  const [newReplyText, setNewReplyText] = useState("");
  const [ comments,setComments] = useState([]);

  const [newPostText, setNewPostText] = useState("");
  const [ setReplies] = useState([]);

  const [postLikes, setPostLikes] = useState({});
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);

  

  const handleShowComments = async (id) => {
    setShowComments(prevShowComments => !prevShowComments);

    saveid(id)
    if (showComments) {
      await fetchComments(id);
    }
    else{
      console.log("show",showComments)
    }
 
  };
  const saveid =(id) => {
    setPostId(id);
  }
  const handleId = (id) => {
    setShowCommentForm(true);
    console.log(id);
    setPostId(id);
  };

 
  
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

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    });

    return unsubscribe;
  }, []);

    

  useEffect(() => {
    // Récupérer les posts existants dans la base de données Firebase
    const q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newPosts = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          
          const username = await getUsername(postData.userId);
         
          return {
            id: doc.id,
            ...postData,
            username: username,
            showComments: false
          };
        })
      );
      setPosts(newPosts);
    });

    return unsubscribe;
  }, []);


  const handleLike = async (postId) => {
    const postRef = doc(firestore, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const post = postSnap.data();
      const likes = post.likes || 0;
      const likedUsers = post.likedUsers || [];

      if (likedUsers.includes(user.uid)) {
        // User already liked the post, unlike it
      
        const index = likedUsers.indexOf(user.uid);
        likedUsers.splice(index, 1);
        await updateDoc(postRef, { likes: likes - 1, likedUsers });
        // setLiked(false);
        
      } else {
        // User hasn't liked the post, like it
        likedUsers.push(user.uid);
        await updateDoc(postRef, { likes: likes + 1, likedUsers });
        // setLiked(true);
      }
      setPostLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: !prevLikes[postId]
      }));
    }
  };


  const handleNewCommentSubmit = async (event, id_post) => {
    event.preventDefault();

    if (newCommentText.trim() !== "") {
      try {
        // Ajouter un nouveau commentaire à la base de données Firebase
        const username = await getUsername(user.uid);
        const commentDocRef = await addDoc(collection(firestore, "comments"), {
          text: newCommentText.trim(),
          createdAt: new Date(),
          userId: user.uid,
          likes: 0,
          replies: [],
          nbReplies: 0,
          nbLikes: 0,
          comment_parent_id:'',
          postId: id_post,
          username:username,
        });
      //   const commentRef = doc(firestore, "comments", commentDocRef.id);

      //   await updateDoc(commentRef, { comment_id: commentDocRef.id });


      // setNewCommentText("");
      // setShowCommentForm(false)
      // } catch (error) {
      //   console.error("Error adding document: ", error);
      // }
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
      await updateDoc(commentDocRef, { sentiment: sentimentResult });

      // Mettre à jour le champ id_post avec l'ID du document
      await updateDoc(commentDocRef, { id_post: commentDocRef.id });
      // setNewPostText("");
      setNewCommentText("");
      setShowCommentForm(false)
    } catch (error) {
      console.error("Error adding document: ", error);
    }
        
    }
  };
  const handleNewReplySubmit = async (event, commentId) => {
    event.preventDefault();

    if (newReplyText.trim() !== "") {
      try {
        // Ajouter une nouvelle réponse à la base de données Firebase
        const username = await getUsername(user.uid);
        const replyDocRef = await addDoc(collection(firestore, "comments"), {
          text: newReplyText.trim(),
          createdAt: new Date(),
          userId: user.uid,
          likes: 0,
          replies: [],
          nbReplies: 0,
          nbLikes: 0,
          comment_parent_id: commentId ,// le commentaire parent
          username:username
        });

        const replyRef = doc(firestore, "comments", replyDocRef.id);
        await updateDoc(replyRef, { comment_id: replyDocRef.id });

        fetchComments();
        fetchReplies();
        setNewReplyText("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const fetchComments = async (postId) => {
    // const q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"));
    const commentsRef = query(collection(firestore, "comments" ),orderBy("createdAt", "desc"));
    const commentsSnapshot = await getDocs(commentsRef);
    const commentsData = commentsSnapshot.docs
      .filter((doc) => doc.data().id_post === postId)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    console.log(postId)
    setComments(commentsData);

    
  };
  
  useEffect((id) => {
    fetchComments(id);
  }, []);

  
  
  

  const fetchReplies = async (commentId) => {
    if (commentId) {
      const repliesRef = collection(firestore, "comments");
      const repliesSnapshot = await getDocs(
        query(repliesRef, where("comment_parent_id", "==", commentId))
      );
      const repliesData = repliesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReplies(repliesData);
    }
  };




  useEffect(() => {
    fetchReplies();
  }, [replyToCommentId]);



return (

  <div className="body">

      <div className="header">
      <h1 className="logo">Twitter </h1>
      </div>


      <Navigation  userId={userId}/>

    <NewPost userId={userId}/>



    <div className="tweet">

      {posts.map((post) => (

        <div className="postcontent" key={post.id_post}>
          <div className="post__avatar">
           {/* <p className="sentiment">  {post.sentiment}</p>  */}

          < PostSentiment  sentiment={post.sentiment}/> 
            <Avatar src="https://media.istockphoto.com/id/1313958250/fr/vectoriel/ic%C3%B4ne-de-profil-davatar-utilisateur-illustration-noire-de-vecteur-sur-le-fond.jpg?s=1024x1024&w=is&k=20&c=JmBbZIrT3YK0Zjdpco3VSboEQOuQFNCujNAjePQpCtw=" />
            <p className="post-user">{post.username}</p>
            <span className="post-date">Posted on {format(post.createdAt.toDate(), 'MMMM dd')}</span>
          </div>

          <p className="post-text">{post.text}</p>

          <div className="tweet__bottom">
            
          <IoChatboxOutline size={25} className="comment__bottom" onClick={() => handleId(post.id_post)}> </IoChatboxOutline> 
            { (
                <span className="fil">
                  <AiOutlineHeart size={25} color={postLikes[post.id_post] ? 'red' : 'black'} onClick={() => handleLike(post.id_post)}> </AiOutlineHeart > {post.likes}
                  
                
                </span>

            )}
            <button className="comment__bottom" onClick={() =>handleShowComments(post.id_post)}><CommentIcon size={25}/></button>
          </div>
    
            
            
            
       

        
        {idpost=== post.id_post && showCommentForm  ?  (
        <div className="comment-modal">
       
          <div className="comment-content"  key={post.id_post}>
         
          <h1> Reply to @{post.username} </h1>
          <button className="btn_cancel" onClick={() => setShowCommentForm(false)}><AiOutlineCloseCircle/></button>
            <form onSubmit={(event) => handleNewCommentSubmit(event, post.id_post )}>
         
              <div className="comment-form">
                
                <div className="postcontent_comment" key={post.id_post}>
                  <div className="post__avatar">
                    <Avatar src="https://media.istockphoto.com/id/1313958250/fr/vectoriel/ic%C3%B4ne-de-profil-davatar-utilisateur-illustration-noire-de-vecteur-sur-le-fond.jpg?s=1024x1024&w=is&k=20&c=JmBbZIrT3YK0Zjdpco3VSboEQOuQFNCujNAjePQpCtw=" />
                    {/* <p className="post-user">kkkkkk{post.username}</p> */}
                    <span className="post-date">Posted on {format(post.createdAt.toDate(), 'MMMM dd')}</span>
                </div>

                <p className="post-text">{post.text}</p>
              </div> 
                <input
            className="new-comment-input"
            type="text"
            placeholder="Add your reply!"
            value={newCommentText}
            onChange={(event) => setNewCommentText(event.target.value)}
          />
          <div className="comment-buttons">
            <button className="btn_share" type="submit">share<ReplyIcon/></button>
            
            
          </div>
        </div>
      </form>
    </div>
  </div>
) : (
  <div className="comment-button-container">
    
  </div>
)}
  

<div key={post.id_post}>
 
      

{showComments && post.id_post==idpost &&(
  
<div className="comments-section">

{/* <button className="btn_cancel" onClick={() => setShowComments(false)}>annuler<AiOutlineCloseCircle/></button> */}
{/* <div className="comment-modal-content"  key={post.id_post}> */}
<button className="comment_btn_cancel" onClick={() => setShowComments(false)}><AiOutlineCloseCircle/></button>


<div  className="postcontent_comments" key={post.id_post}>
    <div className="post__avatar">
      <Avatar src="https://media.istockphoto.com/id/1313958250/fr/vectoriel/ic%C3%B4ne-de-profil-davatar-utilisateur-illustration-noire-de-vecteur-sur-le-fond.jpg?s=1024x1024&w=is&k=20&c=JmBbZIrT3YK0Zjdpco3VSboEQOuQFNCujNAjePQpCtw=" />
      
      <span className="post-date">Posted on {format(post.createdAt.toDate(), 'MMMM dd')}</span>
  </div>

  <p className="comment-post-text">{post.text}</p>

  {comments

.filter((comment) => comment.postId ===post.id_post)
.map((comment) => (

<div className="comment" key={comment.id}>

   
    <div className="comment_post__avatar">
      <Avatar src="https://media.istockphoto.com/id/1313958250/fr/vectoriel/ic%C3%B4ne-de-profil-davatar-utilisateur-illustration-noire-de-vecteur-sur-le-fond.jpg?s=1024x1024&w=is&k=20&c=JmBbZIrT3YK0Zjdpco3VSboEQOuQFNCujNAjePQpCtw=" />
      {/* <p className="post-user">kkkkkk{post.username}</p> */}
      <p className="post-user">{comment.username}</p>
      <span className="post-date">Posted on {format(comment.createdAt.toDate(), 'MMMM dd')}</span>
  </div>
  <p className="comment-text">
      {comment.text}
      
    </p>
    <button className="reply-button" onClick={() => setReplyToCommentId(comment.id)}>
        Reply
    </button>
    {replyToCommentId === comment.id && (
      <form className="reply-form" onSubmit={(event) => handleNewReplySubmit(event, comment.id)}>
        <textarea
          className="new-reply-input"
          type="text"
          placeholder="Reply to the comment"
          value={newReplyText}
          onChange={(event) => setNewReplyText(event.target.value)}
        />
        <button className="reply-button" type="submit">
          Reply <ReplyIcon/>
        </button>
      </form>
      
    )}
      <button className="show-replies-button" onClick={() => setShowReplies(!showReplies)}>
  {showReplies ? 'Masquer les réponses' : 'Afficher les réponses'}
</button>
{showReplies && (
  <ul className="reply-list">
    <h4 className="replies-heading">Réponses</h4>
    {comments
      .filter((reply) => reply.comment_parent_id === comment.id)
      .map((reply) => (
        <li className="comment-post-text" key={reply.id}>
               <div className="comment_post__avatar">
                <Avatar src="https://media.istockphoto.com/id/1313958250/fr/vectoriel/ic%C3%B4ne-de-profil-davatar-utilisateur-illustration-noire-de-vecteur-sur-le-fond.jpg?s=1024x1024&w=is&k=20&c=JmBbZIrT3YK0Zjdpco3VSboEQOuQFNCujNAjePQpCtw=" />
                {/* <p className="post-user">kkkkkk{post.username}</p> */}
                <p className="post-user">{reply.username}</p>
                <span className="post-date">Posted on {format(reply.createdAt.toDate(), 'MMMM dd')}</span>
              </div>
              <p className="">{reply.text}</p>
            </li>
      ))}
  </ul>
)}
      
</div>
))}
          
</div> 

</div>
)}
     
     

    </div>
        </div>
      ))}
    </div>
  </div>
);
}
export default Home;


