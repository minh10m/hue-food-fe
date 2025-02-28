import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { topMeels } from './TopMeel';
import CarousItem from './CarousItem';
import Slider from "react-slick";

function MultiItemCarous() {
   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 1500,
      arrows: false
    };
   return (
      <div>
         <Slider {...settings}>
            {topMeels.map((item) => <CarousItem image={item.image} title={item.title} />)}
         </Slider>

      </div>
   );
}

export default MultiItemCarous
