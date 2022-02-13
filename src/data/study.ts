export type Subject = '국어' | '수학' | '영어' | '한국사' | '기타';
export const subjects: Subject[] = ['국어', '수학', '영어', '한국사', '기타'];
export const subjectColors: {[index in Subject]: string} = {
  국어: '#D3165E',
  수학: '#EF6825',
  영어: '#FFC108',
  한국사: '#009148',
  기타: '#00A4EC',
};
