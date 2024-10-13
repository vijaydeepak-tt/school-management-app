import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { subjectsData, userRole } from '@/lib/data';
import { ETableType } from '@/lib/enums';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { SearchParams } from '@/lib/types';
import { Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

type SubjectList = Subject & { teachers: Teacher[] };

const columns = [
  {
    header: 'Subject Name',
    accessor: 'name',
  },
  {
    header: 'Teachers',
    accessor: 'teachers',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

interface Props {
  searchParams: SearchParams;
}

const renderRow = (item: SubjectList) => (
  <tr
    key={item.id}
    className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'
  >
    <td className='flex items-center gap-4 p-4'>{item.name}</td>
    <td className='hidden md:table-cell'>
      {item.teachers.map((t) => t.name).join(',')}
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
            <FormModal table={ETableType.subject} type='update' data={item} />
            <FormModal table={ETableType.subject} type='delete' id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

export default async function SubjectListPage({ searchParams }: Props) {
  const { page, ...queryParams } = searchParams;
  const pageNum = page ? +page : 1;

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.name = {
              contains: value,
              mode: 'insensitive',
            };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, total] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNum - 1),
    }),
    prisma.subject.count({
      where: query,
    }),
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Subjects</h1>
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
              <FormModal table={ETableType.subject} type='create' />
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
