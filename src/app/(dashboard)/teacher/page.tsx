import Announcements from '@/components/Announcements';
import BigCalendar from '@/components/BigCalendar';
import React from 'react';

export default function TeacherPage() {
  return (
    <div className='p-4 flex gap-4 flex-col xl:flex-row flex-1'>
      {/* Left */}
      <div className='w-full xl:w-2/3'>
        <div className='h-full bg-white p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* Right */}
      <div className='w-full xl:w-1/3 flex flex-col gap-8'>
        <Announcements />
      </div>
    </div>
  );
}
