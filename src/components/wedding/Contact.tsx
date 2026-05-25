import { useState } from "react";
import { Phone, MessageSquare, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Person = { relation: string; name: string; phone: string };

const groom: Person[] = [
  { relation: "신랑", name: "손정원", phone: "01000000000" },
  { relation: "아버지", name: "손찬", phone: "01000000000" },
  { relation: "어머니", name: "홍임숙", phone: "01000000000" },
];
const bride: Person[] = [
  { relation: "신부", name: "이다빈", phone: "01000000000" },
  { relation: "아버지", name: "이창일", phone: "01000000000" },
  { relation: "어머니", name: "박정규", phone: "01000000000" },
];

function Column({ title, people }: { title: string; people: Person[] }) {
  return (
    <div className="flex-1">
      <h4 className="mb-3 text-center text-sm font-bold text-primary">{title}</h4>
      <div className="space-y-3">
        {people.map((p) => (
          <div key={p.relation + p.name} className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">{p.relation}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{p.name}</p>
            <div className="mt-2 flex justify-center gap-2">
              <a
                href={`tel:${p.phone}`}
                className="rounded-full bg-primary/20 p-1.5 text-primary hover:bg-primary hover:text-primary-foreground transition"
                aria-label="전화"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
              <a
                href={`sms:${p.phone}`}
                className="rounded-full bg-primary/20 p-1.5 text-primary hover:bg-primary hover:text-primary-foreground transition"
                aria-label="문자"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  const [open, setOpen] = useState(false);
  return (
    <section className="px-8 py-6 text-center">
      <h3 className="mb-4 font-serif-ko text-lg text-foreground">연락처</h3>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
            연락하기
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[440px] dot-pattern bg-card text-card-foreground border-0 [&>button]:hidden">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 rounded-full p-1 text-foreground/60 hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="mb-4 text-center font-serif-ko text-base">소중한 마음을 전해주세요</h3>
          <div className="flex gap-3">
            <Column title="신랑측" people={groom} />
            <Column title="신부측" people={bride} />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}