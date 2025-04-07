import React from "react";
import Slider from "react-slick";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



import imgAarav from '../assets/img/students/imgAarav.jpg';
import imgSimran from '../assets/img/students/imgSimran.jpg';
import imgRavi from '../assets/img/students/imgRavi.jpg';
import imgPooja from '../assets/img/students/imgPooja.jpg';
import imgRaj from '../assets/img/students/imgRaj.jpg';
import imgNeha from '../assets/img/students/imgNeha.jpg';
import imgVikram from '../assets/img/students/imgVikram.jpg';
import imgAnanya from '../assets/img/students/imgAnanya.jpg';
import imgMadhav from '../assets/img/students/imgMadhav.jpg';
import imgAisha from '../assets/img/students/imgAisha.jpg';

const testimonials = [
  {
    name: "Aarav Patel",
    image: imgAarav,
    testimonial: "The classes at Shreeji Coaching have helped me clear my concepts and boost my confidence. The teachers are highly supportive!",
    rating: 5
  },
  {
    name: "Simran Sharma",
    image: imgSimran,
    testimonial: "I had a great experience here. The study materials are excellent, and the faculty is always ready to help.",
    rating: 5
  },
  {
    name: "Ravi Desai",
    image: imgRavi,
    testimonial: "Thanks to Shreeji Coaching, I managed to crack my entrance exams with flying colors. Their mock tests were really helpful!",
    rating: 5
  },
  {
    name: "Pooja Rathi",
    image: imgPooja,
    testimonial: "I was struggling with some subjects, but the teachers here provided individual attention and helped me improve immensely.",
    rating: 4
  },
  {
    name: "Raj Patel",
    image: imgRaj,
    testimonial: "Amazing coaching! The teachers are always on their toes to ensure the best understanding of every topic.",
    rating: 4
  },
  {
    name: "Neha Jain",
    image: imgNeha,
    testimonial: "The personalized approach helped me understand subjects in a much better way. I feel more confident about my studies now!",
    rating: 5
  },
  {
    name: "Vikram Singh",
    image: imgVikram,
    testimonial: "Shreeji Coaching has a perfect environment for studying. The doubt-solving sessions were very helpful.",
    rating: 4
  },
  {
    name: "Ananya Desai",
    image: imgAnanya,
    testimonial: "I highly recommend Shreeji Coaching for anyone looking for guidance in their studies. Their methods are top-notch.",
    rating: 5
  },
  {
    name: "Madhav Mehta",
    image: imgMadhav,
    testimonial: "The classes here are very interactive, and the teachers make learning fun. I look forward to every session.",
    rating: 4
  },
  {
    name: "Aisha Khan",
    image: imgAisha,
    testimonial: "Best coaching center ever! They go the extra mile to ensure we understand everything clearly.",
    rating: 5
  }
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, 
    arrows: false,
    fade: true,

  };

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Geometric Shapes 
      <div className="absolute top-0 left-0 w-32 h-32 bg-green opacity-30 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange opacity-30 rounded-full blur-2xl"></div>
      */}








      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          What Our Students Say
        </h2>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index} className="p-10 bg-white shadow-lg rounded-lg text-center relative">
              <FaQuoteLeft className="text-5xl text-gray-400 absolute -top-6 left-6 opacity-60" />
              <p className="text-lg text-gray-700 italic">"{t.testimonial}"</p>
              <div className="mt-6 flex flex-col items-center">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md"
                />
                <h3 className="mt-3 text-xl font-semibold text-gray-900">{t.name}</h3>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xl ${i < t.rating ? "text-orange" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
