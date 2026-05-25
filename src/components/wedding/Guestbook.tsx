import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitToAppsScript } from "@/lib/submit-form";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5UqKbNXU-MC5gv5ZgRCh4LDGpIld0-avSrji2fG5DR3ztEeacMO0k86M1zILm-1njMA/exec";

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

export function Guestbook() {
  const [items, setItems] = useState<Msg[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  // 방명록 불러오기 — CORS 문제로 직접 fetch 불가, 로컬 상태만 유지
  // (페이지 새로고침 시 시트에서 불러오려면 별도 백엔드 필요)

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
      setItems((prev) => [newItem, ...prev]);
      setAuthor("");
      setContent("");
      toast.success("축하 메시지가 등록되었습니다 🎉");
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
    </section>
  );
}
