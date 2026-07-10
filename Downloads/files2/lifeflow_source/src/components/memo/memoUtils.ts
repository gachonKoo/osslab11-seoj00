import { MemoItem } from "./MemoTypes";

const STORAGE_KEY = "lifeflow_memos";

export function loadMemos(): MemoItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMemos(memos: MemoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

export function addMemo(memos: MemoItem[], memo: MemoItem) {
  const updated = [memo, ...memos];
  saveMemos(updated);
  return updated;
}

export function toggleMemo(memos: MemoItem[], id: string) {
  const updated = memos.map((m) =>
    m.id === id ? { ...m, done: !m.done } : m
  );
  saveMemos(updated);
  return updated;
}

export function deleteMemo(memos: MemoItem[], id: string) {
  const updated = memos.filter((m) => m.id !== id);
  saveMemos(updated);
  return updated;
}

// ---- 자유 메모 (자유 형식 텍스트) ----
const FREE_NOTE_KEY = "lifeflow_free_note";

export function loadFreeNote(): string {
  try {
    return localStorage.getItem(FREE_NOTE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveFreeNote(text: string) {
  localStorage.setItem(FREE_NOTE_KEY, text);
}
