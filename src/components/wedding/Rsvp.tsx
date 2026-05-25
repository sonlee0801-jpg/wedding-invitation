import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { submitToAppsScript } from "@/lib/submit-form";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5UqKbNXU-MC5gv5ZgRCh4LDGpIld0-avSrji2fG5DR3ztEeacMO0k86M1zILm-1njMA/exec";

function Toggle({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
            value === o
              ? "bg-primary text-primary-foreground border-primary font-bold"
              : "bg-secondary/40 text-foreground border-border"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Rsvp() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState("신랑측");
  const [attendance, setAttendance] = useState("참석");
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [companion, setCompanion] = useState("");
  const [meal, setMeal] = useState("예정");
  const [hideToday, setHideToday] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (localStorage.getItem("rsvp_hide") === today) return;
    const t = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("성함을 입력해주세요");
      return;
    }
    setBusy(true);
    try {
      await submitToAppsScript(APPS_SCRIPT_URL, {
        type: "rsvp",
        side,
        name: name.trim(),
        attendance,
        guest_count: count ? parseInt(count, 10) : null,
        companion: companion.trim() || null,
        meal_preference: meal,
      });
      if (hideToday) localStorage.setItem("rsvp_hide", new Date().toDateString());
      toast.success("참석 의사가 전달되었습니다 💌");
      setOpen(false);
    } catch {
      toast.error("전송 실패. 다시 시도해주세요");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="px-6 py-8 text-center">
      <h3 className="mb-4 font-serif-ko text-lg text-foreground">참석 여부</h3>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
            참석 의사 전달하기
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mx-auto max-w-[480px] bg-background border-border">
          <DrawerTitle className="sr-only">참석 의사 전달</DrawerTitle>
          <div className="px-6 pb-8 pt-4 space-y-4 text-left">
            <h3 className="text-center font-serif-ko text-lg text-foreground">참석 의사 전달</h3>
            <div>
              <Label className="text-xs text-foreground/70">구분</Label>
              <div className="mt-1.5"><Toggle value={side} options={["신랑측", "신부측"]} onChange={setSide} /></div>
            </div>
            <div>
              <Label className="text-xs text-foreground/70">참석 여부</Label>
              <div className="mt-1.5"><Toggle value={attendance} options={["참석", "불참석"]} onChange={setAttendance} /></div>
            </div>
            <div>
              <Label className="text-xs text-foreground/70">성함</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="성함" className="mt-1.5 bg-secondary/40 border-border text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-foreground/70">참석인원</Label>
                <Input value={count} onChange={(e) => setCount(e.target.value)} placeholder="총 인원" inputMode="numeric" className="mt-1.5 bg-secondary/40 border-border text-foreground" />
              </div>
              <div>
                <Label className="text-xs text-foreground/70">동행인</Label>
                <Input value={companion} onChange={(e) => setCompanion(e.target.value)} placeholder="함께 오시는 분" className="mt-1.5 bg-secondary/40 border-border text-foreground" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-foreground/70">식사여부</Label>
              <div className="mt-1.5"><Toggle value={meal} options={["예정", "안함", "미정"]} onChange={setMeal} /></div>
            </div>
            <Button onClick={submit} disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              {busy ? "전송중..." : "참석 의사 전달하기"}
            </Button>
            <label className="flex items-center justify-center gap-2 text-xs text-foreground/70 cursor-pointer">
              <Checkbox checked={hideToday} onCheckedChange={(v) => setHideToday(Boolean(v))} />
              오늘 하루 보지 않기
            </label>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}
