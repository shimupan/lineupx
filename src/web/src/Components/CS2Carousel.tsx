import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import slide_image_1 from '../assets/cs2maps/ancient.webp';
import slide_image_2 from '../assets/cs2maps/anubis.webp';
import slide_image_3 from '../assets/cs2maps/dust2.webp';
import slide_image_4 from '../assets/cs2maps/inferno.webp';
import slide_image_5 from '../assets/cs2maps/mirage.webp';
import slide_image_6 from '../assets/cs2maps/nuke.webp';
import slide_image_7 from '../assets/cs2maps/overpass.webp';
import slide_image_8 from '../assets/cs2maps/vertigo.webp';

const CS2Carousel: React.FC = () => {
  return (
    <div className="mx-auto relative">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 30, 
          stretch: 50,
          depth: 200,
          modifier: 1,
          slideShadows: true, 
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="swiper_container"
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        speed={750}
      >
        <SwiperSlide>
          <img src={slide_image_1} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_2} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_3} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_4} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_5} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_6} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_7} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_8} alt="slide_image" />
        </SwiperSlide>

        <div className="slider-controler">
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}

export default CS2Carousel;
