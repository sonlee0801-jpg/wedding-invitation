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
          author: item