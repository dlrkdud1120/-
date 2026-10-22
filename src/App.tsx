import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from './data/quizQuestions';
import { UserAnswerState, ChapterId, QuestionType } from './types/quiz';
import {
  loadStoredAnswers,
  saveStoredAnswer,
  toggleBookmark,
  saveQuestionNote,
  clearStoredAnswers
} from './utils/storage';
import { Header, MainTab } from './components/Header';
import { ExamView } from './components/ExamView';
import { WrongAnswersView } from './components/WrongAnswersView';
import { StudyNotesView } from './components/StudyNotesView';
import { ResultReportModal } from './components/ResultReportModal';
import {
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Bookmark
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<MainTab>('exam');
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswerState>>({});
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<ChapterId | undefined>(undefined);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<QuestionType | undefined>(undefined);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Load stored state on mount
  useEffect(() => {
    const loaded = loadStoredAnswers();
    setUserAnswers(loaded);
  }, []);

  const handleAnswerQuestion = (
    questionId: string,
    answer: string | number | boolean,
    isCorrect: boolean,
    score?: number
  ) => {
    const newState: UserAnswerState = {
      questionId,
      userAnswer: answer,
      isCorrect,
      score,
      isBookmarked: userAnswers[questionId]?.isBookmarked,
      notes: userAnswers[questionId]?.notes,
      submittedAt: Date.now(),
    };
    saveStoredAnswer(newState);
    setUserAnswers((prev) => ({ ...prev, [questionId]: newState }));
  };

  const handleToggleBookmark = (questionId: string) => {
    const updated = toggleBookmark(questionId);
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { questionId }),
        isBookmarked: updated,
      },
    }));
  };

  const handleSaveNote = (questionId: string, note: string) => {
    saveQuestionNote(questionId, note);
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { questionId }),
        notes: note,
      },
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('모든 문제 풀이 기록과 오답노트를 초기화하시겠습니까?')) {
      clearStoredAnswers();
      setUserAnswers({});
    }
  };

  // Stats calculation
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredQuestions = Object.values(userAnswers).filter((a) => a.userAnswer !== undefined);
  const totalAnswered = answeredQuestions.length;
  const correctQuestions = answeredQuestions.filter((a) => a.isCorrect === true);
  const totalCorrect = correctQuestions.length;
  const wrongQuestions = answeredQuestions.filter((a) => a.isCorrect === false);
  const wrongCount = wrongQuestions.length;
  const bookmarkCount = Object.values(userAnswers).filter((a) => a.isBookmarked).length;

  // Chapter cards info for 'chapter' tab hub
  const chapterList: {
    id: ChapterId;
    title: string;
    sub: string;
    desc: string;
    badgeColor: string;
  }[] = [
    {
      id: 'ch2',
      title: '제2강 토지의 개념과 특성',
      sub: '민법 제99조·212조, 지하 한계심도, 자연적/인문적 특성',
      desc: '부동산·동산 구분, 공중·지하 소유권과 한계심도(고층 50m~산지 25m), 부동성/부증성/영속성/개별성, 어셈블리지 효과',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'ch3',
      title: '제3강 토지의 용어와 지목',
      sub: '필지, 대지, 부지, 택지, 획지, 지번, 28개 지목',
      desc: '1필지 성립요건 및 양입지 제한(지목 "대" 불가, 10% or 330㎡ 초과 불가), 북서기번법, 과수원·목장·묘지 주택은 "대", 광천지/도로/체육용지 단서규정',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'ch4',
      title: '제4강 5극 3특 균형성장전략',
      sub: '수도권 일극체계 탈피, 다핵형 국가 발전 축, 3대 메가프로젝트',
      desc: '5극(수도권·중부·대경·동남·호남) + 3특(강원·전북·제주), 거점도시와 주변도시 초광역 연계, 정책 5대 축, AI 두뇌·신체·심장',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 'ch5',
      title: '제5강 법령체계1 (헌법 & 국토기본법)',
      sub: '헌법 제23조·120조·122조, 국토기본법 제정, 6대 국토계획 체계',
      desc: '재산권 보장·사회적 제약·정당보상, 토지공개념 근거, 국토건설종합계획법 폐지(2003.1.1), 국토종합계획(20년 단위/5년 정비) 승인절차, 국토정책위',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'ch6',
      title: '제6강 국토의계획및이용에관한법률1',
      sub: '법의 목적 및 구성, 비구속적 vs 구속적 계획, 광역도시계획, 기본계획, 관리계획',
      desc: '공청회 vs 14일 공람, 입안 제안 동의 요건(기반시설 4/5, 지구단위 2/3), 결정권자(시·도지사/대도시시장/시장군수 지구단위), 지형도면 고시일 효력 발생, 공간재구조화',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300'
    },
    {
      id: 'ch7',
      title: '제7강 국토계획법 _ 개발행위허가, 용도지역제',
      sub: '개발행위허가 기준 및 절차, 개발밀도관리구역·기반시설부담구역, 21개 용도지역, 공간혁신 3종',
      desc: '허가대상 5가지(물건적치 농림지역 제외, 토지분할·물건적치 준공검사 제외), 허가제한 3+2년, 용적률 50% 강화, 200㎡ 초과 비용부과, 4대 지역 건폐율·용적률 한도표, 화이트존 도시혁신구역',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    {
      id: 'ch8',
      title: '제8강 국토계획법 _ 계획시설사업',
      sub: '도시·군계획시설 설치, 장기미집행시설(매수청구·해제신청·20년 실효), 시설사업 시행절차',
      desc: '국공유지 목적외 처분 무효, 10년 미집행 지목 대(垈) 매수청구(6개월 결정, 2년 매수, 지자체 채권 10년 상환, 거부시 3층이하 단독·근생), 해제신청 3단계, 20년 다음날 자동실효, 민간 2/3소유+1/2동의',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  ];

  // Question Type cards info for 'type' tab hub
  const typeList: {
    id: QuestionType;
    title: string;
    format: string;
    desc: string;
    badgeColor: string;
  }[] = [
    {
      id: 'multiple-choice',
      title: '객관식 문제 (4~5지선다)',
      format: '시험 표준 객관식',
      desc: '법령 조항의 세부 요건과 예외 규정, 단서 조항을 정확하게 판별하는 훈련',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'ox',
      title: '진위형 (O/X 퀴즈)',
      format: '빠른 핵심 개념 판별',
      desc: '강의 핵심 명제 1초 판별! 헷갈리는 함정 지문(예: 한계심도 법정 수치 유무, 군사계획 우선권 등) 즉시 검증',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'short-answer',
      title: '단답형 문제 (키워드 완성)',
      format: '핵심 개념어 적기',
      desc: '어셈블리지 효과, 주용도 추종의 원칙, 28개 지목, 국무총리 등 필수 전문 용어 쓰기 연습',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'descriptive',
      title: '서술형 문제 (교수님 채점표)',
      format: '중간고사 논술형 대비',
      desc: '직접 서술하고 모범 답안 및 100점 만점 세부 채점표(루브릭)를 대조하여 자가 채점',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col">
      {/* Top App Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'exam') {
            setSelectedChapterFilter(undefined);
            setSelectedTypeFilter(undefined);
          }
        }}
        totalAnswered={totalAnswered}
        totalCorrect={totalCorrect}
        totalQuestions={totalQuestions}
        wrongCount={wrongCount}
        bookmarkCount={bookmarkCount}
        onResetProgress={handleResetProgress}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* ================= 1. EXAM MODE ================= */}
        {currentTab === 'exam' && (
          <ExamView
            questions={QUIZ_QUESTIONS}
            userAnswers={userAnswers}
            onAnswerQuestion={handleAnswerQuestion}
            onToggleBookmark={handleToggleBookmark}
            onSaveNote={handleSaveNote}
            initialChapter={selectedChapterFilter}
            initialType={selectedTypeFilter}
            onOpenReportModal={() => setIsReportOpen(true)}
          />
        )}

        {/* ================= 2. CHAPTER HUB ================= */}
        {currentTab === 'chapter' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>단원별 맞춤형 집중 학습</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                수업 4개 핵심 강의별로 객관식, OX, 단답형, 서술형 문제를 골고루 풀어보고 취약한 단원을 마스터하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapterList.map((ch) => {
                const chQuestions = QUIZ_QUESTIONS.filter((q) => q.chapterId === ch.id);
                const chAnswered = chQuestions.filter((q) => userAnswers[q.id]?.userAnswer !== undefined);
                const chCorrect = chQuestions.filter((q) => userAnswers[q.id]?.isCorrect === true);
                const chRate = chAnswered.length > 0 ? Math.round((chCorrect.length / chAnswered.length) * 100) : 0;

                return (
                  <div
                    key={ch.id}
                    className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold border ${ch.badgeColor}`}>
                          {ch.title.split(' ')[0]}
                        </span>
                        <span className="text-xs font-mono font-semibold text-stone-500">
                          {chQuestions.length}문항 수록
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-emerald-800 font-semibold bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                        {ch.sub}
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {ch.desc}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                          <span>학습 완료: {chAnswered.length}/{chQuestions.length}</span>
                          <span className="text-emerald-700 font-bold">정답률 {chRate}%</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full"
                            style={{
                              width: `${(chAnswered.length / chQuestions.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedChapterFilter(ch.id);
                            setSelectedTypeFilter(undefined);
                            setCurrentTab('exam');
                          }}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>이 단원 퀴즈 풀기</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTab('summary');
                            setTimeout(() => {
                              const el = document.getElementById(`summary-${ch.id}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className="px-3 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          요약 보기
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 3. QUESTION TYPE HUB ================= */}
        {currentTab === 'type' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>문제 유형별 집중 공략</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                실제 중간고사 출제 유형에 맞춰 객관식, 진위형(OX), 단답형, 서술형 문항을 집중적으로 훈련하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typeList.map((t) => {
                const tQuestions = QUIZ_QUESTIONS.filter((q) => q.type === t.id);
                const tAnswered = tQuestions.filter((q) => userAnswers[q.id]?.userAnswer !== undefined);
                const tCorrect = tQuestions.filter((q) => userAnswers[q.id]?.isCorrect === true);
                const tRate = tAnswered.length > 0 ? Math.round((tCorrect.length / tAnswered.length) * 100) : 0;

                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold border ${t.badgeColor}`}>
                          {t.format}
                        </span>
                        <span className="text-xs font-mono font-semibold text-stone-500">
                          총 {tQuestions.length}문항
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900">
                        {t.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                        <span>응시 현황: {tAnswered.length}/{tQuestions.length}</span>
                        <span className="text-emerald-700 font-bold">정답률 {tRate}%</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTypeFilter(t.id);
                          setSelectedChapterFilter(undefined);
                          setCurrentTab('exam');
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>{t.title}만 모아서 풀기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. WRONG ANSWERS & BOOKMARKS ================= */}
        {currentTab === 'wrong' && (
          <WrongAnswersView
            questions={QUIZ_QUESTIONS}
            userAnswers={userAnswers}
            onAnswerQuestion={handleAnswerQuestion}
            onToggleBookmark={handleToggleBookmark}
            onSaveNote={handleSaveNote}
            onGoToStudyNotes={(chapterId) => {
              setCurrentTab('summary');
              if (chapterId) {
                setTimeout(() => {
                  const el = document.getElementById(`summary-${chapterId}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
          />
        )}

        {/* ================= 5. STUDY NOTES & CHEAT SHEET ================= */}
        {currentTab === 'summary' && (
          <StudyNotesView
            onStartQuizWithChapter={(chapterId) => {
              setSelectedChapterFilter(chapterId as ChapterId);
              setSelectedTypeFilter(undefined);
              setCurrentTab('exam');
            }}
          />
        )}
      </main>

      {/* Result Report Modal */}
      <ResultReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        questions={QUIZ_QUESTIONS}
        userAnswers={userAnswers}
        onGoToWrongAnswers={() => {
          setIsReportOpen(false);
          setCurrentTab('wrong');
        }}
        onRestart={() => {
          clearStoredAnswers();
          setUserAnswers({});
          setIsReportOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            단국대학교 · 2026학년도 2학기 토지론입문 중간고사 대비 퀴즈 시스템
          </span>
          <span className="text-stone-400">
            제2강~제8강 (토지개념·특성, 지목, 5극3특, 법령체계, 국토계획법, 개발행위허가·용도지역제, 계획시설사업)
          </span>
        </div>
      </footer>
    </div>
  );
}
