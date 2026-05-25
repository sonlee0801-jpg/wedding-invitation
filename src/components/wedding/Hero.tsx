import { ChevronDown } from "lucide-react";
import c0 from "@/assets/comic-00.jpg";
import c1 from "@/assets/comic-01.jpg";
import c2 from "@/assets/comic-02.jpg";
import c3 from "@/assets/comic-03.jpg";
import c4 from "@/assets/comic-04.jpg";
import c5 from "@/assets/comic-05.jpg";
import c6 from "@/assets/comic-06.jpg";

const comics = [c0, c1, c2, c3, c4, c5, c6];

export function Hero() {
  return (
    <section className="relative bg-white">
      <div className="flex flex-col">
        {comics.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`웨딩 만화 ${i + 1}`}
            className="block w-full"
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce-soft">
        <ChevronDown className="h-7 w-7 text-primary drop-shadow" />
      </div>
    </section>
  );
}