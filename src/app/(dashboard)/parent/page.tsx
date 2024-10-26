import Announcements from '@/components/Announcements';
import BigCalendar from '@/components/BigCalendar';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import { currentUserId } from '@/lib/auth';
import prisma from '@/lib/prisma';
import React from 'react';

export default async function ParentPage() {
  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });

  return (
    <div className='p-4 flex gap-4 flex-col xl:flex-row flex-1'>
      {/* Left */}
      {students.map((student) => (
        <div className='w-full xl:w-2/3' key={student.id}>
          <div className='h-full bg-white p-4 rounded-md'>
            <h1 className='text-xl font-semibold'>
              Schedule ({student.name + ' ' + student.surname})
            </h1>
            <BigCalendarContainer type='classId' id={student.classId} />
          </div>
        </div>
      ))}
      {/* Right */}
      <div className='w-full xl:w-1/3 flex flex-col gap-8'>
        <Announcements />
      </div>
    </div>
  );
}
