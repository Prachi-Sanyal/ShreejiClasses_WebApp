import React from 'react';

import { Link } from 'react-router-dom';

import CardImage1 from '../assets/img/cards/card-1.jpg';
import CardImage2 from '../assets/img/cards/card-2.jpg';
import CardImage3 from '../assets/img/cards/card-3.jpg';


const Cards = () => {
  return ( 
    <section className='bg-cardsBg min-h-[260px] pb-[55px] lg:-mt-24' data-aos='fade-up' data-aos-delay='100' data-aos-duration='1600'>
      <div className="container mx-auto flex flex-col lg:flex-row gap-x-[32px]">

        <div className='flex-1 flex gap-x-[15px] lg:gap-x-[32px] -mt-[38px] z-10 lg:-mt-[77px] mx-auto'>
         
          <div className='bg-white w-full max-w-[282px] p-6 lg:p-[26px] shadow-2xl rounded-md max-h-[282px]'data-aos='fade-up' data-aos-delay='400' >
            <div className='flex items-center mb-[18px] lg:mb-[28px]'>
              <h4 className='text-lg lg:text-2xl lg:leading-7 font-bold text-heading mr-8'>Experienced Faculty</h4>
              {/*<img src={Icon1} alt="Icon 1" className="h-6 w-6" /> */}
            </div>
            <div>
              <img src={CardImage1} alt="Card 1"/>
            </div>
          </div>

          <div className='bg-white w-full max-w-[282px] p-6 lg:p-[26px] shadow-2xl rounded-md max-h-[282px]' data-aos='fade-up' data-aos-delay='600'>
            <div className='flex items-center mb-[18px] lg:mb-[28px]'>
              <h4 className='text-lg lg:text-2xl lg:leading-7 font-bold text-heading mr-8'>Comprehensive Study Material</h4>
              {/*<img src={Icon3} alt="Icon 2" className="h-6 w-6" />*/}
            </div>
            <div>
              <img src={CardImage2} alt="Card 2"/>
            </div>
          </div>

        </div>

        <div className='bg-white w-full flex-1 max-w-[542px] sm:max-w-[580px] md:max-w-[646px] lg:max-w-[542px] mx-auto p-[14px] lg:p-[26px] mt-4 lg:-mt-[77px] z-10 shadow-2xl rounded-md flex justify-between items-start'>
          <div className='max-w-[240px]' data-aos='fade-up' data-aos-delay='800'>
            <div className='flex items-center mb-4 lg:mb-8'>
              <h4 className='text-lg lg:text-2xl lg:leading-7 font-bold text-heading mr-8'>Personalized Attention</h4>
              {/*<img src={Icon2} alt="Icon 3" className="h-6 w-6" /> */}
            </div>
            <p className='mb-4 lg:mb-6'>We offer small batch sizes to ensure each student progresses at their own pace.</p>
            <Link className='text-xs lg:text-sm font-bold uppercase text-heading' to="/about">Read more</Link> {/* Link to About Us page */}
          </div>
         

          <div>
            <img src={CardImage3} alt='Card 3'/>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Cards;
