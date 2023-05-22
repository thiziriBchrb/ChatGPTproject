import { getFirestore, collection, addDoc, orderBy, onSnapshot, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  // insérer les informations de configuration de votre application Firebase ici
  apiKey: "AIzaSyDocDOorcRBahU_uethYjyFqLCjP_CW9OM",
  authDomain: "twitter-clone-f6077.firebaseapp.com",
  projectId: "twitter-clone-f6077",
  storageBucket: "twitter-clone-f6077.appspot.com",
  messagingSenderId: "136550487896",
  appId: "1:136550487896:web:9032ad3d7a4a52dca9372d"
};

const app = initializeApp(firebaseConfig);

function Home() {
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");

  const navigate = useNavigate();

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
  }, [auth, navigate]);

  useEffect(() => {
    // Récupérer les posts existants dans la base de données Firebase
    const q = query(collection(firestore, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(newPosts);
    });

    // Arrêter la mise à jour en temps réel lorsque le composant est démonté
    return unsubscribe;
  }, [firestore]);

  const handleNewPostSubmit = async (event) => {
    event.preventDefault();
    if (newPostText.trim() !== "") {
      try {
        // Ajouter un nouveau post à la base de données Firebase
        const docRef = await addDoc(collection(firestore, "posts"), {
          text: newPostText.trim(),
          createdAt: new Date(),
          userId: user.uid,
        });
        setNewPostText("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div>
      <h1>Twitter Clone</h1>

      <form onSubmit={handleNewPostSubmit}>
        <input type="text" value={newPostText} onChange={(event) => setNewPostText(event.target.value)} />
        <button type="submit">Tweet</button>
      </form>

      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
          <p>{post.userId}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;











