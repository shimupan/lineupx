import { Swiper, SwiperSlide } from 'swiper/react';
import {
   EffectCoverflow,
   Pagination,
   Navigation,
   Autoplay,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type CarouselProps = {
   images: string[];
};

const Carousel: React.FC<CarouselProps> = ({ images }) => {
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
            {images.map((image, index) => (
               <SwiperSlide key={index}>
                  <img src={image} alt="slide_image" />
               </SwiperSlide>
            ))}
            <div className="slider-controler">
               <div className="swiper-pagination"></div>
            </div>
         </Swiper>
      </div>
   );
};

export default Carousel;
