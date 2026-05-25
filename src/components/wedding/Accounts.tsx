import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

type Acct = { relation: string; name: string; bank: string; number: string };

const groom: Acct[] = [
  { relation: "신랑", name: "손정원", bank: "국민은행", number: "000-00-0000-000" },
  { relation: "신랑 아버지", name: "손찬", bank: "국민은행", number: "000-00-0000-000" },
  { relation: "신랑 어머니", name: "홍임숙", bank: "국민은행", number: "000-00-0000-000" },
];
const bride: Acct[] = [
  { relation: "신부", name: "이다빈", bank: "신한은행", number: "000-000-000000" },
  { relation: "신부 아버지", name: "이창일", bank: "신한은행", number: "000-000-000000" },
  { relation: "신부 어머니", name: "박정규", bank: "신한은행", number: "000-000-000000" },
];

function Row({ a }: { a: Acct }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(`${a.bank} ${a.number}`);
    setDone(true);
    toast.success("계좌번호가 복사되었습니다");
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 p-3">
      <div className="text-left">
        <p className="text-[11px] text-muted-foreground">{a.relation} {a.name}</p>
        <p className="text-sm text-foreground">{a.bank} {a.number}</p>
      </div>
      <button
        onClick={copy}
        className="rounded-full bg-primary/20 p-2 text-primary hover:bg-primary hover:text-primary-foreground transition"
      >
        {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Accounts() {
  return (
    <section className="px-6 py-8">
      <h3 className="mb-4 text-center font-serif-ko text-lg text-foreground">마음 전하실 곳</h3>
      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="g" className="rounded-xl bg-secondary/30 border-0 px-4">
          <AccordionTrigger className="text-primary hover:no-underline">신랑측 계좌번호</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {groom.map((a) => <Row key={a.name} a={a} />)}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b" className="rounded-xl bg-secondary/30 border-0 px-4">
          <AccordionTrigger className="text-primary hover:no-underline">신부측 계좌번호</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {bride.map((a) => <Row key={a.name} a={a} />)}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}