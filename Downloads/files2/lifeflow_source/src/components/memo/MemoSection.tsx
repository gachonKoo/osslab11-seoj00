import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, ChefHat, Heart, ShoppingCart, NotebookPen, PenLine } from "lucide-react";

const CATEGORY_ICONS = { chef: ChefHat, heart: Heart, cart: ShoppingCart };

import { MemoCategory, MemoItem, categoryLabels } from "./MemoTypes";
import {
  addMemo,
  deleteMemo,
  loadMemos,
  toggleMemo,
  loadFreeNote,
  saveFreeNote,
} from "./memoUtils";

const categories: MemoCategory[] = ["make", "eat", "buy"];

export default function MemoSection() {
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [inputs, setInputs] = useState<Record<MemoCategory, string>>({
    make: "",
    eat: "",
    buy: "",
  });
  const [showDone, setShowDone] = useState<Record<MemoCategory, boolean>>({
    make: false,
    eat: false,
    buy: false,
  });
  const [freeNote, setFreeNote] = useState("");

  useEffect(() => {
    setMemos(loadMemos());
    setFreeNote(loadFreeNote());
  }, []);

  function handleAdd(category: MemoCategory) {
    const text = inputs[category].trim();

    if (!text) return;

    const newMemo: MemoItem = {
      id: crypto.randomUUID(),
      category,
      text,
      done: false,
      createdAt: new Date().toISOString(),
    };

    setMemos(addMemo(memos, newMemo));
    setInputs((prev) => ({ ...prev, [category]: "" }));
  }

  function handleToggle(id: string) {
    setMemos(toggleMemo(memos, id));
  }

  function handleDelete(id: string) {
    setMemos(deleteMemo(memos, id));
  }

  function handleFreeNoteChange(value: string) {
    setFreeNote(value);
    saveFreeNote(value);
  }

  return (
    <section className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 text-3xl font-bold">
          <NotebookPen size={28} />
          음식 메모장
        </h2>
        <p className="mt-2 text-slate-500">
          만들 것, 먹고 싶은 것, 살 것을 가볍게 적어두세요.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {categories.map((category) => (
          <MemoColumn
            key={category}
            category={category}
            memos={memos.filter((m) => m.category === category)}
            inputValue={inputs[category]}
            onInputChange={(v) =>
              setInputs((prev) => ({ ...prev, [category]: v }))
            }
            onAdd={() => handleAdd(category)}
            onToggle={handleToggle}
            onDelete={handleDelete}
            showDone={showDone[category]}
            onToggleShowDone={() =>
              setShowDone((prev) => ({
                ...prev,
                [category]: !prev[category],
              }))
            }
          />
        ))}
      </div>

      <div className="rounded-3xl border bg-white p-6" style={{ borderColor: "var(--theme-gray)" }}>
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <PenLine size={20} />
          자유 메모
        </h3>

        <textarea
          value={freeNote}
          onChange={(e) => handleFreeNoteChange(e.target.value)}
          placeholder="식단 계획, 기타 메모를 자유롭게 적어보세요."
          rows={6}
          className="mt-4 w-full resize-none rounded-2xl border p-4 outline-none focus:border-[var(--theme-primary)]"
          style={{ borderColor: "var(--theme-gray)" }}
        />
      </div>
    </section>
  );
}

interface MemoColumnProps {
  category: MemoCategory;
  memos: MemoItem[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showDone: boolean;
  onToggleShowDone: () => void;
}

function MemoColumn({
  category,
  memos,
  inputValue,
  onInputChange,
  onAdd,
  onToggle,
  onDelete,
  showDone,
  onToggleShowDone,
}: MemoColumnProps) {
  const { label, icon, color } = categoryLabels[category];
  const Icon = CATEGORY_ICONS[icon as keyof typeof CATEGORY_ICONS];

  const active = useMemo(
    () => memos.filter((m) => !m.done),
    [memos]
  );

  const done = useMemo(() => memos.filter((m) => m.done), [memos]);

  return (
    <div className="rounded-3xl border bg-white p-6" style={{ borderColor: "var(--theme-gray)" }}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Icon size={20} style={{ color }} />
          {label}
        </h3>
        <span className="text-sm font-semibold text-slate-400">{active.length}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
          }}
          placeholder="추가..."
          className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-[var(--theme-primary)]"
        />

        <button
          onClick={onAdd}
          className="flex shrink-0 items-center justify-center rounded-xl px-4 text-white transition hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {active.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            등록된 항목이 없습니다.
          </p>
        ) : (
          active.map((memo) => (
            <MemoRow
              key={memo.id}
              memo={memo}
              color={color}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {done.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <button
            onClick={onToggleShowDone}
            className="flex w-full items-center justify-between text-sm font-medium text-slate-400"
          >
            완료 항목 {done.length}개
            {showDone ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showDone && (
            <div className="mt-3 space-y-2">
              {done.map((memo) => (
                <MemoRow
                  key={memo.id}
                  memo={memo}
                  color={color}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MemoRow({
  memo,
  color,
  onToggle,
  onDelete,
}: {
  memo: MemoItem;
  color: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
      <button
        onClick={() => onToggle(memo.id)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-xs text-white"
        style={
          memo.done
            ? { borderColor: color, backgroundColor: color }
            : { borderColor: "#cbd5e1" }
        }
      >
        {memo.done ? "✓" : ""}
      </button>

      <span
        className={`flex-1 text-sm ${
          memo.done
            ? "text-slate-400 line-through"
            : "text-slate-700"
        }`}
      >
        {memo.text}
      </span>

      <button
        onClick={() => onDelete(memo.id)}
        className="text-slate-300 transition hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
