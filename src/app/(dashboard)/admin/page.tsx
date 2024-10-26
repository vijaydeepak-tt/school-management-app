import Announcements from '@/components/Announcements';
import AttendanceChartContainer from '@/components/AttendanceChartContainer';
import CountChartContainer from '@/components/CountChartContainer';
import EventCalendar from '@/components/EventCalendar';
import EventCalendarContainer from '@/components/EventCalendarContainer';
import FinanceChart from '@/components/FinanceChart';
import UserCard from '@/components/UserCard';
import React from 'react';

export default function AdminPage({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* Left */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='admin' />
          <UserCard type='teacher' />
          <UserCard type='student' />
          <UserCard type='parent' />
        </div>
        {/* Middle charts */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* Count charts */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChartContainer />
          </div>
          {/* attendance charts */}
          <div className='w-full lg:w-2/3  h-[450px]'>
            <AttendanceChartContainer />
          </div>
        </div>
        {/* Bottom charts */}
        <div className='w-full h-[450px]'>
          <FinanceChart />
        </div>
      </div>
      {/* Right */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
}
