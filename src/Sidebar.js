import React from "react";
// import "./Sidebar.css";
import { TiSocialTwitter } from "react-icons/ti";
import SidebarOption from "./SidebarOption";
import { AiOutlineHome, AiOutlineSearch, AiOutlineBell, AiOutlineMail, AiOutlineStar, AiOutlineProfile, AiOutlineUnorderedList, AiOutlinePlus } from "react-icons/ai";
import { Button } from "reactstrap";

const Sidebar= () =>{
  return (
    <div className="sidebar">
      <TiSocialTwitter className="sidebar__twitterIcon" />

      <SidebarOption active Icon={AiOutlineHome} text="Home" />
      <SidebarOption Icon={AiOutlineSearch} text="Explore" />
      <SidebarOption Icon={AiOutlineBell} text="Notifications" />
      <SidebarOption Icon={AiOutlineMail} text="Messages" />
      <SidebarOption Icon={AiOutlineStar} text="Bookmarks" />
      <SidebarOption Icon={AiOutlineUnorderedList} text="Lists" />
      <SidebarOption Icon={AiOutlineProfile} text="Profile" />
      <SidebarOption Icon={AiOutlinePlus} text="More" />

      {/* Button -> Tweet */}
      <Button className="sidebar__tweet" outline color="primary" block>
        Tweet
      </Button>
    </div>
  );
}

export default Sidebar;
