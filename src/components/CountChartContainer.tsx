import Image from 'next/image';
import React from 'react';
import CountChart from './CountChart';
import prisma from '@/lib/prisma';
import { calculatePercent } from '@/lib/utils';

export default async function CountChartContainer() {
  const data = await prisma.student.groupBy({
    by: ['gender'],
    _count: true,
  });

  const boys = data.find((d) => d.gender === 'MALE')?._count || 0;
  const girls = data.find((d) => d.gender === 'FEMALE')?._count || 0;
  const total = boys + girls;

  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      {/* TITLE */}
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Students</h1>
        <Image src='/moreDark.png' alt='' width={20} height={20} />
      </div>
      {/* CHART */}
      <CountChart girls={girls} boys={boys} />
      {/* BOTTOM */}
      <div className='flex justify-center gap-16'>
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-sky rounded-full' />
          <h1 className='font-bold'>{boys}</h1>
          <h2 className='text-xs text-gray-300'>
            Boys ({calculatePercent(boys, total)}%)
          </h2>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-yellow rounded-full' />
          <h1 className='font-bold'>{girls}</h1>
          <h2 className='text-xs text-gray-300'>
            Girls ({calculatePercent(girls, total)}%)
          </h2>
        </div>
      </div>
    </div>
  );
}
