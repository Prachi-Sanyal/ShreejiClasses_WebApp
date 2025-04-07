import React from 'react';
import { useParams } from 'react-router-dom';
import courses from './CourseData'; 

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = courses.find((course) => course.id === courseId); 

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <section className="mt-32 py-16 px-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">{course.title}</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          <div className="lg:w-1/2">
            <p className="text-lg text-gray-600 mb-4">{course.detailedDescription}</p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Duration: {course.duration}</h3>
            <p className="text-lg text-gray-600 mb-4">Eligibility: {course.eligibility}</p>
            <p className="text-lg text-gray-600 mb-4">Batch Days: {course.batchDays}</p>
            <p className="text-lg text-gray-600 mb-4">Boards: {course.boards}</p>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Subjects:</h4>
            <ul className="list-disc pl-5">
              {course.courseDetails.subjects.map((subject, index) => (
                <li key={index} className="text-gray-600">{subject}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetail;
