import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../../State/Order/Action';
import OrderCard from './OrderCard';

const Orders = () => {

  const {cart, auth, order} = useSelector(store => store);

  const navigate = useNavigate();
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersOrders(jwt))
}, [auth.jwt])


  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl text-center py-6 font-semibold'>my orders</h1>
      <div className='space-y-5 w-full lg:w-1/2'>
        {
          order.orders.map((order) => order.items.map((item) =><OrderCard order = {order} item = {item}/>))
        }
      </div>
    </div>
  )
}

export default Orders