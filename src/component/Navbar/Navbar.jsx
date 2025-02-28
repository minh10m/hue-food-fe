import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar, Badge, IconButton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";


export const Navbar = () => {

  const {auth, cart} = useSelector(store => store)

  const navigate = useNavigate();

  const handleAvatarClick = () => {
    // if(auth.user?.role === 'ROLE_CUSTOMER' ){
    //   navigate("/my-profile")
    // }
    // else navigate("/admin/restaurant")
    navigate("/my-profile")
  };
  return (
    <div className="sticky top-0 px-5 z-[50] py-[.8rem] bg-[#862f58] lg:px-20 flex justify-between">
      <div className="lg: mr-10 cursor-pointer flex items-center space-x-4">
        <li onClick={()=> navigate("/")} className="logo font-semibold text-gray-30 text-2xld">Hue Food</li>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-10">
        <div className="">
          <IconButton>
            <SearchIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton> 
        </div>  

        <div className="">
          {auth.user ? (
            <Avatar className='cursor-pointer' onClick={handleAvatarClick} sx={{ bgcolor: "white", color: "blue" }}>
              {auth.user?.fullName[0].toUpperCase()}
            </Avatar> 
          ) : (
            <IconButton onClick={() => navigate("account/login")}> 
              <PersonIcon/>
            </IconButton>
          )}
        </div>

        <div className="">
          <IconButton onClick={() => navigate("/cart")}>
            <Badge color="primary" badgeContent={cart.cart?.items.length}>
              <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
            </Badge>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
