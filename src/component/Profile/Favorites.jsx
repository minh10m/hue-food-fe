import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import RestaurantCard from '../Restaurant/RestaurantCard';
import { getMyFavorites } from '../../State/Authentication/Action';

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(
    (state) => state.auth?.favorites ?? [],
    shallowEqual
  );
  const loading = useSelector((state) => state.auth?.isLoading);

  useEffect(() => {
    dispatch(getMyFavorites());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-gray-400">Đang tải...</p>;
  }

  return (
    <div>
      <h1 className="py-5 text-center font-semibold">My Favorites</h1>
      <div className="flex flex-wrap gap-5 justify-center">
        {favorites.map((item) => (
          <RestaurantCard key={item.id || item.restaurantId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
