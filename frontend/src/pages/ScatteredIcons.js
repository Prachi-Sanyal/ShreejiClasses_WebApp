import React from 'react';
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaFlask, FaLaptop, FaPen, FaBrain, FaCalculator, FaSchool, FaLanguage } from 'react-icons/fa';

const ScatteredIcons = ({ iconCount = 15, size = "3xl", opacity = 50 }) => {
  const icons = [
    <FaGraduationCap />,
    <FaBook />,
    <FaChalkboardTeacher />,
    <FaFlask />,
    <FaLaptop />,
    <FaPen />,
    <FaBrain />,
    <FaCalculator />,
    <FaSchool />,
    <FaLanguage />
  ];

  const getRandomPosition = () => {
    const x = Math.random() * 90 + '%'; 
    const y = Math.random() * 90 + '%'; 
    return { left: x, top: y };
  };

  return (
    <>
      {Array.from({ length: iconCount }).map((_, index) => {
        const randomPosition = getRandomPosition();
        return (
          <div
            key={index}
            className={`absolute text-gray-400 text-${size} opacity-${opacity}`}
            style={{
              left: randomPosition.left,
              top: randomPosition.top,
              transform: `rotate(${Math.random() * 360}deg)` 
            }}
          >
            {icons[index % icons.length]}
          </div>
        );
      })}
    </>
  );
};

export default ScatteredIcons;
