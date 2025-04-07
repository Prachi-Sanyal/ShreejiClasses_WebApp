import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import blogsData from './BlogData'; 
import { FaArrowRight, FaFilter } from "react-icons/fa"; 
import { MdTune } from "react-icons/md";
import BlogData from './BlogData';



const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredBlogs, setFilteredBlogs] = useState(BlogData);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBlogs(BlogData);
    } else {
      const filtered = BlogData.filter(blog => blog.category === selectedCategory);
      setFilteredBlogs(filtered);
    }
  }, [selectedCategory]);

  return (
    <div className="mt-32 container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold text-center mb-8 text-black">Shreeji Classes Blogs</h1>

      <div className="flex justify-center mb-8 space-x-4">
      <span className="text-lg font-medium text-gray-700 flex items-center">
          <MdTune className="mr-2 text-xl" /> 
        </span>
        <button
          onClick={() => setSelectedCategory('All')}
          className="bg-orange-100 text-black px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          All
        </button>
        <button
          onClick={() => setSelectedCategory('JEE/NEET')}
          className="bg-orange-100 text-black px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          JEE/NEET
        </button>
        <button
          onClick={() => setSelectedCategory('Grade 11-12 Science')}
          className="bg-orange-100 text-black px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Grade 11-12 Science
        </button>
        <button
          onClick={() => setSelectedCategory('Soft Olympiad')}
          className="bg-orange-100 text-black px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Soft Olympiad
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-40 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-2xl font-semibold text-black">{blog.title}</h2>
            <p className="text-gray-600 mt-2">{blog.brief}</p>
            <Link
              to={`/blogs/${blog.id}`} 
              className="flex items-center justify-center bg-pink-100 text-black px-4 py-2 rounded-md hover:bg-pink-200 transition w-full mt-4"
              >
              Read More <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
