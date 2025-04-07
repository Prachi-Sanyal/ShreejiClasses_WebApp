import React from "react";

const CoursesTable = ({
  courses,
  setCourses,
  setEditCourse,
  courseName,
  setCourseName,
  courseDescription,
  setCourseDescription,
}) => {
  return (
    <div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Course Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="border border-gray-300 px-4 py-2">{course.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {course.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="text-blue-500"
                  onClick={() => setEditCourse(course)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 ml-2"
                  onClick={() =>
                    setCourses((prev) =>
                      prev.filter((c) => c.id !== course.id)
                    )
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h2>Add/Edit Course</h2>
        <input
          className="border border-gray-300 px-2 py-1 mr-2"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Course Name"
        />
        <input
          className="border border-gray-300 px-2 py-1 mr-2"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          placeholder="Description"
        />
        <button className="bg-blue-500 text-white px-4 py-2">Save</button>
      </div>
    </div>
  );
};

export default CoursesTable;
