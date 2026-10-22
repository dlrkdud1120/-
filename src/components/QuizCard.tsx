import React, { useState } from 'react';
import { QuizQuestion, UserAnswerState } from '../types/quiz';
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  userState?: UserAnswerState;
  onAnswer: (answer: string | number | boolean, isCorrect: boolean, score?: number) => void;
  onToggleBookmark: (questionId: string) => void;
  onSaveNote: (questionId: string, note: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  showInstantFeedback?: boolean; // Show explanation right away
  isExamSubmitted?: boolean; // In exam mode, after submission
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  userState,
  onAnswer,
  onToggleBookmark,
  onSaveNote,
  onNext,
  onPrev,
  showInstantFeedback = true,
  isExamSubmitted = false,
}) => {
  const [shortAnswerInput, setShortAnswerInput] = useState<string>(
    typeof userState?.userAnswer === 'string' ? userState.userAnswer : ''
  );
  const [showHint, setShowHint] = useState<boolean>(false);
  const [userEssay, setUserEssay] = useState<string>(
    typeof userState?.userAnswer === 'string' ? userState.userAnswer : ''
  );
  const [essaySubmitted, setEssaySubmitted] = useState<boolean>(
    Boolean(userState?.userAnswer)
  );
  const [selfScore, setSelfScore] = useState<number>(userState?.score ?? 100);
  const [checkedRubrics, setCheckedRubrics] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
  });
  const [noteText, setNoteText] = useState<string>(userState?.notes || '');
  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(Boolean(userState?.notes));

  const hasAnswered = userState?.userAnswer !== undefined || essaySubmitted;
  const isCorrect = userState?.isCorrect;
  const showExplanation = (showInstantFeedback && hasAnswered) || isExamSubmitted;

  // Question Type display info
  const getTypeBadge = () => {
    switch (question.type) {
      case 'multiple-choice':
        return { label: '객관식', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'ox':
        return { label: '진위형 (O/X)', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'short-answer':
        return { label: '단답형', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'descriptive':
        return { label: '서술형', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    }
  };

  const typeBadge = getTypeBadge();

  // Handlers
  const handleSelectMultipleChoice = (index: number) => {
    if (isExamSubmitted) return;
    const correct = index === question.correctAnswer;
    onAnswer(index, correct);
  };

  const handleSelectOX = (value: boolean) => {
    if (isExamSubmitted) return;
    const correct = value === question.correctAnswer;
    onAnswer(value, correct);
  };

  const handleShortAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isExamSubmitted || !shortAnswerInput.trim()) return;

    const trimmed = shortAnswerInput.trim().toLowerCase().replace(/\s+/g, '');
    const correctTarget = String(question.correctAnswer).trim().toLowerCase().replace(/\s+/g, '');

    const isMatch =
      trimmed === correctTarget ||
      Boolean(
        question.acceptableAnswers?.some(
          (ans) => ans.trim().toLowerCase().replace(/\s+/g, '') === trimmed
        )
      );

    onAnswer(shortAnswerInput.trim(), isMatch);
  };

  const handleEssaySubmit = () => {
    if (!userEssay.trim()) return;
    setEssaySubmitted(true);
    // Calculate initial self-score from checked rubrics
    let calculatedScore = 0;
    question.gradingRubric?.forEach((r, idx) => {
      if (checkedRubrics[idx]) calculatedScore += r.point;
    });
    setSelfScore(calculatedScore);
    onAnswer(userEssay, true, calculatedScore);
  };

  const handleRubricToggle = (rubricIdx: number, point: number) => {
    const updated = { ...checkedRubrics, [rubricIdx]: !checkedRubrics[rubricIdx] };
    setCheckedRubrics(updated);

    let sum = 0;
    question.gradingRubric?.forEach((r, idx) => {
      if (updated[idx]) sum += r.point;
    });
    setSelfScore(sum);
    onAnswer(userEssay, true, sum);
  };

  const handleNoteSave = () => {
    onSaveNote(question.id, noteText);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden transition-all">
      {/* Question Header */}
      <div className="px-5 sm:px-7 py-4 bg-stone-50/80 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-stone-500 bg-white px-2.5 py-1 rounded-md border border-stone-200">
            문항 {currentIndex + 1} / {totalQuestions}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${typeBadge.color}`}>
            {typeBadge.label}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-md font-medium bg-stone-200/70 text-stone-700">
            {question.chapterTitle}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {question.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-medium ${
              userState?.isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
            title="중요 문제 북마크"
          >
            <Bookmark
              className={`w-4 h-4 ${
                userState?.isBookmarked ? 'fill-amber-500 text-amber-600' : 'text-stone-400'
              }`}
            />
            <span className="hidden sm:inline">
              {userState?.isBookmarked ? '북마크됨' : '북마크'}
            </span>
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-5 sm:p-7 space-y-6">
        <div>
          <div className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>핵심 출제 테마: {question.topic}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
            {question.question}
          </h2>
        </div>

        {question.context && (
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 whitespace-pre-line leading-relaxed font-mono">
            {question.context}
          </div>
        )}

        {/* ================= MULTIPLE CHOICE ================= */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-2.5">
            {question.options.map((option, idx) => {
              const isSelected = userState?.userAnswer === idx;
              const isTargetCorrect = idx === question.correctAnswer;

              let optionStyle =
                'border-stone-200 bg-stone-50/50 hover:bg-emerald-50/50 hover:border-emerald-300 text-stone-800';

              if (showExplanation) {
                if (isTargetCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                } else {
                  optionStyle = 'border-stone-200 bg-stone-50 text-stone-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectMultipleChoice(idx)}
                  disabled={showExplanation && !isExamSubmitted}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                      showExplanation && isTargetCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : showExplanation && isSelected && !isCorrect
                        ? 'bg-rose-600 text-white border-rose-600'
                        : isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-600 border-stone-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed pt-0.5">
                    {option}
                  </span>
                  {showExplanation && isTargetCorrect && (
                    <span className="ml-auto shrink-0 text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <Check className="w-4 h-4" /> 정답
                    </span>
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <span className="ml-auto shrink-0 text-rose-600 font-bold text-xs flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> 내 선택
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= O/X QUESTION ================= */}
        {question.type === 'ox' && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 py-2">
            {[true, false].map((val) => {
              const isSelected = userState?.userAnswer === val;
              const isTargetCorrect = val === question.correctAnswer;

              let btnStyle =
                'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800';

              if (showExplanation) {
                if (isTargetCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400';
                } else {
                  btnStyle = 'border-stone-200 bg-stone-50 text-stone-400 opacity-50';
                }
              } else if (isSelected) {
                btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 font-bold';
              }

              return (
                <button
                  key={String(val)}
                  onClick={() => handleSelectOX(val)}
                  disabled={showExplanation && !isExamSubmitted}
                  className={`p-6 sm:p-8 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <span className={`text-4xl sm:text-5xl font-black ${val ? 'text-blue-600' : 'text-rose-600'}`}>
                    {val ? 'O' : 'X'}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">
                    {val ? '그렇다 (참)' : '아니다 (거짓)'}
                  </span>
                  {showExplanation && isTargetCorrect && (
                    <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold mt-1">
                      정답
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= SHORT ANSWER ================= */}
        {question.type === 'short-answer' && (
          <div className="space-y-4">
            <form onSubmit={handleShortAnswerSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shortAnswerInput}
                  onChange={(e) => setShortAnswerInput(e.target.value)}
                  disabled={showExplanation && !isExamSubmitted}
                  placeholder="정답 키워드를 입력하세요 (예: 부동성 또는 50m)"
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 text-sm font-medium disabled:bg-stone-100"
                />
                {!hasAnswered && (
                  <button
                    type="submit"
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors shrink-0"
                  >
                    정답 확인
                  </button>
                )}
              </div>

              {/* Hint toggle */}
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-stone-500 hover:text-emerald-700 flex items-center gap-1 font-medium"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  {showHint ? '힌트 숨기기' : '💡 글자 수 힌트 보기'}
                </button>
                {showHint && (
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    정답 글자 수: 약 {String(question.correctAnswer).length}글자
                  </span>
                )}
              </div>
            </form>

            {hasAnswered && (
              <div
                className={`p-3.5 rounded-xl border text-sm flex items-center justify-between ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div>
                  <span className="font-bold mr-2">{isCorrect ? '정답입니다!' : '오답입니다!'}</span>
                  <span>정답: <strong className="font-mono text-emerald-800">{String(question.correctAnswer)}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= DESCRIPTIVE (서술형) ================= */}
        {question.type === 'descriptive' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                나만의 서술형 답안 작성 (실제 시험처럼 핵심 키워드를 포함하여 서술해 보세요):
              </label>
              <textarea
                rows={4}
                value={userEssay}
                onChange={(e) => setUserEssay(e.target.value)}
                placeholder="본인의 논리 및 법령 조항, 핵심 개념을 바탕으로 서술하세요..."
                disabled={essaySubmitted && !isExamSubmitted}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-900 text-sm leading-relaxed disabled:bg-stone-100"
              />
            </div>

            {!essaySubmitted ? (
              <button
                type="button"
                onClick={handleEssaySubmit}
                disabled={!userEssay.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                답안 제출 및 모범 답안 채점표 확인
              </button>
            ) : (
              <div className="space-y-4">
                {/* Model Answer Box */}
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      교수님 채점 기준 맞춤 모범 답안
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-700">
                      자가 채점 점수: {selfScore}점 / 100점
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-indigo-100">
                    {question.modelAnswer}
                  </p>
                </div>

                {/* Rubric Self Scoring Checklist */}
                {question.gradingRubric && (
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5">
                    <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
                      <span>자가 채점 기준표 (내 답안에 포함된 항목을 체크하세요)</span>
                      <span className="text-emerald-700 font-bold">{selfScore}점</span>
                    </div>
                    <div className="space-y-2">
                      {question.gradingRubric.map((rubric, idx) => (
                        <label
                          key={idx}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-stone-200 text-xs sm:text-sm cursor-pointer hover:bg-stone-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(checkedRubrics[idx])}
                            onChange={() => handleRubricToggle(idx, rubric.point)}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="flex-1 text-stone-800">
                            {rubric.criteria}
                          </span>
                          <span className="font-mono font-bold text-indigo-700 shrink-0">
                            +{rubric.point}점
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= COMPREHENSIVE EXPLANATION (해설) ================= */}
        {showExplanation && (
          <div className="space-y-4 pt-4 border-t border-stone-200 animate-fadeIn">
            {/* Status Alert */}
            {question.type !== 'descriptive' && (
              <div
                className={`p-3.5 rounded-xl flex items-center gap-3 text-sm font-semibold ${
                  isCorrect
                    ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100/70 text-rose-900 border border-rose-300'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                )}
                <span>
                  {isCorrect
                    ? '정답입니다! 관련 핵심 개념을 다시 한 번 확인해 보세요.'
                    : '오답입니다! 아래 상세 해설과 슬라이드 출제 포인트를 꼭 확인하세요.'}
                </span>
              </div>
            )}

            {/* Detailed Explanation Body */}
            <div className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200/90 space-y-4 text-stone-800">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  상세 교수 강의 해설
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-800">
                  {question.explanation}
                </p>
              </div>

              {/* Source Page & Article */}
              <div className="bg-white p-3 rounded-lg border border-stone-200/70 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">📌 출제 근거 (수업 자료)</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  {question.slideReference}
                </span>
              </div>

              {/* Key Exam Takeaways */}
              {question.keyPoints && question.keyPoints.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-stone-700 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    중간고사 핵심 암기 포인트:
                  </h5>
                  <ul className="space-y-1 pl-4 list-disc text-xs sm:text-sm text-stone-600">
                    {question.keyPoints.map((point, i) => (
                      <li key={i} className="leading-snug">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Personal Notes (오답 메모) */}
              <div className="pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNoteOpen(!isNoteOpen)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  <span className="flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                    나만의 오답 메모 {noteText && '(작성됨)'}
                  </span>
                  {isNoteOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isNoteOpen && (
                  <div className="mt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onBlur={handleNoteSave}
                      placeholder="내가 헷갈렸던 이유나 암기 팁을 적어두세요 (자동 저장됩니다)..."
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <div className="text-[11px] text-stone-600 text-right">
                      입력 후 포커스를 벗어나면 오답노트에 자동 저장됩니다.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
          {onPrev ? (
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>이전 문제</span>
            </button>
          ) : <div />}

          {onNext && (
            <button
              onClick={onNext}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{currentIndex === totalQuestions - 1 ? '시험 완료' : '다음 문제'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
