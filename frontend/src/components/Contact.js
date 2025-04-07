import React, { useRef, useState } from 'react';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_hpedi6q', // Replace with your EmailJS Service ID
      'template_v265q56', // Replace with your EmailJS Template ID
      form.current,
      'YF3xurl1OgxRMtyOS' // Replace with your EmailJS Public Key
    )
    .then((result) => {
      console.log(result.text);
      toast.success("Message sent successfully!");
      form.current.reset(); // Reset form fields after submission
    }, (error) => {
      console.error(error.text);
      toast.error("Failed to send message. Try again!");
    });
  };

  return (
    <section className='section-sm lg:pt-[250px]'>
      <div className="container mx-auto">
        <div className='flex flex-col lg:flex-row lg:gap-x-[74px] bg-contact bg-no-repeat bg-cover min-h-[500px]'>

          <div className='flex-1 flex flex-col justify-center pl-8'>
            <h2 className='h2 mb-3 lg:mb-5 text-lg lg:text-2xl'>Get in Touch With Us</h2>
            <p className='mb-5 lg:mb-7 text-sm lg:text-base'>
              Reach out to us for any questions you have. We're committed to providing you with the best educational coaching and support to help you excel.
            </p>

            <div className="flex items-center gap-2 text-sm lg:text-base mb-3">
              <FaPhone className="text-lg" style={{ transform: 'scaleX(-1)' }} />
              <span className="text-gray-700">+91 96876 21805</span>
            </div>
            <div className="flex items-center gap-2 text-sm lg:text-base">
              <FaMapMarkerAlt className="text-lg" />
              <span className="text-gray-700">FF 11-14, Dream Aatman2, Opp. Billabong School, Vadsar, Vadodara-390010</span>
            </div>
          </div>

          <form ref={form} onSubmit={sendEmail} className='flex-1 bg-white shadow-primary rounded-[20px] p-5 lg:p-10 flex flex-col gap-y-5 max-h-[500px] lg:-mt-20'>
            <input className='form-control' placeholder='First name' type="text" name='user_firstname' required />
            <input className='form-control' placeholder='Last name' type="text" name='user_lastname' required />
            <input className='form-control' placeholder='Email address' type='email' name='user_email' required />
            <textarea className='form-control py-5 h-[135px] resize-none' placeholder='Message' name='user_message' required></textarea>
            <button className='btn btn-lg btn-orange' type='submit'>Send Message</button>
          </form>

        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </section>
  );
};

export default Contact;




{/*
  
  import React, { useState, useEffect, useRef } from 'react';
import { FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  
  {/*
  {/*  ------ commented---------------------------
    const [message, setMessage] = useState(""); // State to store user notification
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  

  const sendEmail = (e) => {
    e.preventDefault(); 

    emailjs.sendForm(
      'service_nv1atyp',     
      'YOUR_TEMPLATE_ID',    
      form.current,
      'YOUR_PUBLIC_KEY'      
    )
    .then(() => {
      setMessage("Your message has been sent successfully!");
      setMessageType("success");
      form.current.reset(); 
    })
    .catch(() => {
      setMessage("Oops! Something went wrong. Please try again.");
      setMessageType("error");
    });

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };
  

  // till here  -----------------------------------------

  return(
    <section className='section-sm lg:pt-[250px]'>
      <div className="container mx-auto">
        <div className='flex flex-col lg:flex-row lg:gap-x-[74px] bg-contact bg-no-repeat bg-cover min-h-[500px]'>

         
          <div className='flex-1 flex flex-col justify-center pl-8'>
            <h2 className='h2 mb-3 lg:mb-5 text-lg lg:text-2xl'>Get in Touch With Us</h2>
            <p className='mb-5 lg:mb-7 text-sm lg:text-base'>
            Reach out to us for any questions you have. We're committed to providing you with the best educational coaching and support to help you excel.        
                </p>

            
            <div className="flex items-center gap-2 text-sm lg:text-base mb-3">
              <FaPhone className="text-lg" style={{ transform: 'scaleX(-1)' }} />
              <span className="text-gray-700">+91 96876 21805</span>
            </div>
            <div className="flex items-center gap-2 text-sm lg:text-base">
              <FaMapMarkerAlt className="text-lg" />
              <span className="text-gray-700">FF 11-14,Dream Aatman2, Opp. Billabong School, Vadsar, Vadodara-390010
              </span>
            </div>

            
            
          </div>

          
          <form ref={form} className='flex-1 bg-white shadow-primary rounded-[20px] p-5 lg:p-10 flex flex-col gap-y-5 max-h-[500px] lg:-mt-20'>
            <input className='form-control' placeholder='First name' type="text" name='user_firstname' required />
            <input className='form-control' placeholder='Last name' type="text" name='user_lastname' required />
            <input className='form-control' placeholder='Email address' type='email' name='user_email' required />
            <textarea className='form-control py-5 h-[135px] resize-none' placeholder='Message' name='user_message'></textarea>
            <button className='btn btn-lg btn-orange' type='submit'>Send Message</button>
          
          // coment 
        
          {message && (
              <p className={`text-sm mt-3 ${messageType === "success" ? "text-green-500" : "text-red-500"}`}>
                {message}
              </p>
            )}
          

          // comment over

          </form>

        </div>
      </div>
    </section>
  )
};

export default Contact;

*/}
