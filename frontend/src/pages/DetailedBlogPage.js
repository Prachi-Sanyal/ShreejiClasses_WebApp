import React from 'react';
import { useParams } from 'react-router-dom';
import blogsData from './blogs.json';
import blogImage1 from '../assets/img/blogs/1.jpg';
import blogImage2 from '../assets/img/blogs/2.jpg';
import blogImage3 from '../assets/img/blogs/3.jpg';
import blogImage4 from '../assets/img/blogs/4.png';
import blogImage5 from '../assets/img/blogs/5.png';
import blogImage6 from '../assets/img/blogs/6.jpg';
import blogImage7 from '../assets/img/blogs/7.jpg';
import blogImage8 from '../assets/img/blogs/8.jpg';
import blogImage9 from '../assets/img/blogs/9.jpg';
import blogImage10 from '../assets/img/blogs/10.jpg';


const blogImages = {
  "1.jpg": blogImage1,
  "2.jpg": blogImage2,
  "3.jpg": blogImage3,
  "4.png": blogImage4,
  "5.png": blogImage5,
  "6.jpg": blogImage6,
  "7.jpg": blogImage7,
  "8.jpg": blogImage8,
  "9.jpg": blogImage9,
  "10.jpg": blogImage10
};




const DetailedBlogPage = () => {
  const { id } = useParams();
  const blog = blogsData.blogs.find((blog) => blog.id === parseInt(id));

  if (!blog) {
    return <div className="container mx-auto px-4 py-8 text-center text-xl">Blog not found</div>;
  }



  return (
    
    <div className="mt-32 container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold text-center mb-8 text-black">{blog.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <img
  src={blogImages[blog.image] || blogImages["1.jpg"]} 
  alt={blog.title}
          className="w-full h-80 object-cover rounded-t-lg mb-4"
        />
        <div className="text-gray-800 mt-4">
          <p>{blog.detailed_description}</p> 
        </div>
      </div>
    </div>
  );
};

export default DetailedBlogPage;
