import { MapPin, Navigation, Car, Train } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADDRESS = "경기도 안산시 단원구 광덕1로 171";

export function Location() {
  const naver = `https://map.naver.com/v5/search/${encodeURIComponent(ADDRESS)}`;
  const kakao = `https://map.kakao.com/?q=${encodeURIComponent(ADDRESS)}`;
  return (
    <section className="px-6 py-8">
      <h3 className="mb-4 text-center font-serif-ko text-lg text-foreground">오시는 길</h3>
      <div className="overflow-hidden rounded-2xl border border-border">
        <iframe
          title="지도"
          className="block h-56 w-full"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
        />
      </div>
      <div className="mt-4 flex items-start gap-2 text-sm text-foreground/85">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>{ADDRESS}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          <a href={naver} target="_blank" rel="noreferrer">
            <Navigation className="mr-1 h-4 w-4" /> 네이버지도
          </a>
        </Button>
        <Button asChild variant="outline" className="flex-1 border-primary/40 text-primary hover:bg-primary/10">
          <a href={kakao} target="_blank" rel="noreferrer">
            <Navigation className="mr-1 h-4 w-4" /> 카카오맵
          </a>
        </Button>
      </div>
      <div className="mt-5 space-y-3 rounded-xl bg-secondary/40 p-4 text-sm text-foreground/85">
        <div className="flex gap-3">
          <Car className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <p><span className="font-bold text-primary">주차</span> · 예식장 지하 주차장 2시간 무료</p>
        </div>
        <div className="flex gap-3">
          <Train className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <p><span className="font-bold text-primary">대중교통</span> · 지하철 4호선 중앙역 도보 7분</p>
        </div>
      </div>
    </section>
  );
}