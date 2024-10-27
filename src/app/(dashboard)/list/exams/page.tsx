import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { currentUserId, role } from '@/lib/auth';
import { ETableType } from '@/lib/enums';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { SearchParams } from '@/lib/types';
import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

type ExamList = Exam & {
  lesson: {
    teacher: Teacher;
    class: Class;
    subject: Subject;
  };
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
    header: 'Class',
    accessor: 'class',
  },
  {
    header: 'Teacher',
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Date',
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  ...(role === 'admin' || role === 'teacher'
    ? [
        {
          header: 'Actions',
          accessor: 'action',
        },
      ]
    : []),
];

const renderRow = (item: ExamList) => (
  <tr
    key={item.id}
    className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'
  >
    <td className='flex items-center gap-4 p-4'>{item.lesson.subject.name}</td>
    <td>{item.lesson.class.name}</td>
    <td className='hidden md:table-cell'>{`${item.lesson.teacher.name} ${item.lesson.teacher.surname}`}</td>
    <td className='hidden md:table-cell'>
      {new Intl.DateTimeFormat('en-US').format(item.startTime)}
    </td>
    <td>
      <div className='flex items-center gap-2'>
        {(role === 'admin' || role === 'teacher') && (
          <>
            {/* <button className='w-7 h-7 flex items-center justify-center rounded-full bg-sky'>
              <Image src='/update.png' alt='' width={16} height={16} />
            </button> */}
            {/* <button className='w-7 h-7 flex items-center justify-center rounded-full bg-purple'>
              <Image src='/delete.png' alt='' width={16} height={16} />
            </button> */}
            <FormContainer table={ETableType.exam} type='update' data={item} />
            <FormContainer table={ETableType.exam} type='delete' id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

export default async function ExamListPage({ searchParams }: Props) {
  const { page, ...queryParams } = searchParams;
  const pageNum = page ? +page : 1;

  const query: Prisma.ExamWhereInput = {};
  query.lesson = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'teacherId':
            query.lesson.teacherId = value;
            break;
          case 'classId':
            query.lesson.classId = +value;
            break;
          case 'search':
            query.lesson.subject = {
              name: {
                contains: value,
                mode: 'insensitive',
              },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE Conditions
  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.lesson.teacherId = currentUserId!;
      break;
    case 'student':
      query.lesson.class = {
        students: {
          some: {
            id: currentUserId!,
          },
        },
      };
    case 'parent':
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      break;
    default:
      break;
  }

  const [data, total] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNum - 1),
    }),
    prisma.exam.count({
      where: query,
    }),
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Exams</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {(role === 'admin' || role === 'teacher') && (
              //   <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              //     <Image src='/create.png' alt='' width={14} height={14} />
              //   </button>
              <FormContainer table={ETableType.exam} type='create' />
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
