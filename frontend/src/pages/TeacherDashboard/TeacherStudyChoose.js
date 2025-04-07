import { useState } from "react";
import TeacherStudyMaterial from "./TeacherStudyMaterial";
import TeacherQuizzes from "./TeacherQuizzes";
import s1 from "../../assets/img/studymaterial/studyresources.jpeg";
import s2 from "../../assets/img/studymaterial/quiz.jpg";

const TeacherStudyChoose = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 pt-12">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">
        What would you like to upload today?
      </h1>

      {!selectedComponent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white shadow-lg rounded-lg max-w-4xl">
          {/* Study Material Box */}
          <div
            className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105"
            onClick={() => setSelectedComponent("studyMaterial")}
          >
            <img src={s1} alt="Study Material" className="w-40 h-40 mb-3 rounded-md object-cover" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">Study Material</h2>
          </div>

          {/* Quiz Box */}
          <div
            className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105"
            onClick={() => setSelectedComponent("quiz")}
          >
            <img src={s2} alt="Quiz" className="w-40 h-40 mb-3 rounded-md object-cover" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">Quiz</h2>
          </div>
        </div>
      ) : selectedComponent === "studyMaterial" ? (
        <TeacherStudyMaterial />
      ) : (
        <TeacherQuizzes />
      )}
    </div>
  );
};

export default TeacherStudyChoose;
