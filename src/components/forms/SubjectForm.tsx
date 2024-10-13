'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';

const schema = z.object({
  subject: z.string().min(3, { message: 'subject name is required!' }),
  teachers: z
    .string()
    .min(6, { message: 'teachers Name must be at least 8 characters long!' }),
});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({
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
      <h1 className='text-xl font-semibold'>Create a new subject</h1>
      <span className='text-xs text-gray-400 font-medium'>
        Subject information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='subject Name'
          name='subject'
          type='subject'
          defaultValue={data?.name}
          register={register}
          error={errors?.subject}
        />
        <InputField
          label='Teacher Name'
          name='teachers'
          type='teachers'
          defaultValue={data?.teachers}
          register={register}
          error={errors?.teachers}
        />
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default SubjectForm;
