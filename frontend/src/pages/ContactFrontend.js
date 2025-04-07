import React, { useState, useRef } from "react";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import Contact from '../components/Contact'
import contactImage from '../assets/img/contact/contact.jpg'

const ContactFrontend = () => {
  const [showForm, setShowForm] = useState(false);
  const form = useRef();

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <section className="py-16 bg-gray-100 mt-36">
      <div className="container mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex flex-col justify-center px-4 lg:px-0">
          <h2 className="text-2xl lg:text-4xl font-bold text-black mb-4">
            Get in Touch With Us
          </h2>
          <p className="text-sm lg:text-base text-gray-700 mb-6">
            Get in touch with us for any kind of help. We are here to give you
            the best and help you find your desired service or course.
          </p>

          <div className="flex items-center gap-3 text-sm lg:text-base mb-4">
            <FaPhone className="text-lg text-green" style={{ transform: 'scaleX(-1)' }} />
            <span className="text-gray-700">+91 96876 21805</span>
          </div>
          <div className="flex items-center gap-3 text-sm lg:text-base mb-4">
            <FaMapMarkerAlt className="text-lg text-green" />
            <span className="text-gray-700">FF 11-14,Dream Aatman2, Opp. Billabong School, Vadsar, Vadodara-390010</span>
          </div>
          <div className="flex items-center gap-3 text-sm lg:text-base">
            <FaEnvelope className="text-lg text-green" />
            <span className="text-gray-700">shreejiclasses.vadodara@gmail.com</span>
          </div>

          <button
            onClick={toggleForm}
            className="mt-6 px-6 py-3 bg-orange text-white font-semibold rounded-md hover:bg-green-600 w-fit"
          >
            {showForm ? "Hide Form" : "Send Message"}
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center">
    <img
      src={contactImage} 
      alt="Contact Us"
      className="w-full max-w-md rounded-lg shadow-lg"
    />
  </div>


        </div>

        <div className={`container mx-auto  transition-all duration-300 ${showForm ? "block" : "hidden"}`}>
  <Contact />
</div>

      
        <div className="mt-12 w-full bg-white shadow-md py-6 px-4 rounded-lg">
          

          <div className="mt-6">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0197084127993!2d144.96305841531695!3d-37.814107879751616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5779a94b9a7a097!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1638232173310!5m2!1sen!2sau"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      
    </section>
  );
};

export default ContactFrontend;
