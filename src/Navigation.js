import React from 'react';
import { MdHome, MdSearch, MdNotifications, MdPerson, MdExitToApp } from 'react-icons/md';
import Logout from './Logout';
import { BiBorderLeft } from 'react-icons/bi';
import './Navigation.css'; // Importez le fichier CSS contenant le style
function Navigation(props) {
  const { userId } = props;
  console.log(userId);
  return (
    <div className="navigate" >
      <a href="/home/:userId" className="navigate-link">
        <MdHome size={20} />
        Home
      </a>
      {/* <a href="/explore" className="navigate-link">
        <MdSearch size={20} />
        Explore
      </a> */}
      <a href="/notifications" className="navigate-link">
        <MdNotifications size={20} />
        Notifications
      </a>
      {/* <a href="/login" className="navigate-link">
        <MdPerson size={20} />
        Login
      </a> */}
      <a href="/login"  onClick={Logout.handleLogout} className="navigate-link">
        <MdExitToApp size={20} />
        Logout
      </a>
      <a href={`/profile/${userId}`} className="navigate-link">
        <MdPerson size={20} />
        Profile
      </a>
    </div>
  );
}

export default Navigation;
