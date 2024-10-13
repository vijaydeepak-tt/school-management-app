'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';

const schema = z.object({
  name: z.string(),
  student: z.string().min(1, { message: 'Student name is required!' }),
  score: z.number().min(1, { message: 'Score is required!' }),
  teacher: z.string().min(1, { message: 'Teacher name is required!' }),
  class: z.string().min(1, { message: 'Class is required!' }),
  date: z.date({ message: 'Date is required!' }),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className='flex flex-col gap-8' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>Create a new Result</h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Subject name'
          name='name'
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label='Student name'
          name='student'
          defaultValue={data?.student}
          register={register}
          error={errors?.student}
        />
        <InputField
          label='Score'
          name='score'
          type='number'
          defaultValue={data?.score}
          register={register}
          error={errors?.score}
        />
        <InputField
          label='Teacher name'
          name='teacher'
          defaultValue={data?.teacher}
          register={register}
          error={errors?.teacher}
        />
        <InputField
          label='Class'
          name='class'
          defaultValue={data?.class}
          register={register}
          error={errors?.class}
        />
        <InputField
          label='Date'
          name='date'
          defaultValue={data?.date}
          register={register}
          error={errors.date}
          type='date'
        />
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ResultForm;
