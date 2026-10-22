import React, { useState } from 'react';
import { LECTURE_SUMMARIES, ChapterSummary } from '../data/lectureSummaryData';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  FileText,
  Scale,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface StudyNotesViewProps {
  onStartQuizWithChapter?: (chapterId: string) => void;
}

export const StudyNotesView: React.FC<StudyNotesViewProps> = ({
  onStartQuizWithChapter,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapter, setExpandedChapter] = useState<string>('ch2');

  const filteredSummaries = LECTURE_SUMMARIES.filter((ch) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchTitle = ch.title.toLowerCase().includes(query) || ch.chapterNumber.toLowerCase().includes(query);
    const matchConcepts = ch.coreConcepts.some(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.items.some((item) => item.toLowerCase().includes(query))
    );
    return matchTitle || matchConcepts;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>토지론입문 강의 핵심 요약집 (시험 직전 총정리)</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              수업 PPT 강의안을 빈출 족보와 법령 조항으로 완벽 정리한 암기 치트시트입니다.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="개념 검색 (예: 한계심도, 구거, 5극...)"
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick jump badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-stone-400 font-semibold shrink-0">빠른 이동:</span>
          {LECTURE_SUMMARIES.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setExpandedChapter(ch.id);
                const el = document.getElementById(`summary-${ch.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                expandedChapter === ch.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {ch.chapterNumber} {ch.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters Summaries */}
      <div className="space-y-6">
        {filteredSummaries.map((chapter) => {
          const isOpen = expandedChapter === chapter.id || searchQuery.length > 0;

          return (
            <div
              key={chapter.id}
              id={`summary-${chapter.id}`}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Chapter Card Header */}
              <div
                onClick={() => setExpandedChapter(isOpen ? '' : chapter.id)}
                className="p-5 sm:p-6 bg-gradient-to-r from-stone-50 to-white border-b border-stone-200/80 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {chapter.chapterNumber}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      {chapter.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    {chapter.subTitle}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {onStartQuizWithChapter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuizWithChapter(chapter.id);
                      }}
                      className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>이 단원 퀴즈 풀기</span>
                    </button>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400" />
                  )}
                </div>
              </div>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="p-5 sm:p-7 space-y-6">
                  {/* Core Concepts */}
                  <div className="space-y-4">
                    {chapter.coreConcepts.map((concept, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-stone-50/70 p-4 sm:p-5 rounded-xl border border-stone-200/80 space-y-2.5"
                      >
                        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{concept.title}</span>
                        </h4>
                        <p className="text-xs text-stone-600">{concept.description}</p>

                        <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm text-stone-700 leading-relaxed">
                          {concept.items.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>

                        {concept.highlight && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-900 flex items-start gap-2">
                            <span className="font-bold text-amber-700 shrink-0">⚡ 필수 암기:</span>
                            <span>{concept.highlight}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Key Tables if present */}
                  {chapter.keyTables && chapter.keyTables.length > 0 && (
                    <div className="space-y-3">
                      {chapter.keyTables.map((tbl, tIdx) => (
                        <div key={tIdx} className="overflow-x-auto">
                          <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{tbl.caption}</span>
                          </div>
                          <table className="w-full text-xs text-left border border-stone-200 rounded-lg overflow-hidden">
                            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                              <tr>
                                {tbl.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="p-2.5">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200 bg-white">
                              {tbl.rows.map((r, rIdx) => (
                                <tr key={rIdx} className="hover:bg-stone-50">
                                  {r.map((col, colIdx) => (
                                    <td
                                      key={colIdx}
                                      className={`p-2.5 ${colIdx === 0 ? 'font-semibold text-stone-900' : 'text-stone-600'}`}
                                    >
                                      {col}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Law Articles if present */}
                  {chapter.lawArticles && chapter.lawArticles.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-stone-100">
                      <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-indigo-600" />
                        <span>핵심 법률 조항 원문 및 의의</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chapter.lawArticles.map((law, lIdx) => (
                          <div
                            key={lIdx}
                            className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5 text-xs"
                          >
                            <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {law.number}
                            </span>
                            <p className="text-stone-800 font-serif leading-relaxed italic bg-stone-50 p-2 rounded">
                              "{law.content}"
                            </p>
                            <p className="text-stone-500 font-sans">
                              <strong>해설:</strong> {law.importance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start practice button */}
                  {onStartQuizWithChapter && (
                    <div className="pt-2 text-right">
                      <button
                        onClick={() => onStartQuizWithChapter(chapter.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <span>{chapter.chapterNumber} 맞춤 퀴즈 풀기</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
