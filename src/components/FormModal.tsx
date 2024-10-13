'use client';

import { ETableType } from '@/lib/enums';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import('./forms/StudentForm'), {
  loading: () => <h1>Loading...</h1>,
});

const LessonForm = dynamic(() => import('./forms/LessonForm'), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import('./forms/SubjectForm'), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import('./forms/ParentForm'), {
  loading: () => <h1>Loading...</h1>,
});
const ClassesForm = dynamic(() => import('./forms/ClassesForm'), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import('./forms/ExamForm'), {
  loading: () => <h1>Loading...</h1>,
});

type FormType = 'create' | 'update' | 'delete';

interface FormModalProps {
  table: ETableType;
  type: FormType;
  data?: any;
  id?: number | string;
}

const getBg = (type: FormType) => {
  switch (type) {
    case 'create':
      return 'bg-yellow';
    case 'update':
      return 'bg-sky';
    default:
      return 'bg-purple';
  }
};

const forms: {
  [key: string]: (type: 'create' | 'update', data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  lesson: (type, data) => <LessonForm type={type} data={data} />,
  subject: (type, data) => <SubjectForm type={type} data={data} />,
  parent: (type, data) => <ParentForm type={type} data={data} />,
  class: (type, data) => <ClassesForm type={type} data={data} />,
  exam: (type, data) => <ExamForm type={type} data={data} />,
};

export default function FormModal({ table, type, data, id }: FormModalProps) {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor = getBg(type);

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === 'delete' && id ? (
      <form action='' className='p-4 flex flex-col gap-4'>
        <span className='text-center font-medium'>
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className='bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center'>
          Delete
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table](type, data)
    ) : (
      'Form not found!'
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt='' width={16} height={16} />
      </button>
      {open && (
        <div className='w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>
            <Form />
            <div
              className='absolute top-4 right-4 cursor-pointer'
              onClick={() => setOpen(false)}
            >
              <Image src='/close.png' alt='' width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
