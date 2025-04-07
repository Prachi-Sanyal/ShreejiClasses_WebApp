import React from 'react';
import { Link } from 'react-router-dom'; 

const Nav = () => {
  return (
    <nav className='ml-[70px]'>
      <ul className='flex gap-x-[42px]'>
        
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <li>
          <Link to="/coursefrontend">Courses</Link>
        </li>
        
        <li>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
