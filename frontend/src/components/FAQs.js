import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import faqs from '../q-a'; 
import b1 from '../assets/img/bg/bg4.jpg';

const FAQs = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All"); 

  const toggleAnswer = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredFAQs = activeCategory === "All" ? faqs : faqs.filter(faq => faq.category === activeCategory);

  return (
    <>
      
      <div id="faq-section" className="max-w-4xl mx-auto p-6 mt-14 mb-12">
        <h1 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h1>

        
        <div className="flex justify-center items-center mb-6 space-x-4 sm:space-x-1">
          {["All", "Facilities", "Admission", "Course Details"].map((category) => (
            <div
              key={category}
              className={`px-6 py-2 sm:px-4 sm:py-1 text-center rounded-lg border sm:text-s transition-all duration-300 ease-in-out cursor-pointer ${
                activeCategory === category
                  ? "bg-orange text-white scale-105 border-orange-500 shadow-md" 
                  : "bg-white text-orange-500 hover:bg-orange-100 hover:scale-105"
              }`}
              onClick={() => setActiveCategory(category)} 
            >
              {category}
            </div>
          ))}
        </div>

        
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="border-b shadow-sm p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <h2 className="text-lg font-medium">{faq.question}</h2>
                {expandedIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>
              {expandedIndex === index && (
                <p className="mt-2 text-black">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQs;
