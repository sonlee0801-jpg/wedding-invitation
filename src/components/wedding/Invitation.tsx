import { Star } from "lucide-react";

export function Invitation() {
  return (
    <section className="px-8 py-12 text-center text-foreground animate-fade-up">
      <div className="mb-6 flex justify-center gap-2">
        <Star className="h-3 w-3 fill-primary text-primary" />
        <Star className="h-4 w-4 fill-primary text-primary" />
        <Star className="h-3 w-3 fill-primary text-primary" />
      </div>
      <p className="font-serif-ko text-[15px] leading-loose text-foreground/90">
        손찬 · 홍임숙의 장남 <span className="text-primary font-bold">손정원</span>
        <br />
        이창일 · 박정규의 차녀 <span className="text-primary font-bold">이다빈</span>
      </p>
      <div className="my-8 h-px w-16 mx-auto bg-primary/50" />
      <p className="font-serif-ko text-[15px] leading-[2] text-foreground/85">
        오랜 시간 걸음 지키며
        <br />
        서로의 하루가 되어주었습니다.
        <br />
        <br />
        이제 부부라는 이름으로
        <br />
        같은 방향을 걸어가려 합니다.
        <br />
        <br />
        이 뜻깊은 시작의 자리에
        <br />
        소중한 분들을 정중히 초대합니다.
      </p>
      <p className="mt-8 font-serif-ko text-sm text-primary">
        손정원 · 이다빈 드림
      </p>
    </section>
  );
}