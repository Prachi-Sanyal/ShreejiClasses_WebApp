import { BsCheck, BsChevronRight } from 'react-icons/bs';

import C1 from '../src/assets/img/courses/grade6-10.png';
import C2 from '../src/assets/img/courses/science.png';
import C3 from '../src/assets/img/courses/exam.jpg';
import C4 from '../src/assets/img/courses/olympiad.jpg'

export const navigation = [
  {
    name: 'Home',
    href: '#',
  },
  {
    name: 'About Us',
    href: '#',
  },
  {
    name: 'Services',
    href: '#',
  },
  {
    name: 'Gallery',
    href: '#',
  },
  {
    name: 'FAQs',
    href: '#',
  },
  {
    name: 'Contact',
    href: '#',
  },
];

export const facts = [
  {
    startNumber: '1',
    endNumber: '5',
    unit: '',
    title: 'Years of Experience',
    desc: 'We are 5 years of experienced in this yoga field. Giving the best instructions.',
  },
  {
    startNumber: '1',
    endNumber: '5',
    unit: 'K',
    title: 'Happy Clients',
    desc: 'We have over five thousand clients all over the world. They are very satisfied.',
  },
  {
    startNumber: '1',
    endNumber: '15',
    unit: '',
    title: 'Experienced Trainers',
    desc: 'We have over fifteen dedicated and experienced trainer for yoga and meditation.',
  },
  {
    startNumber: '1',
    endNumber: '24',
    unit: '',
    title: 'Monthly Classes',
    desc: 'Yoga is a physical, mental and spritual practice discipline. We provide 24+ classes monthly.',
  },
];

export const courses = [
  {
    image: C1,
    title: 'Grades 6-10',
    desc: "Comprehensive coaching for Grades 6-10, covering all major subjects. Our expert teachers build strong foundations and critical thinking skills, preparing students for exams and competitive tests.",
    delay: '600',
  },
  {
    image: C2,
    title: 'Grades 11-12: Science Stream',
    desc: "Specialized coaching for Science subjects (PCM & PCB), focusing on board exams and entrance tests. Concept clarity, in-depth learning, and targeted practice are our priorities.",
    link: 'Get started',
    delay: '800',
  },
  {
    image: C3,
    title: 'GUJCET/NEET/JEE Preparation',
    desc: "Expert coaching for competitive exams like GUJCET, NEET, and JEE. Focus on problem-solving, time management, mock tests, and personalized study materials to ensure exam success.",
    link: 'Get started',
    delay: '900',
  },
  {
    image: C4,
    title: 'SOF Olympiad Preparation',
    desc: "Coaching for SOF Olympiads, focusing on Mathematics, Science, and English. Build analytical skills through mock tests and rigorous practice for national and international competitions.",
    link: 'Get started',
    delay: '1000',
  },
];

export const pricing = [
  {
    title: 'Single yoga class',
    price: '$15.',
    list: [
      {
        icon: <BsCheck />,
        name: 'Pay as you go',
      },
      {
        icon: <BsCheck />,
        name: 'Perfect for non-residence',
      },
      {
        icon: <BsCheck />,
        name: 'Acces to all classes',
      },
    ],
    buttonText: 'Book now',
    buttonIcon: <BsChevronRight />,
    delay: '600',
  },
  {
    title: 'Single yoga class',
    price: '$60.',
    list: [
      {
        icon: <BsCheck />,
        name: 'Pay as you go',
      },
      {
        icon: <BsCheck />,
        name: 'Perfect for non-residence',
      },
      {
        icon: <BsCheck />,
        name: 'Acces to all classes',
      },
      {
        icon: <BsCheck />,
        name: 'Acces to all mentors',
      },
    ],
    buttonText: 'Book now',
    buttonIcon: <BsChevronRight />,
    delay: '800',
  },
  {
    title: 'Single yoga class',
    price: '$150.',
    list: [
      {
        icon: <BsCheck />,
        name: 'Pay as you go',
      },
      {
        icon: <BsCheck />,
        name: 'Perfect for non-residence',
      },
      {
        icon: <BsCheck />,
        name: 'Acces to all classes',
      },
      {
        icon: <BsCheck />,
        name: 'Acces to all mentors',
      },
    ],
    buttonText: 'Book now',
    buttonIcon: <BsChevronRight />,
    delay: '900',
  },
];
