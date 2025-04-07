import React, { useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { Link } from 'react-router-dom'; 

const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer text-4xl text-heading ml-[10px] lg:hidden"
      >
        <BiMenu />
      </div>
      <ul
        className={`${
          isOpen ? 'max-h-[300px] p-8' : 'max-h-0 p-0'
        } flex flex-col absolute w-full bg-white top-24 left-0 shadow-primary space-y-6 overflow-y-auto transition-all`}
        style={{
          scrollbarWidth: 'thin', 
          scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent', 
        }}
      >
        
        <li className="py-2 px-4">
          <Link to="/">Home</Link>
        </li>
        <li className="py-2 px-4">
          <Link to="/about">About Us</Link>
        </li>
        <li className="py-2 px-4">
          <Link to="/coursefrontend">Courses</Link>
        </li>
        
        <li className="py-2 px-4">
          <Link to="/blogs">Blogs</Link>
        </li>
        <li className="py-2 px-4">
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavMobile;
