import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../../State/Order/Action';
import OrderCard from './OrderCard';

// Orders.jsx
const Orders = () => {
  const { auth, order } = useSelector(store => store);
  const jwt = localStorage.getItem('jwt');
  const dispatch = useDispatch();

  useEffect(() => {
    if (jwt) dispatch(getUsersOrders(jwt));
  }, [dispatch, jwt]);

  return (
    <div className="flex flex-col items-center pt-6">
      <h1 className="text-2xl text-center pb-6 font-semibold">my orders</h1>
      <div className="space-y-5 w-full lg:w-1/2">
        {order.orders.map(o =>
          o.items.map(it => (
            <OrderCard key={`${o.id}-${it.id}`} order={o} item={it}/>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders