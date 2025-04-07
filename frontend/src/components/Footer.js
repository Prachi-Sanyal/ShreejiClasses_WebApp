import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/img/logo.png';
import { FaInstagram, FaFacebook, FaMailBulk, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();

  const handleFAQ = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-pink-100 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between">
          
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            <img src={Logo} alt="Logo" className="mb-4 h-48 lg:h-50" />
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              Our experienced instructors will guide you through structured lessons, helping you to 
              develop a solid foundation while nurturing your creativity and musical expression.
            </p>
            <div className="flex gap-4 mt-4">
              <a className="text-pink-500 text-xl">
                <FaFacebook />
              </a>
              <a className="text-pink-500 text-xl">
                <FaInstagram />
              </a>
              <a href="mailto:shreejiclasses.vadodara@gmail.com" className="text-pink-500 text-xl">
                <FaMailBulk />
              </a>
            </div>
            <div className="flex flex-col items-start gap-2 mt-6 text-pink-500 text-xl">
              <div className="flex items-center gap-2">
                <FaPhone style={{ transform: 'scaleX(-1)' }} />
                <span className="text-gray-700 text-sm">+91 96876 21805</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span className="text-gray-700 text-sm">FF 11-14,Dream Aatman2, Opp. Billabong School, Vadsar, Vadodara-390010
                </span>
              </div>
            </div>
          </div>

          
          <div className="lg:w-1/2 flex flex-col lg:flex-row gap-10 justify-end mt-10"> 
            <div>
              <h5 className="font-bold text-pink-500 mb-2">Courses</h5>
              <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/coursefrontend" className="hover:text-pink-500">Grade 6-10</Link></li>
                <li><Link to="/coursefrontend" className="hover:text-pink-500">Grade 11-12 Science</Link></li>
                <li><Link to="/coursefrontend" className="hover:text-pink-500">GUJCET/JEE/NEET</Link></li>
                <li><Link to="/coursefrontend" className="hover:text-pink-500">SOF Olympiad</Link></li>
              </ul>
              
            </div>
            <div>
              <h5 className="font-bold text-pink-500 mb-2">Support</h5>
              <ul className="space-y-2 text-sm text-gray-700">
              <li><button onClick={handleFAQ} className="hover:text-pink-500">FAQs</button></li> {/* FAQ button */}
              <li><Link to="/contact" className="hover:text-pink-500">Contact</Link></li>  {/* Link to Contact */}
                
              </ul>
            </div>
          </div>
        </div>

        
        <div className="mt-10 text-center text-sm text-gray-700">
          <p>&copy; 2025 Shreeji Classes. All Rights Reserved.</p>
          <p>Developed by Prachi Sanyal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
