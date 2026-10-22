import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserAnswerState, QuestionType, ChapterId } from '../types/quiz';
import { QuizCard } from './QuizCard';
import {
  Timer,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Filter,
  BarChart3,
  Bookmark,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ExamViewProps {
  questions: QuizQuestion[];
  userAnswers: Record<string, UserAnswerState>;
  onAnswerQuestion: (questionId: string, answer: string | number | boolean, isCorrect: boolean, score?: number) => void;
  onToggleBookmark: (questionId: string) => void;
  onSaveNote: (questionId: string, note: string) => void;
  initialChapter?: ChapterId;
  initialType?: QuestionType;
  onOpenReportModal: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  questions,
  userAnswers,
  onAnswerQuestion,
  onToggleBookmark,
  onSaveNote,
  initialChapter,
  initialType,
  onOpenReportModal,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<ChapterId | 'all'>(initialChapter || 'all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>(initialType || 'all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [instantFeedback, setInstantFeedback] = useState<boolean>(true);
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Sync props if changed
  useEffect(() => {
    if (initialChapter) setSelectedChapter(initialChapter);
  }, [initialChapter]);

  useEffect(() => {
    if (initialType) setSelectedType(initialType);
  }, [initialType]);

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const chapterMatch = selectedChapter === 'all' || q.chapterId === selectedChapter;
    const typeMatch = selectedType === 'all' || q.type === selectedType;
    return chapterMatch && typeMatch;
  });

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimed && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('시험 시간이 종료되었습니다! 결과를 확인합니다.');
      onOpenReportModal();
    }
    return () => clearInterval(interval);
  }, [isTimed, isTimerRunning, timeLeft, onOpenReportModal]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = filteredQuestions[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onOpenReportModal();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const answeredCount = filteredQuestions.filter(
    (q) => userAnswers[q.id]?.userAnswer !== undefined
  ).length;

  const correctCount = filteredQuestions.filter(
    (q) => userAnswers[q.id]?.isCorrect === true
  ).length;

  return (
    <div className="space-y-6">
      {/* Control & Filter Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
        {/* Top Controls: Mode & Timer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              학습 모드:
            </span>
            <div className="inline-flex rounded-lg border border-stone-200 p-0.5 bg-stone-50 text-xs">
              <button
                onClick={() => setInstantFeedback(true)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  instantFeedback
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                즉시 해설 모드 (학습용)
              </button>
              <button
                onClick={() => setInstantFeedback(false)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  !instantFeedback
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                실전 OMR 모드 (제출 후 채점)
              </button>
            </div>
          </div>

          {/* Timer and Finish Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 text-xs">
              <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-rose-600 animate-pulse' : 'text-stone-500'}`} />
              <button
                onClick={() => {
                  if (!isTimed) {
                    setIsTimed(true);
                    setIsTimerRunning(true);
                  } else {
                    setIsTimerRunning(!isTimerRunning);
                  }
                }}
                className="font-mono font-bold text-stone-800 hover:text-emerald-700"
              >
                {isTimed ? formatTime(timeLeft) : '타이머 켜기 (30분)'}
              </button>
            </div>

            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>성적표 & 분석</span>
            </button>
          </div>
        </div>

        {/* Filter Row: Lecture Chapter & Question Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Chapter Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="shrink-0 font-bold text-stone-500">강의 선택:</span>
            <button
              onClick={() => { setSelectedChapter('all'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                selectedChapter === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              전체 강의
            </button>
            <button
              onClick={() => { setSelectedChapter('ch2'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedChapter === 'ch2'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              제2강 토지 개념·특성
            </button>
            <button
              onClick={() => { setSelectedChapter('ch3'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedChapter === 'ch3'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              제3강 용어와 지목
            </button>
            <button
              onClick={() => { setSelectedChapter('ch4'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedChapter === 'ch4'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              제4강 5극 3특 전략
            </button>
            <button
              onClick={() => { setSelectedChapter('ch5'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedChapter === 'ch5'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              제5강 법령체계1
            </button>
            <button
              onClick={() => { setSelectedChapter('ch6'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedChapter === 'ch6'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              제6강 국토계획법1
            </button>
            <button
              onClick={() => { setSelectedChapter('ch7'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedChapter === 'ch7'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              제7강 개발행위·용도지역
            </button>
            <button
              onClick={() => { setSelectedChapter('ch8'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedChapter === 'ch8'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              제8강 계획시설사업
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar md:justify-end">
            <span className="shrink-0 font-bold text-stone-500">문제 유형:</span>
            <button
              onClick={() => { setSelectedType('all'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              전체 유형
            </button>
            <button
              onClick={() => { setSelectedType('multiple-choice'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedType === 'multiple-choice'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              객관식
            </button>
            <button
              onClick={() => { setSelectedType('ox'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedType === 'ox'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              진위형 (O/X)
            </button>
            <button
              onClick={() => { setSelectedType('short-answer'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedType === 'short-answer'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              단답형
            </button>
            <button
              onClick={() => { setSelectedType('descriptive'); setCurrentIndex(0); }}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedType === 'descriptive'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              서술형
            </button>
          </div>
        </div>
      </div>

      {/* Main Question & Navigation Layout */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">선택한 조건의 문제가 없습니다.</h3>
          <p className="text-sm text-stone-500">강의 또는 문제 유형 필터를 다시 선택해 주세요.</p>
          <button
            onClick={() => { setSelectedChapter('all'); setSelectedType('all'); }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700"
          >
            전체 문제 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Question Card (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            {currentQuestion && (
              <QuizCard
                key={currentQuestion.id}
                question={currentQuestion}
                currentIndex={currentIndex}
                totalQuestions={filteredQuestions.length}
                userState={userAnswers[currentQuestion.id]}
                onAnswer={(answer, isCorrect, score) =>
                  onAnswerQuestion(currentQuestion.id, answer, isCorrect, score)
                }
                onToggleBookmark={onToggleBookmark}
                onSaveNote={onSaveNote}
                onNext={handleNext}
                onPrev={handlePrev}
                showInstantFeedback={instantFeedback}
              />
            )}
          </div>

          {/* Side Question Navigator (OMR Palette) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4 lg:sticky lg:top-36">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                문항 탐색기 (OMR)
              </h3>
              <span className="text-xs font-mono font-bold text-stone-500">
                {answeredCount} / {filteredQuestions.length} 완료
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${filteredQuestions.length > 0 ? (answeredCount / filteredQuestions.length) * 100 : 0}%`,
                }}
              />
            </div>

            {/* Questions Number Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-1 border border-stone-100 rounded-xl">
              {filteredQuestions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCurrent = idx === currentIndex;
                const isAnswered = ans?.userAnswer !== undefined;
                const isWrong = isAnswered && ans?.isCorrect === false;
                const isRight = isAnswered && ans?.isCorrect === true;
                const isBookmarked = ans?.isBookmarked;

                let btnClass = 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100';

                if (isCurrent) {
                  btnClass = 'ring-2 ring-emerald-600 font-bold bg-white text-emerald-800 border-emerald-400';
                } else if (instantFeedback && isAnswered) {
                  if (isRight) {
                    btnClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
                  } else if (isWrong) {
                    btnClass = 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
                  } else {
                    btnClass = 'bg-indigo-50 text-indigo-800 border-indigo-200';
                  }
                } else if (isAnswered) {
                  btnClass = 'bg-stone-800 text-white border-stone-800 font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${btnClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isBookmarked && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                <span>정답</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300" />
                <span>오답</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-stone-50 border border-stone-200" />
                <span>미풀이</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>북마크</span>
              </div>
            </div>

            {/* Finish & Submit Button */}
            <button
              onClick={onOpenReportModal}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>최종 제출 및 성적 분석</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
