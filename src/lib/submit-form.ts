/**
 * Apps Script CORS 우회: hidden iframe + form submit 방식
 * fetch는 CORS로 막히지만, form submit은 same-origin 제한 없음
 */
export function submitToAppsScript(url: string, data: Record<string, unknown>): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframeId = `_aps_iframe_${Date.now()}`;
    const formId = `_aps_form_${Date.now()}`;

    const iframe = document.createElement("iframe");
    iframe.name = iframeId;
    iframe.id = iframeId;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.target = iframeId;
    form.style.display = "none";
    form.id = formId;

    // 데이터를 단일 필드 "payload"로 직렬화
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "payload";
    input.value = JSON.stringify(data);
    form.appendChild(input);
    document.body.appendChild(form);

    let done = false;
    const cleanup = () => {
      try { document.body.removeChild(iframe); } catch {}
      try { document.body.removeChild(form); } catch {}
    };

    iframe.onload = () => {
      if (done) return;
      done = true;
      cleanup();
      resolve();
    };

    setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      reject(new Error("timeout"));
    }, 10000);

    form.submit();
  });
}
