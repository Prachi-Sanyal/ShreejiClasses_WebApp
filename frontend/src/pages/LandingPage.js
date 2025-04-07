import React from 'react';

import Aos from 'aos';
import 'aos/dist/aos.css';

import Hero from '../components/Hero';
import Cards from '../components/Cards';
import Courses from '../components/Courses';

import Contact from '../components/Contact';
import Features from '../components/Features';
import Footer from '../components/Footer';
import FAQs from '../components/FAQs';
import Testimonials from '../components/Testimonials';

const App = () => {
  Aos.init({
    duration:1800,
    offset:100,
  })
 return( <div className='overflow-hidden'>
    <Hero />
    <Cards />
    <Courses />
    <Features />
    <FAQs />
    <Testimonials />
   
    <Contact />
    
    </div>
)
};

export default App;
