import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaRegHandshake } from "react-icons/fa";
import a1 from '../assets/img/about/2.png';
import hero1 from '../assets/img/hero/hero1.png';
import mission from '../assets/img/about/mission2.png'
import vision from '../assets/img/about/vision2.jpg'
//import b1 from '../assets/img/bg/bg1.jpg';
import bg from '../assets/img/about/hero.jpg'
import { toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import Priya from '../assets/img/teachers/Priya.jpg'
import Amit from '../assets/img/teachers/Amit.jpg'
import Rajesh from '../assets/img/teachers/Rajesh.jpg'
import Neha from '../assets/img/teachers/Neha.jpg'
import Vikram from '../assets/img/teachers/Vikram.jpg'
import Sushma from '../assets/img/teachers/Sushma.jpg'



const AboutUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enquiryMode, setEnquiryMode] = useState("call");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  const teamMembers = [
    { name: "Amit Sharma", role: "M.A. in English Literature", image: Amit },
    { name: "Priya Gupta", role: "M.Sc. in Physics", image: Priya },
    { name: "Rajesh Verma", role: "M.A. in History", image: Rajesh },
    { name: "Neha Patel", role: "B.Ed. in Mathematics", image: Neha },
    { name: "Vikram Singh", role: "M.A. in Political Science", image: Vikram },
    { name: "Sushma Reddy", role: "M.Sc. in Biology", image: Sushma },
  ];
  

  const totalMembers = teamMembers.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return (prevIndex + 1) % totalMembers;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [totalMembers]);

  const visibleMembers = [
    teamMembers[(currentIndex) % totalMembers],
    teamMembers[(currentIndex + 1) % totalMembers],
    teamMembers[(currentIndex + 2) % totalMembers],
  ];

  const handleModeChange = (event) => {
    setEnquiryMode(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inquiryData = {
      contactNumber,
      email,
      enquiryMode,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Inquiry submitted successfully!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting inquiry");
    }
  };

  return (
    <>
      {/* Hero*/}
      <section className="mt-28 relative h-[400px]">
        <img
          src={bg}
          alt="Educational Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white max-w-2xl leading-relaxed">
            "Education is the most powerful weapon which you can use to change
            the world."
          </h1>
        </div>
      </section>

      {/* About Us */}
      <section className="bg-white py-16 px-6 md:px-20">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="text-center md:text-left max-w-lg lg:pl-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">About Us</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              At Shreeji Classes, we are committed to shaping the future of students by providing quality education, personal attention, and a nurturing learning environment. Located in the heart of Vadodara, Gujarat, we specialize in empowering students to achieve academic excellence and personal growth.
            </p>
          </div>
          <div className="relative">
            <img
              src={a1}
              alt="Student"
              className="w-full max-w-md shadow-lg rounded-md"
            />
          </div>
        </div>
      </section>

      



      {/* Meet Our Team*/}
      <section className="bg-[#EDC988] py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Meet Our Team</h2>
          <p className="text-white text-lg mb-12">
            We're a creative design studio crafting standout brands and digital experiences. From logos to web design, our work combines strategy and artistry to bring your vision to life.
          </p>

          
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-1000 ease-in-out space-x-8 justify-center">
              
              {visibleMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 flex-shrink-0 w-full sm:w-1/3 md:w-1/4 lg:w-1/4 xl:w-1/5"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full w-32 h-32 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      
     {/* Our Mission and Vision  */}
<section className="bg-gray-50 py-16 px-8">
  <div className="container mx-auto">
    {/* Mission */}
    <div className="flex flex-col lg:flex-row items-center mb-16">
     
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <img
          src={mission}
          alt="Mission Illustration"
          className="w-full max-w-sm mx-auto lg:mx-0"
        />
      </div>
     
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
          To provide quality education and personalized learning experiences
          that enable students to excel academically, grow holistically, and
          achieve their career aspirations.
        </p>
      </div>
    </div>

    {/* Vision Section */}
    <div className="flex flex-col lg:flex-row-reverse items-center">
      <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
        <img
          src={vision}
          alt="Vision Illustration"
          className="w-full max-w-sm mx-auto lg:mx-0"
        />
      </div>
      
      <div className="w-full lg:w-1/2 text-center lg:text-left lg:pl-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Vision</h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
          To become a leading educational institution recognized for delivering
          top-tier education, fostering curiosity, and developing lifelong
          learners who can thrive in a competitive world.
        </p>
      </div>
    </div>
  </div>
</section>




      {/* Enquiry Form */}
      <section id="enquiryform" className="section-sm lg:section-lg bg-green min-h-[120px]">
        <div className="container mx-auto">
          <div className="border-[8px] border-[#EDC988] rounded-lg text-center p-8">
            <h4 className="text-[26px] text-white font-bold mb-[14px]">Enquire Now for Admission</h4>
            <p className="text-[#D4B46A] mb-12">
              Have any questions? Let us know your preferred mode of enquiry and we'll get back to you.
            </p>

            <form
              className="max-w-[752px] mx-auto relative flex flex-col lg:flex-wrap gap-y-6 gap-x-4"
              onSubmit={handleSubmit}
            >
              <div className="w-full flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 lg:justify-between">
                <div className="relative w-full lg:w-[48%] flex">
                  <div
                    className="absolute left-2 h-full w-12 flex justify-center items-center text-2xl text-[#D4B46A]"
                  >
                    <FaPhone style={{ transform: 'scaleX(-1)' }} />
                  </div>
                  <input
                    className="form-control w-full border border-[#D4B46A] bg-transparent outline-none placeholder:text-[#D4B46A] text-white pl-[60px]"
                    placeholder="Enter your contact number"
                    type="tel"
                    name="contactNumber"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>

                <div className="relative w-full lg:w-[48%] flex">
                  <div className="absolute left-2 h-full w-12 flex justify-center items-center text-2xl text-[#D4B46A]">
                    <FaEnvelope />
                  </div>
                  <input
                    className="form-control w-full border border-[#D4B46A] bg-transparent outline-none placeholder:text-[#D4B46A] text-white pl-[60px]"
                    placeholder="Enter your email address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full text-center">
                <div className="text-white mb-4">Preferred Mode of Enquiry:</div>
                <div className="flex justify-center gap-6 flex-wrap">
                  <label className="flex items-center text-white gap-2">
                    <input
                      type="radio"
                      name="enquiryMode"
                      value="call"
                      checked={enquiryMode === "call"}
                      onChange={handleModeChange}
                    />
                    <FaPhone style={{ transform: "scaleX(-1)" }} /> Call
                  </label>
                  <label className="flex items-center text-white gap-2">
                    <input
                      type="radio"
                      name="enquiryMode"
                      value="email"
                      checked={enquiryMode === "email"}
                      onChange={handleModeChange}
                    />
                    <FaEnvelope /> Email
                  </label>
                  <label className="flex items-center text-white gap-2">
                    <input
                      type="radio"
                      name="enquiryMode"
                      value="in-person"
                      checked={enquiryMode === "in-person"}
                      onChange={handleModeChange}
                    />
                    <FaRegHandshake /> In-person
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="text-white bg-[#D4B46A] px-12 py-4 mt-8 rounded-full"
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />

    </>
  );
};

export default AboutUs;
