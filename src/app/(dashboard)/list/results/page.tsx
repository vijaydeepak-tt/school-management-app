import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { resultsData, userRole } from '@/lib/data';
import { ETableType } from '@/lib/enums';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { SearchParams } from '@/lib/types';
import { Exam, Prisma, Result, Student } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurName: string;
  teacherName: string;
  teacherSurName: string;
  score: number;
  className: string;
  startTime: Date;
};

interface Props {
  searchParams: SearchParams;
}

const columns = [
  {
    header: 'Subject Name',
    accessor: 'name',
  },
  {
    header: 'Student',
    accessor: 'student',
  },
  {
    header: 'Score',
    accessor: 'score',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Teacher',
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Class',
    accessor: 'class',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Date',
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

const renderRow = (item: ResultList) => (
  <tr
    key={item.id}
    className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'
  >
    <td className='flex items-center gap-4 p-4'>{item.title}</td>
    <td>{`${item.studentName} ${item.studentSurName}`}</td>
    <td className='hidden md:table-cell'>{item.score}</td>
    <td className='hidden md:table-cell'>{`${item.teacherName} ${item.teacherSurName}`}</td>
    <td className='hidden md:table-cell'>{item.className}</td>
    <td className='hidden md:table-cell'>
      {new Intl.DateTimeFormat('en-US').format(item.startTime)}
    </td>
    <td>
      <div className='flex items-center gap-2'>
        {userRole === 'admin' && (
          <>
            {/* <button className='w-7 h-7 flex items-center justify-center rounded-full bg-sky'>
              <Image src='/update.png' alt='' width={16} height={16} />
            </button> */}
            {/* <button className='w-7 h-7 flex items-center justify-center rounded-full bg-purple'>
              <Image src='/delete.png' alt='' width={16} height={16} />
            </button> */}
            <FormModal table={ETableType.result} type='update' data={item} />
            <FormModal table={ETableType.result} type='delete' id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

export default async function ResultListPage({ searchParams }: Props) {
  const { page, ...queryParams } = searchParams;
  const pageNum = page ? +page : 1;

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.studentId = value;
            break;
          case 'search':
            query.OR = [
              {
                exam: {
                  title: {
                    contains: value,
                    mode: 'insensitive',
                  },
                },
              },
              {
                student: {
                  name: {
                    contains: value,
                    mode: 'insensitive',
                  },
                },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [dataRes, total] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNum - 1),
    }),
    prisma.result.count({
      where: query,
    }),
  ]);

  const data = dataRes.map((d) => {
    const assignment = d.exam || d.assignment;
    if (!assignment) return null;

    const isExam = 'startTime' in assignment;

    return {
      id: d.id,
      title: assignment.title,
      studentName: d.student.name,
      studentSurName: d.student.surname,
      teacherName: assignment.lesson.teacher.name,
      teacherSurName: assignment.lesson.teacher.surname,
      score: d.score,
      className: assignment.lesson.class.name,
      startTime: isExam ? assignment.startTime : assignment.startDate,
    };
  });

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Results</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {userRole === 'admin' && (
              //   <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              //     <Image src='/create.png' alt='' width={14} height={14} />
              //   </button>
              <FormModal table={ETableType.teacher} type='create' />
            )}
          </div>
        </div>
      </div>
      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={pageNum} total={total} />
    </div>
  );
}
