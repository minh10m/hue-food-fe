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
    <div className="sticky top-0 px-5 z-[50] py-3 bg-[#0f0f12]/90 backdrop-blur lg:px-20 flex items-center justify-between border-b border-white/5">
      <div className="mr-2 lg:mr-10 cursor-pointer flex items-center space-x-3">
        <li onClick={()=> navigate("/")} className="logo font-extrabold tracking-tight text-white text-2xl">Hue Food</li>
      </div>

      <div className="flex items-center space-x-1 lg:space-x-6">
        <div>
          <IconButton size="small" color="inherit">
            <SearchIcon sx={{ fontSize: "1.25rem", opacity: 0.9 }} />
          </IconButton>
        </div>

        <div>
          {auth.user ? (
            <Avatar
              src={auth.user?.avatarUrl || undefined}
              alt={auth.user?.fullName || 'User'}
              className='cursor-pointer ring-1 ring-white/10'
              onClick={handleAvatarClick}
              sx={{ bgcolor: "#e91e63", color: "#fff", width: 36, height: 36, fontWeight: 600 }}
            >
              {!auth.user?.avatarUrl && (auth.user?.fullName?.[0]?.toUpperCase?.() || 'U')}
            </Avatar>
          ) : (
            <IconButton size="small" color="inherit" onClick={() => navigate("account/login")}>
              <PersonIcon/>
            </IconButton>
          )}
        </div>

        <div>
          <IconButton size="small" color="inherit" onClick={() => navigate("/cart")}>
            <Badge color="primary" badgeContent={cart.cart?.items?.length || 0}>
              <ShoppingCartIcon sx={{ fontSize: "1.25rem" }} />
            </Badge>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
