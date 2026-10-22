import React from 'react';
import { BookOpen, CheckCircle, Award, Bookmark, XCircle, RotateCcw, Sparkles } from 'lucide-react';

export type MainTab = 'exam' | 'chapter' | 'type' | 'wrong' | 'summary';

interface HeaderProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  totalAnswered: number;
  totalCorrect: number;
  totalQuestions: number;
  wrongCount: number;
  bookmarkCount: number;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  totalAnswered,
  totalCorrect,
  totalQuestions,
  wrongCount,
  bookmarkCount,
  onResetProgress,
}) => {
  const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white px-4 py-2.5 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 font-semibold px-2 py-0.5 rounded text-[11px] tracking-wide uppercase">
              2026학년도 2학기
            </span>
            <span className="font-medium text-emerald-100">
              단국대학교 · 토지론입문 중간고사 대비
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100 text-xs">
            <span>제2강~제8강 전범위 (개념·지목·5극3특·법령체계·국토계획법·개발행위·계획시설사업)</span>
          </div>
        </div>
      </div>

      {/* Main Title & Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  토지론입문 퀴즈 마스터
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    중간고사 A+ 완벽대비
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  객관식 · OX진위형 · 단답형 · 서술형 유형별 학습 & 상세 오답 해설
                </p>
              </div>
            </div>
          </div>

          {/* User Progress Stats Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <span className="text-stone-500">진행률 </span>
                <span className="font-bold text-stone-800">{totalAnswered}/{totalQuestions}</span>
                <span className="text-emerald-600 font-bold ml-1">({accuracyRate}%)</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('wrong')}
              className={`rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium border transition-colors ${
                wrongCount > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="틀린 문제만 모아보기"
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>오답노트</span>
              <span className={`px-1.5 py-0.2 rounded-full font-bold text-[11px] ${wrongCount > 0 ? 'bg-rose-200 text-rose-800' : 'bg-stone-200 text-stone-600'}`}>
                {wrongCount}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('wrong')}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium transition-colors"
              title="북마크 문제"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>북마크</span>
              <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold text-[11px]">
                {bookmarkCount}
              </span>
            </button>

            <button
              onClick={onResetProgress}
              className="text-stone-400 hover:text-stone-700 p-1.5 hover:bg-stone-100 rounded-lg transition-colors"
              title="진행 기록 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar border-t border-stone-100 pt-3">
          <button
            onClick={() => onSelectTab('exam')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              currentTab === 'exam'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>실전 모의고사</span>
          </button>

          <button
            onClick={() => onSelectTab('chapter')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              currentTab === 'chapter'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>단원별 학습 (제2~8강)</span>
          </button>

          <button
            onClick={() => onSelectTab('type')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              currentTab === 'type'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>유형별 공략 (객관/OX/단답/서술)</span>
          </button>

          <button
            onClick={() => onSelectTab('wrong')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              currentTab === 'wrong'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>오답 & 북마크 노트</span>
            {wrongCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${currentTab === 'wrong' ? 'bg-rose-800 text-rose-100' : 'bg-rose-100 text-rose-700'}`}>
                {wrongCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('summary')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              currentTab === 'summary'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>강의 핵심 요약집</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
