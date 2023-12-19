import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import slide_image_1 from '../assets/valorantmaps/ascent.webp';
import slide_image_2 from '../assets/valorantmaps/bind.webp';
import slide_image_3 from '../assets/valorantmaps/breeze.webp';
import slide_image_4 from '../assets/valorantmaps/fracture.webp';
import slide_image_5 from '../assets/valorantmaps/haven.webp';
import slide_image_6 from '../assets/valorantmaps/icebox.webp';
import slide_image_7 from '../assets/valorantmaps/lotus.webp';
import slide_image_8 from '../assets/valorantmaps/pearl.webp';
import slide_image_9 from '../assets/valorantmaps/split.webp';
import slide_image_10 from '../assets/valorantmaps/sunset.webp';

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
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
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
        <SwiperSlide>
          <img src={slide_image_9} alt="slide_image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={slide_image_10} alt="slide_image" />
        </SwiperSlide>

        <div className="slider-controler">
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}

export default CS2Carousel;
