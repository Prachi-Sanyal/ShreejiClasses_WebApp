
import React from 'react';
import { courses } from '../data';
import { Link } from 'react-router-dom';

const Courses = () => {
  return (
    <section className="section-sm lg:section-lg">
      <div className="container mx-auto">
        <div className="text-center mb-16 lg:mb-32">
          <h2 className="h2 mb-3 lg:mb-[18px]" data-aos='fade-down' data-aos-delay='200'>Courses We Offer</h2>
          <p className="max-w-[780px] mx-auto" data-aos='fade-down' data-aos-delay='300' >
          At Shreeji Classes, we offer a comprehensive range of courses designed to cater to every student's academic needs. Whether you're preparing for school exams, competitive tests like JEE and NEET, or national-level Olympiads, we have specialized programs tailored to your goals. Our courses are led by experienced educators who focus on individual progress and conceptual clarity. Explore our varied offerings to find the right path for your educational journey.          </p>
        
        </div>

        

        <div className="flex flex-col lg:flex-row lg:gap-x-[33px] gap-y-24 mb-7 lg:mb-14">
          {courses.map((item, index) => {
            const { image, title, desc, link, delay } = item;
            return (
              <div
                className="w-full bg-pink-100 shadow-primary max-w-[368px] px-[18px] pb-[26px] lg:px-[28px] lg:pb-[38px] flex flex-col rounded-[14px] mx-auto transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                key={index}
                data-aos='fade-up' data-aos-delay={delay}
              >
               
                <div className="-mt-[38px] lg:-mt-12 mb-4 lg:mb-6 flex justify-center">
                  <img
                    src={image}
                    alt=""
                    className="w-full h-[200px] object-cover rounded-[8px]"
                  />
                </div>

                <div>
                  <h4 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-4">{title}</h4>
                  <p>{desc}</p>
                </div>

                
              </div>
            );
          })}
        </div>

        
        <div className="text-right mt-8">
        <Link  to="/coursefrontend">
            <button className="btn btn-md lg:px-[20px] bg-blue-100 border border-blue text-blue font-medium text-sm lg:text-base hover:bg-blue-200 hover:text-white transition">
              View all courses &rarr;
            </button>
            </Link>
        </div>

      </div>
    </section>
  );
};

export default Courses;
