import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  // Déconnecter l'utilisateur et le rediriger vers la page de connexion
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user && (
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      )}
    </>
  );
};

export default Logout;
