import { UserAnswerState } from '../types/quiz';

const STORAGE_KEY_ANSWERS = 'toji_quiz_user_answers';
const STORAGE_KEY_BOOKMARKS = 'toji_quiz_bookmarks';
const STORAGE_KEY_NOTES = 'toji_quiz_notes';

export const loadStoredAnswers = (): Record<string, UserAnswerState> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error loading stored answers', e);
    return {};
  }
};

export const saveStoredAnswer = (state: UserAnswerState) => {
  try {
    const all = loadStoredAnswers();
    all[state.questionId] = {
      ...all[state.questionId],
      ...state,
      submittedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving answer', e);
  }
};

export const clearStoredAnswers = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
  } catch (e) {
    console.error('Error clearing answers', e);
  }
};

export const toggleBookmark = (questionId: string): boolean => {
  try {
    const all = loadStoredAnswers();
    const current = all[questionId]?.isBookmarked ?? false;
    const updated = !current;
    all[questionId] = {
      ...(all[questionId] || { questionId }),
      isBookmarked: updated
    };
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(all));
    return updated;
  } catch (e) {
    console.error('Error toggling bookmark', e);
    return false;
  }
};

export const saveQuestionNote = (questionId: string, notes: string) => {
  try {
    const all = loadStoredAnswers();
    all[questionId] = {
      ...(all[questionId] || { questionId }),
      notes
    };
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving note', e);
  }
};
