import React from 'react'
import { Routes, Route, BrowserRouter as Router, Link } from 'react-router-dom';
import Home from '../component/Home/Home';
import RestaurantDetails from '../component/Restaurant/RestaurantDetails';
import Cart from '../component/Cart/Cart';
import Profile from '../component/Profile/Profile';
import { Navbar } from '../component/Navbar/Navbar';
import Auth from '../component/Auth/Auth';
import PaymentSuccess from '../component/Order/PaymentSuccess';
import ForgotPasswordPage from '../component/Auth/ForgotPasswordPage';

const CustomerRoute = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/account/:register' element={<Home/>}/>
          <Route path='/restaurant/:city/:title/:id' element={<RestaurantDetails/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/my-profile/*' element={<Profile/>}/>
          <Route path='/payment/success/:id' element={<PaymentSuccess/>}/>
          <Route path="/account/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
      <Auth/>
    </div>
  )
}

export default CustomerRoute