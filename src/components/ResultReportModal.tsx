import React from 'react';
import { QuizQuestion, UserAnswerState } from '../types/quiz';
import {
  Award,
  X,
  CheckCircle2,
  XCircle,
  BarChart3,
  BookOpen,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ResultReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  userAnswers: Record<string, UserAnswerState>;
  onGoToWrongAnswers: () => void;
  onRestart: () => void;
}

export const ResultReportModal: React.FC<ResultReportModalProps> = ({
  isOpen,
  onClose,
  questions,
  userAnswers,
  onGoToWrongAnswers,
  onRestart,
}) => {
  if (!isOpen) return null;

  const totalAnswered = questions.filter(
    (q) => userAnswers[q.id]?.userAnswer !== undefined
  ).length;

  const correctQuestions = questions.filter(
    (q) => userAnswers[q.id]?.isCorrect === true
  );

  const wrongQuestions = questions.filter(
    (q) => userAnswers[q.id]?.isCorrect === false
  );

  const totalScore = Math.round(
    questions.length > 0 ? (correctQuestions.length / questions.length) * 100 : 0
  );

  // Grade estimation
  const getGrade = (score: number) => {
    if (score >= 95) return { grade: 'A+', text: '만점 수준! 중간고사 수석 가능권입니다.', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (score >= 85) return { grade: 'A0', text: '매우 우수합니다! 사소한 실수만 점검하세요.', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 75) return { grade: 'B+', text: '기본기는 탄탄합니다! 오답노트를 집중 보완하세요.', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (score >= 60) return { grade: 'B0', text: '법령과 조항의 단서 규정을 꼼꼼히 확인하세요.', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { grade: 'C+', text: '핵심 요약 노트를 다시 읽고 개념을 재정비하세요.', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const gradeInfo = getGrade(totalScore);

  // Stats by Chapter
  const chapters = [
    { id: 'ch2', name: '제2강 토지의 개념과 특성' },
    { id: 'ch3', name: '제3강 토지의 용어와 지목' },
    { id: 'ch4', name: '제4강 5극 3특 균형성장' },
    { id: 'ch5', name: '제5강 법령체계1' },
    { id: 'ch6', name: '제6강 국토계획법1' },
    { id: 'ch7', name: '제7강 개발행위·용도지역제' },
    { id: 'ch8', name: '제8강 계획시설사업' },
  ];

  const chapterStats = chapters.map((c) => {
    const chQuestions = questions.filter((q) => q.chapterId === c.id);
    const chCorrect = chQuestions.filter((q) => userAnswers[q.id]?.isCorrect === true);
    const percentage = chQuestions.length > 0 ? Math.round((chCorrect.length / chQuestions.length) * 100) : 0;
    return {
      ...c,
      total: chQuestions.length,
      correct: chCorrect.length,
      percentage,
    };
  });

  // Stats by Question Type
  const types = [
    { id: 'multiple-choice', name: '객관식' },
    { id: 'ox', name: '진위형 (OX)' },
    { id: 'short-answer', name: '단답형' },
    { id: 'descriptive', name: '서술형' },
  ];

  const typeStats = types.map((t) => {
    const tQuestions = questions.filter((q) => q.type === t.id);
    const tCorrect = tQuestions.filter((q) => userAnswers[q.id]?.isCorrect === true);
    const percentage = tQuestions.length > 0 ? Math.round((tCorrect.length / tQuestions.length) * 100) : 0;
    return {
      ...t,
      total: tQuestions.length,
      correct: tCorrect.length,
      percentage,
    };
  });

  // Weakest chapter
  const weakestChapter = [...chapterStats].sort((a, b) => a.percentage - b.percentage)[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <Award className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">토지론입문 중간고사 성적 분석표</h3>
              <p className="text-xs text-emerald-200">
                응시 문항: {totalAnswered} / {questions.length}문항 완료
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Score Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-stone-500 uppercase">최종 성적 환산</span>
              <div className="text-4xl font-black text-stone-900 my-1 font-mono">
                {totalScore}<span className="text-lg text-stone-500">점</span>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                100점 만점 기준
              </span>
            </div>

            <div className={`sm:col-span-2 p-5 rounded-2xl border flex flex-col justify-center space-y-1.5 ${gradeInfo.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">예상 학점 등급</span>
                <span className="text-2xl font-black font-mono">{gradeInfo.grade}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {gradeInfo.text}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium pt-1">
                <span className="flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 정답 {correctQuestions.length}개
                </span>
                <span className="flex items-center gap-1 text-rose-800">
                  <XCircle className="w-3.5 h-3.5" /> 오답 {wrongQuestions.length}개
                </span>
              </div>
            </div>
          </div>

          {/* Chapter Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              단원별 성취도 분석
            </h4>
            <div className="space-y-2">
              {chapterStats.map((c) => (
                <div key={c.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                    <span>{c.name}</span>
                    <span className="font-mono text-emerald-800 font-bold">
                      {c.correct}/{c.total} ({c.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        c.percentage >= 80 ? 'bg-emerald-600' : c.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Type Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              문제 유형별 정답률
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {typeStats.map((t) => (
                <div key={t.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-1">
                  <span className="text-[11px] font-bold text-stone-600 block">{t.name}</span>
                  <span className="text-base font-black font-mono text-stone-900 block">
                    {t.percentage}%
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    {t.correct} / {t.total} 문항
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weakness Diagnosis */}
          {wrongQuestions.length > 0 && weakestChapter && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <span className="font-bold block">맞춤 학습 피드백:</span>
                <p className="leading-relaxed">
                  현재 <strong className="text-amber-950 font-bold">[{weakestChapter.name}]</strong> 단원의 정답률이 가장 낮습니다.
                  오답노트에서 해당 단원의 틀린 문제를 집중 복습하고 상세 해설과 출제 포인트를 확인하세요!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-end gap-2.5">
          {wrongQuestions.length > 0 && (
            <button
              onClick={() => {
                onClose();
                onGoToWrongAnswers();
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <XCircle className="w-4 h-4" />
              <span>오답노트 복습하기 ({wrongQuestions.length}문제)</span>
            </button>
          )}

          <button
            onClick={() => {
              onRestart();
              onClose();
            }}
            className="px-4 py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>새로 풀기</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
