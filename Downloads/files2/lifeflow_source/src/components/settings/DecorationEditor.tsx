import { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { Decoration } from "./SettingsTypes";

interface DecorationEditorProps {
  decorations: Decoration[];
  onChange: (decorations: Decoration[]) => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DecorationEditor({
  decorations,
  onChange,
}: DecorationEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const newDecos: Decoration[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      try {
        const dataUrl = await fileToDataUrl(file);
        newDecos.push({
          id: crypto.randomUUID(),
          image: dataUrl,
          x: 35 + Math.random() * 30,
          y: 25 + Math.random() * 40,
          size: 64,
          rotate: Math.round(Math.random() * 20 - 10),
        });
      } catch {
        // 개별 파일 읽기 실패는 건너뜀
      }
    }

    if (newDecos.length > 0) {
      onChange([...decorations, ...newDecos]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeSticker(id: string) {
    onChange(decorations.filter((d) => d.id !== id));
  }

  function resizeSticker(id: string, delta: number) {
    onChange(
      decorations.map((d) =>
        d.id === id
          ? { ...d, size: Math.min(200, Math.max(24, d.size + delta)) }
          : d
      )
    );
  }

  function handlePointerDown(id: string) {
    setDraggingId(id);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.min(96, Math.max(0, x));
    const clampedY = Math.min(90, Math.max(0, y));

    onChange(
      decorations.map((d) =>
        d.id === draggingId ? { ...d, x: clampedX, y: clampedY } : d
      )
    );
  }

  function handlePointerUp() {
    setDraggingId(null);
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
      >
        <Upload size={18} />
        이미지 스티커 추가
      </button>

      <div
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative h-64 w-full overflow-hidden rounded-2xl border-2 border-dashed"
        style={{ borderColor: "var(--theme-gray)", background: "var(--theme-bg)" }}
      >
        {decorations.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            위 버튼으로 이미지를 올리면 여기에 배치돼요
          </p>
        )}

        {decorations.map((deco) => (
          <div
            key={deco.id}
            onPointerDown={() => handlePointerDown(deco.id)}
            title="드래그해서 이동"
            className="group absolute"
            style={{
              left: `${deco.x}%`,
              top: `${deco.y}%`,
              width: `${deco.size}px`,
              height: `${deco.size}px`,
              transform: `rotate(${deco.rotate}deg)`,
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            <img
              src={deco.image}
              alt=""
              draggable={false}
              className="h-full w-full rounded-lg object-cover shadow-md"
            />

            <div className="absolute -right-2 -top-2 hidden gap-1 group-hover:flex">
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => resizeSticker(deco.id, -12)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow"
              >
                −
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => resizeSticker(deco.id, 12)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow"
              >
                +
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => removeSticker(deco.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        스티커를 드래그해서 위치를 옮기고, 마우스를 올리면 크기 조절·삭제 버튼이 나타나요.
        여기 배치한 스티커는 앱 전체 배경에도 함께 나타나요.
      </p>
    </div>
  );
}
