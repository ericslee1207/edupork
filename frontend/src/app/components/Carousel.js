import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Box, Button } from '@chakra-ui/react';
// Import Swiper styles
import 'swiper/css';
import React, { useRef } from 'react';
import { useSwiper } from 'swiper/react';
import 'swiper/css/pagination';


function Carousel({ children }) {
  const swiper = useSwiper();

  return (
    <>
    <Swiper
      modules={[Pagination]}
      watchSlidesProgress
      pagination={{ clickable: true,  }}
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      centeredSlides={true}
      
    >
      {children}
    </Swiper>
  </>
  );
}

export default Carousel;
