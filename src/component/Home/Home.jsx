import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurantAction } from '../../State/Restaurant/Action';
import RestaurantCard from '../Restaurant/RestaurantCard';
import "./Home.css";
import MultiItemCarous from './MultiItemCarous';

const restaurants = [1,1,1,1,1,1,1,1]

export const Home = () => {

  const dispatch = useDispatch();

  const jwt = localStorage.getItem('jwt');

  const {restaurant} = useSelector(store => store)
  console.log("restaurant: ",restaurant)

  useEffect(() => {
    dispatch(getAllRestaurantAction(jwt));
    
  }, [])



  return (
    <div className="pb-10">
      <section className="banner -z-50 relative flex flex-col justify-center items-center">

         <div className='w-[50vw] z-10 text-center'>
            <p className="text-2xl lg:text-6xl font-bold z-10 py-5">Hue food</p>
            <p className="z-10 text-gray-300 text-xl lg: text-4xl">Tận hưởng thức ăn, dịch vụ của chúng tôi </p>
         </div>

         <div className='cover absolute top-0 left-0 right-0'>

         </div>

         <div className='fadout'>

         </div>
      </section>

      <section className='p-10 lg: py-10 lg:px-20'>
          <p className='text-2xl font-semibold text-gray-400 py-3 px-10'>Top meels</p>
          <MultiItemCarous/>
      </section>

      <section className='px-5 lg:px-20'>
          <h1 className='text-2xl font-semibold text-gray-400 pb-5'>Order từ những cừa hàng được yêu thích </h1>
          <div className='flex flex-wrap items-center justify-around gap-5'>
            {
              restaurant.restaurants.map((item)=>
                <RestaurantCard item = {item}/>
              )
            }
          </div>

      </section>
    </div>
  )
}

export default Home