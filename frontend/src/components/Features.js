import React from 'react';

const Features = () => {
  return (
    <section className="bg-gradient-to-r from-[#E7C68B] to-[#F3E5B0] py-16 lg:py-32 text-black">
      <div className="container mx-auto text-center px-4">
        
        <h2 className="text-4xl lg:text-6xl font-bold mb-8 animate__animated animate__fadeIn">
          Why Choose Shreeji Classes?
        </h2>

        
        <p className="text-lg lg:text-2xl mb-12 animate__animated animate__fadeIn animate__delay-1s">
          Our commitment is to provide the best learning experience for every student.
        </p>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 animate__animated animate__fadeIn animate__delay-2s">
            <div className="text-6xl mb-4">
              <i className="fas fa-book-reader"></i> 
            </div>
            <h4 className="text-xl font-semibold mb-2">Best Learning Materials</h4>
            <p className="text-gray-700">We provide comprehensive study materials for all subjects.</p>
          </div>

          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 animate__animated animate__fadeIn animate__delay-3s">
            <div className="text-6xl mb-4">
              <i className="fas fa-chalkboard-teacher"></i> 
            </div>
            <h4 className="text-xl font-semibold mb-2">Experienced Teachers</h4>
            <p className="text-gray-700">Our team consists of qualified and experienced educators.</p>
          </div>

          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 animate__animated animate__fadeIn animate__delay-4s">
            <div className="text-6xl mb-4">
              <i className="fas fa-pen-nib"></i> 
            </div>
            <h4 className="text-xl font-semibold mb-2">Customized Learning</h4>
            <p className="text-gray-700">We tailor our lessons to suit each student's learning style.</p>
          </div>

          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 animate__animated animate__fadeIn animate__delay-5s">
            <div className="text-6xl mb-4">
              <i className="fas fa-clipboard-list"></i> 
            </div>
            <h4 className="text-xl font-semibold mb-2">Regular Performance Tracking</h4>
            <p className="text-gray-700">We monitor your progress and provide regular feedback.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
