import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { currentUserId, role } from '@/lib/auth';
import { ETableType } from '@/lib/enums';
import prisma from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/settings';
import { SearchParams } from '@/lib/types';
import { Announcement, Class, Prisma } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

type AnnouncementList = Announcement & { class: Class };

interface Props {
  searchParams: SearchParams;
}

const columns = [
  {
    header: 'Title',
    accessor: 'title',
  },
  {
    header: 'Class',
    accessor: 'class',
  },
  {
    header: 'Date',
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  ...(role === 'admin'
    ? [
        {
          header: 'Actions',
          accessor: 'action',
        },
      ]
    : []),
];

const renderRow = (item: AnnouncementList) => (
  <tr
    key={item.id}
    className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight'
  >
    <td className='flex items-center gap-4 p-4'>{item.title}</td>
    <td>{item.class?.name || '-'}</td>
    <td className='hidden md:table-cell'>
      {new Intl.DateTimeFormat('en-US').format(item.date)}
    </td>
    <td>
      <div className='flex items-center gap-2'>
        {role === 'admin' && (
          <>
            {/* <button className='w-7 h-7 flex items-center justify-center rounded-full bg-sky'>
              <Image src='/update.png' alt='' width={16} height={16} />
            </button> */}
            {/* <button className='w-7 h-7 flex items-center justify-center rounded-full bg-purple'>
              <Image src='/delete.png' alt='' width={16} height={16} />
            </button> */}
            <FormContainer
              table={ETableType.announcement}
              type='update'
              data={item}
            />
            <FormContainer
              table={ETableType.announcement}
              type='delete'
              id={item.id}
            />
          </>
        )}
      </div>
    </td>
  </tr>
);

export default async function AnnouncementListPage({ searchParams }: Props) {
  const { page, ...queryParams } = searchParams;
  const pageNum = page ? +page : 1;

  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = {
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

  // ROLE Conditions

  const roleConditions = {
    teacher: {
      lessons: {
        some: {
          teacherId: currentUserId!,
        },
      },
    },
    student: {
      students: {
        some: {
          id: currentUserId!,
        },
      },
    },
    parent: {
      students: {
        some: {
          parentId: currentUserId!,
        },
      },
    },
  };

  query.OR = [
    {
      classId: null,
    },
    {
      class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];

  const [data, total] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNum - 1),
    }),
    prisma.announcement.count({
      where: query,
    }),
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>
          All Announcements
        </h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && (
              //   <button className='w-8 h-8 flex items-center justify-center rounded-full bg-yellow'>
              //     <Image src='/create.png' alt='' width={14} height={14} />
              //   </button>
              <FormContainer table={ETableType.announcement} type='create' />
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
