import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitToAppsScript } from "@/lib/submit-form";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5UqKbNXU-MC5gv5ZgRCh4LDGpIld0-avSrji2fG5DR3ztEeacMO0k86M1zILm-1njMA/exec";

// ✅ 구글 시트 "웹에 게시" CSV URL
// 방법: 구글 시트 → 파일 → 웹에 게시 → "방명록" 탭 선택 → CSV → 게시 → URL 복사 후 아래에 붙여넣기
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTIYnedtqXXJ7T3gBSOrPOyZX9RlhyQ8EYb2ZLsvSxhiZmfEr8CQbo_ZrW9GtYINJLTbi585T_7hIgH/pub?gid=1725540800&single=true&output=csv";

type Msg = { id: string; author: string; content: string; color_index: number; created_at: string };

const COLORS = [
  "bg-[#fef3a7] text-[#3a3514]",
  "bg-[#ffd6e0] text-[#4a1f2d]",
  "bg-[#a0c8f0] text-[#1a2533]",
  "bg-[#c8e6ff] text-[#15324a]",
  "bg-[#ffd8b0] text-[#4a2a14]",
  "bg-[#e6d6ff] text-[#2d1c4a]",
];
const ROTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-[0.5deg]", "-rotate-[1.5deg]"];

function parseCSV(text: string): Msg[] {
  const lines = text.trim().split("\n").slice(1); // 헤더 제외
  return lines
    .map((line, i) => {
      // CSV 파싱 (큰따옴표 포함 대응)
      const cols: string[] = [];
      let cur = "";
      let inQuote = false;
      for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        if (ch === '"') { inQuote = !inQuote; }
        else if (ch === "," && !inQuote) { cols.push(cur); cur = ""; }
        else { cur += ch; }
      }
      cols.push(cur);
      const [created_at, author, content, color_index] = cols.map(c => c.trim().replace(/^"|"$/g, ""));
      if (!author || !content) return null;
      return { id: `row-${i}`, author, content, color_index: parseInt(color_index ?? "0") || 0, created_at };
    })
    .filter(Boolean) as Msg[];
}

export function Guestbook() {
  const [items, setItems] = useState<Msg[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!SHEET_CSV_URL || SHEET_CSV_URL.startsWith("여기에")) { setLoading(false); return; }
    try {
      const res = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`); // 캐시 방지
      const text = await res.text();
      setItems(parseCSV(text));
    } catch {
      // 불러오기 실패는 조용히 무시
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const submit = async () => {
    if (!author.trim() || !content.trim()) {
      toast.error("이름과 메시지를 입력해주세요");
      return;
    }
    setBusy(true);
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    const newItem: Msg = {
      id: `${Date.now()}`,
      author: author.trim(),
      content: content.trim(),
      color_index: colorIndex,
      created_at: new Date().toLocaleString("ko-KR"),
    };
    try {
      await submitToAppsScript(APPS_SCRIPT_URL, {
        type: "guestbook",
        author: newItem.author,
        content: newItem.content,
        color_index: colorIndex,
      });
      // 낙관적 업데이트: 시트에서 다시 불러오기
      setItems((prev) => [newItem, ...prev]);
      setAuthor("");
      setContent("");
      toast.success("축하 메시지가 등록되었습니다 🎉");
      // 3초 후 시트에서 최신 데이터 재조회
      setTimeout(fetchMessages, 3000);
    } catch {
      toast.error("등록 실패. 다시 시도해주세요");
    } finally {
      setBusy(false);
    }
  };

  const cols: Msg[][] = [[], []];
  items.forEach((m, i) => cols[i % 2].push(m));

  return (
    <section className="px-6 py-8">
      <h3 className="mb-4 text-center font-serif-ko text-lg text-foreground">축하 메시지</h3>
      <div className="space-y-2 rounded-2xl bg-secondary/30 p-4">
        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
          maxLength={30}
          className="bg-background/70 border-border text-foreground"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="축하 메시지를 남겨주세요"
          maxLength={500}
          className="bg-background/70 border-border text-foreground min-h-[80px]"
        />
        <Button
          onClick={submit}
          disabled={busy}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
        >
          {busy ? "등록중..." : "메시지 남기기"}
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-center text-xs text-foreground/50">메시지 불러오는 중...</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {cols.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-3">
                {col.map((m) => {
                  const c = COLORS[m.color_index % COLORS.length];
                  const r = ROTS[m.color_index % ROTS.length];
                  return (
                    <div key={m.id} className={`${c} ${r} rounded-md p-3 shadow-md font-serif-ko`}>
                      <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">{m.content}</p>
                      <p className="mt-2 text-[11px] opacity-70 text-right">— {m.author}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {items.length === 0 && (
            <p className="mt-4 text-center text-xs text-foreground/50">첫 번째 축하 메시지를 남겨주세요</p>
          )}
        </>
      )}
    </section>
  );
}
