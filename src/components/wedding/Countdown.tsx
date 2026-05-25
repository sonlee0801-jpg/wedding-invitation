import { useEffect, useState } from "react";

// Wedding date placeholder — update as needed
export const WEDDING_DATE = new Date("2026-11-22T11:50:00+09:00");

function diff(target: Date) {
  const now = new Date();
  const ms = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Cal() {
  const y = WEDDING_DATE.getFullYear();
  const m = WEDDING_DATE.getMonth();
  const day = WEDDING_DATE.getDate();
  const first = new Date(y, m, 1).getDay();
  const last = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= last; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-2xl bg-secondary/40 p-4 backdrop-blur">
      <p className="mb-3 text-center text-sm text-foreground/80">
        {y}년 {m + 1}월
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {labels.map((l, i) => (
          <div key={l} className={i === 0 ? "text-red-300" : "text-foreground/60"}>{l}</div>
        ))}
        {cells.map((d, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {d ? (
              <span
                className={
                  d === day
                    ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                    : "text-foreground/75"
                }
              >
                {d}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Countdown() {
  const [t, setT] = useState(() => diff(WEDDING_DATE));
  useEffect(() => {
    const id = setInterval(() => setT(diff(WEDDING_DATE)), 1000);
    return () => clearInterval(id);
  }, []);
  const dateStr = `${WEDDING_DATE.getFullYear()}년 ${WEDDING_DATE.getMonth() + 1}월 ${WEDDING_DATE.getDate()}일 ${WEDDING_DATE.getHours()}시`;
  return (
    <section className="px-6 py-8 text-center">
      <h3 className="mb-2 font-serif-ko text-lg text-foreground">결혼합니다</h3>
      <p className="mb-5 text-sm text-foreground/70">{dateStr}</p>
      <Cal />
      <div className="mt-6 grid grid-cols-4 gap-2">
        {[
          { l: "DAYS", v: t.days },
          { l: "HOUR", v: t.hours },
          { l: "MIN", v: t.minutes },
          { l: "SEC", v: t.seconds },
        ].map((it) => (
          <div key={it.l} className="rounded-xl bg-secondary/40 py-3">
            <p className="text-xl font-bold text-primary tabular-nums">
              {String(it.v).padStart(2, "0")}
            </p>
            <p className="text-[10px] text-foreground/60 mt-0.5">{it.l}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-foreground/80 font-serif-ko">
        손정원 ❤️ 이다빈의 결혼식이{" "}
        <span className="text-primary font-bold">{t.days}일</span> 남았습니다
      </p>
    </section>
  );
}