import React from 'react';
import { useNavigate } from "react-router-dom";


import {Parallax} from 'react-parallax';
import Image from '../assets/img/hero/hero1.png'
import Header from './Header';

const Hero = () => {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate("/about");
    setTimeout(() => {
      const enquirySection = document.getElementById("enquiryform");
      if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: "smooth" });
      }
    }, 300); // Thoda delay diya hai taaki navigation complete ho jaye
  };

  const handleViewCoursesClick = () => {
    navigate("/coursefrontend");
  };

  return (
    <section className='min-h-[618px] lg:min-h-[815px] pt-9 lg:bg-circle bg-no-repeat lg:bg-right-top'>
      <div className="container mx-auto">
        
        <div className='flex flex-col items-center lg:flex-row lg:items-start pt-32'>
          <div className='flex-1 lg:mt-12'>
            <h2 className='h2 mb-3 lg:mb-[22px]' data-aos='fade-down' data-aos-delay='500'>
            Empowering Your Future <br /> with Quality Education <br />
             
            </h2>
            <p className='mb-6 lg:mb-12 max-w-[480px] lg:text-lg' data-aos='fade-down' data-aos-delay='600'>All Subjects, One Roof — Shreeji Classes <br />
            Join Shreeji Classes for Expert Coaching for Grades 6-12, JEE, NEET, SOF Olympiad, and more.
            </p>
            <div className='mb-12 space-x-4' data-aos='fade-down' data-aos-delay='700'>
              <button className='btn btn-sm lg:btn-lg btn-orange border-none'         onClick={handleEnroll}
              >Enroll Now</button>
              <button className='btn btn-sm lg:btn-lg text-heading bg-transparent border border-stroke-1 px-4 hover:bg-stroke-3 transition'         onClick={handleViewCoursesClick}
              >View Our Courses</button>
            </div>
          </div>
        
        <div className='w-full bg-circle bg-cover lg:bg-none lg:w-auto'>
          <div className='flex-1 flex justify-center lg:justify-end' data-aos='fade-left' data-aos-delay='600'>
            <div className='w-[234px] h-[234px] lg:w-[504px] lg:h-[744px] lg:mt-0'>
              <Parallax className='w-full h-full p-28 lg:p-16' 
              bgImage={Image}
              bgImageAlt='guy image'
              strength={200}
              />
            </div>
          </div>
        </div>

      </div>

      
      </div>
      
 
</section>
  )
};

export default Hero;
