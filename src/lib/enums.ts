export enum ETableType {
  teacher = 'teacher',
  student = 'student',
  parent = 'parent',
  subject = 'subject',
  class = 'class',
  lesson = 'lesson',
  exam = 'exam',
  assignment = 'assignment',
  result = 'result',
  attendance = 'attendance',
  event = 'event',
  announcement = 'announcement',
}

export type RoleType = 'admin' | 'student' | 'teacher' | 'parent';
