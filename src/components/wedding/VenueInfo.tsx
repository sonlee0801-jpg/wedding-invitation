const items = [
  { t: "안내 1", d: "예식 시간 30분 전까지 도착 부탁드립니다." },
  { t: "안내 2", d: "화환은 정중히 사양합니다. 마음만 감사히 받겠습니다." },
  { t: "안내 3", d: "식사는 예식 후 같은 층 연회장에서 진행됩니다." },
];

export function VenueInfo() {
  return (
    <section className="px-6 py-8">
      <h3 className="mb-4 text-center font-serif-ko text-lg text-foreground">예식장 안내</h3>
      <div className="rounded-2xl bg-card p-5 text-card-foreground shadow-lg">
        <ul className="space-y-4">
          {items.map((it) => (
            <li key={it.t} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-primary">{it.t}</p>
              <p className="mt-1 text-sm">{it.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}