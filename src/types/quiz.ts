export type QuestionType = 'multiple-choice' | 'ox' | 'short-answer' | 'descriptive';

export type ChapterId = 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7' | 'ch8';

export interface GradingCriteria {
  point: number;
  criteria: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: ChapterId;
  chapterTitle: string;
  topic: string; // e.g. "한계심도", "양입지 제한", "5극 3특 권역", "국토계획 승인권자"
  type: QuestionType;
  question: string;
  context?: string; // Optional code/law clause or scenario
  options?: string[]; // For multiple choice (4 or 5 options)
  correctAnswer?: number | boolean | string; // index for multiple choice, boolean for OX, text for short
  acceptableAnswers?: string[]; // Alternative spellings/spacing for short answer
  modelAnswer?: string; // For descriptive questions
  gradingRubric?: GradingCriteria[]; // For descriptive self-scoring
  explanation: string; // Detailed breakdown of why it is right or wrong
  slideReference: string; // e.g. "제2강 슬라이드 7p", "민법 제212조"
  difficulty: '기초' | '핵심' | '심화';
  keyPoints: string[]; // Key revision bullet points
}

export interface UserAnswerState {
  questionId: string;
  userAnswer?: string | number | boolean;
  isCorrect?: boolean;
  score?: number; // For descriptive self assessment (0~100 or rubric score)
  isBookmarked?: boolean;
  notes?: string;
  submittedAt?: number;
}

export interface ExamSessionConfig {
  mode: 'all-mock' | 'chapter' | 'type' | 'wrong-only' | 'bookmarked';
  selectedChapter?: ChapterId;
  selectedType?: QuestionType;
  questionCount?: number;
  shuffle?: boolean;
  instantFeedback?: boolean; // whether to show explanation right after answering or at the end
  timedMode?: boolean;
  timeLimitSeconds?: number;
}
