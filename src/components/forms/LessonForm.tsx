'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';

const schema = z.object({
  subject: z.string().min(3, { message: 'subject name is required!' }),
  class: z.string().min(1, { message: 'class name is required!' }),
  teacher: z
    .string()
    .min(6, { message: 'teacher Name must be at least 8 characters long!' }),
});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({
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
      <h1 className='text-xl font-semibold'>Add a new Lesson</h1>
      <span className='text-xs text-gray-400 font-medium'>
        Authentication Information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Subject Name'
          name='subjectName'
          defaultValue={data?.subject}
          register={register}
          error={errors?.subject}
        />
        <InputField
          label='Class'
          name='class'
          defaultValue={data?.class}
          register={register}
          error={errors?.class}
        />
        <InputField
          label='Teacher Name'
          name='teacher'
          type='text'
          defaultValue={data?.teacher}
          register={register}
          error={errors?.teacher}
        />
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default LessonForm;
