import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ⚠️ 본인의 구글 앱스 스크립트 배포 URL로 반드시 교체하세요.
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz5UqKbNXU-MC5gv5ZgRCh4LDGpIld0-avSrji2fG5DR3ztEeacMO0k86M1zILm-1njMA/exec";

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

  // 구글 시트에서 데이터 불러오기 함수
  const loadMessages = async () => {
    try {
      const response = await fetch(WEB_APP_URL);
      const result = await response.json();

      if (result.status === "success" && result.data) {
        // 구글 시트 데이터(name, message, date)를 기존 UI 구조(Msg)에 맞게 변환
        const formattedData = result.data.map((item: any, index: number) => ({
          id: item.date + index, // 고유 키값 생성
          author: item.name,
          content: item.message,
          color_index: index, // 순서대로 색상/회전값 부여
          created_at: item.date,
        }));
        setItems(formattedData);
      }
    } catch (error) {
      console.error("방명록 불러오기 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 최초 1회 데이터 로드
  useEffect(() => {
    loadMessages();
  }, []);

  // 방명록 저장 함수
  const submit = async () => {
    if (!author.trim() || !content.trim()) {
      toast.error("이름과 메시지를 입력해주세요");
      return;
    }
    setBusy(true);
    
    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        // 구글 Apps Script CORS(Preflight) 에러 방지를 위해 text/plain 사용
        headers: {
          "Content-Type": "text/plain;charset=utf-8", 
        },
        body: JSON.stringify({
          name: author.trim().slice(0, 30),
          message: content.trim().slice(0, 500),
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setAuthor("");
        setContent("");
        toast.success("축하 메시지가 등록되었습니다");
        
        // 저장이 완료되면 목록을 즉시 다시 불러와 화면 갱신
        await loadMessages();
      } else {
        toast.error("등록 실패: " + result.message);
      }
    } catch (error) {
      console.error("방명록 저장 실패:", error);
      toast.error("등록 중 오류가 발생했습니다.");
    } finally {
      setBusy(false);
    }
  };

  // split into 2 columns for masonry
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
      {items.length === 0 && !busy && (
        <p className="mt-4 text-center text-xs text-foreground/50">첫 번째 축하 메시지를 남겨주세요</p>
      )}
    </section>
  );
}