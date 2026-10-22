import React, { useState } from 'react';
import { QuizQuestion, UserAnswerState, ChapterId, QuestionType } from '../types/quiz';
import {
  XCircle,
  Bookmark,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  Filter,
  Lightbulb,
  Edit3,
  HelpCircle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { QuizCard } from './QuizCard';

interface WrongAnswersViewProps {
  questions: QuizQuestion[];
  userAnswers: Record<string, UserAnswerState>;
  onAnswerQuestion: (questionId: string, answer: string | number | boolean, isCorrect: boolean, score?: number) => void;
  onToggleBookmark: (questionId: string) => void;
  onSaveNote: (questionId: string, note: string) => void;
  onGoToStudyNotes: (chapterId?: ChapterId) => void;
}

export const WrongAnswersView: React.FC<WrongAnswersViewProps> = ({
  questions,
  userAnswers,
  onAnswerQuestion,
  onToggleBookmark,
  onSaveNote,
  onGoToStudyNotes,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'wrong' | 'bookmarked'>('wrong');
  const [filterChapter, setFilterChapter] = useState<ChapterId | 'all'>('all');
  const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Filter wrong or bookmarked
  const targetQuestions = questions.filter((q) => {
    const ans = userAnswers[q.id];
    if (activeSubTab === 'wrong') {
      if (ans?.isCorrect !== false) return false;
    } else {
      if (!ans?.isBookmarked) return false;
    }

    if (filterChapter !== 'all' && q.chapterId !== filterChapter) return false;
    if (filterType !== 'all' && q.type !== filterType) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              {activeSubTab === 'wrong' ? (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>약점 극복 오답노트 & 집중 해설</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-5 h-5 text-amber-600 fill-amber-500" />
                  <span>북마크한 중요 문항 모음</span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              틀린 문제의 오답 원인과 핵심 개념을 파악하고 바로 재도전하여 완벽히 마스터하세요.
            </p>
          </div>

          <div className="flex rounded-xl border border-stone-200 p-1 bg-stone-50 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('wrong')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'wrong'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>오답노트</span>
            </button>
            <button
              onClick={() => setActiveSubTab('bookmarked')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'bookmarked'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>북마크</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1 text-stone-500 font-semibold mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>필터:</span>
          </div>

          <button
            onClick={() => setFilterChapter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'all'
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            전체 단원
          </button>
          <button
            onClick={() => setFilterChapter('ch2')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'ch2'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            제2강 토지 개념·특성
          </button>
          <button
            onClick={() => setFilterChapter('ch3')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'ch3'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            제3강 용어와 지목
          </button>
          <button
            onClick={() => setFilterChapter('ch4')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'ch4'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            제4강 5극3특 전략
          </button>
          <button
            onClick={() => setFilterChapter('ch5')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'ch5'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            제5강 법령체계1
          </button>
          <button
            onClick={() => setFilterChapter('ch6')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'ch6'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            제6강 국토계획법1
          </button>
          <button
            onClick={() => setFilterChapter('ch7')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'ch7'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            제7강 개발행위·용도지역
          </button>
          <button
            onClick={() => setFilterChapter('ch8')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filterChapter === 'ch8'
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            제8강 계획시설사업
          </button>
        </div>
      </div>

      {/* Target Questions List */}
      {targetQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-800">
              {activeSubTab === 'wrong'
                ? '현재 조건에 해당하는 틀린 문제가 없습니다!'
                : '북마크한 문제가 없습니다.'}
            </h3>
            <p className="text-sm text-stone-500">
              {activeSubTab === 'wrong'
                ? '모든 문제를 맞히셨거나 아직 문제를 풀지 않았습니다. 모의고사를 풀어보세요!'
                : '학습 중 다시 보고 싶은 중요 문제는 우측 상단 별/북마크 아이콘을 눌러 추가하세요.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              총 <strong className="text-stone-800">{targetQuestions.length}</strong>개의 문항이 있습니다.
            </span>
            <span>카드를 클릭하여 다시 풀거나 해설을 확인하세요.</span>
          </div>

          <div className="space-y-4">
            {targetQuestions.map((question, idx) => {
              const ans = userAnswers[question.id];
              const isExpanded = expandedQuestionId === question.id;

              return (
                <div
                  key={question.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-all"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : question.id)}
                    className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer hover:bg-stone-50/70 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {question.chapterTitle}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {question.topic}
                        </span>
                        {ans?.isCorrect === false && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            오답 발생
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                        {question.question}
                      </h4>

                      {/* Incorrect User Choice Snippet */}
                      {ans?.userAnswer !== undefined && (
                        <div className="text-xs text-stone-500 flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-rose-600 font-semibold">
                            내 답안:{' '}
                            {question.type === 'multiple-choice' && question.options
                              ? `${Number(ans.userAnswer) + 1}번 (${question.options[Number(ans.userAnswer)]?.slice(0, 30)}...)`
                              : question.type === 'ox'
                              ? ans.userAnswer ? 'O (참)' : 'X (거짓)'
                              : String(ans.userAnswer)}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            정답:{' '}
                            {question.type === 'multiple-choice' && question.options
                              ? `${Number(question.correctAnswer) + 1}번`
                              : question.type === 'ox'
                              ? question.correctAnswer ? 'O (참)' : 'X (거짓)'
                              : String(question.correctAnswer)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hidden sm:inline">
                        {isExpanded ? '접기' : '다시 풀기 & 해설'}
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 text-stone-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Interactive Card */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 bg-stone-50/50 border-t border-stone-200">
                      <QuizCard
                        question={question}
                        currentIndex={idx}
                        totalQuestions={targetQuestions.length}
                        userState={userAnswers[question.id]}
                        onAnswer={(answer, isCorrect, score) =>
                          onAnswerQuestion(question.id, answer, isCorrect, score)
                        }
                        onToggleBookmark={onToggleBookmark}
                        onSaveNote={onSaveNote}
                        showInstantFeedback={true}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
