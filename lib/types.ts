
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  subject: Subject | 'General';
}

export type Subject =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'English'
  | 'Class 6 Bangla 1st Paper'
  | 'Class 6 Bangla 2nd Paper'
  | 'Class 6 English 2nd Paper'
  | 'Class 6 ICT'
  | 'Class 6 Math'
  | 'Class 6 Science'
  | 'Class 7 Bangla 1st Paper'
  | 'Class 7 Bangla 2nd Paper'
  | 'Class 7 English 2nd Paper'
  | 'Class 7 ICT'
  | 'Class 7 Bangladesh And Global Studies';

export interface SubjectInfo {
  name: Subject;
  icon: string;
  color: string;
  description: string;
}
