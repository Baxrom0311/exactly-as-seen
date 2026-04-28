import { useEffect, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/i18n/LangProvider";
import { mockApi } from "@/api/mockApi";
import { ChatMessage } from "@/api/types";
import { cn } from "@/lib/utils";

export default function Chat() {
  const { t } = useLang();
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { mockApi.chatHistory().then(setMsgs); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: "u_" + Date.now(), role: "user", text, timestamp: new Date().toISOString() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const ai = await mockApi.sendChat(text);
    setTyping(false);
    setMsgs((m) => [...m, ai]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur px-6 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full gradient-primary grid place-items-center text-primary-foreground">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold">{t.chat.title}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            {typing ? (
              <>
                <span className="flex gap-0.5">
                  <span className="typing-dot inline-block h-1 w-1 rounded-full bg-primary" />
                  <span className="typing-dot inline-block h-1 w-1 rounded-full bg-primary" />
                  <span className="typing-dot inline-block h-1 w-1 rounded-full bg-primary" />
                </span>
                {t.chat.typing}
              </>
            ) : (
              <>🟢 {t.chat.online}</>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        <div className="max-w-2xl mx-auto space-y-3">
          {msgs.map((m) => (
            <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "ai" && (
                <div className="h-8 w-8 rounded-full gradient-primary grid place-items-center text-primary-foreground shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap text-sm",
                m.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-sm shadow-elegant"
                  : "bg-card border border-border rounded-bl-sm shadow-sm")}>
                {m.text}
                {m.role === "ai" && m.suggestedActions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.suggestedActions.map((a, i) => (
                      <Button key={i} size="sm" variant="outline" className="text-xs h-7">{a.label}</Button>
                    ))}
                  </div>
                )}
                {m.role === "ai" && m.riskFlag && (
                  <div className="mt-3 rounded-xl border-2 border-destructive/40 bg-destructive/5 p-3 text-xs">
                    <div className="font-semibold mb-1">💛 {t.chat.crisis}</div>
                    <div className="text-muted-foreground">{t.chat.hotline}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2 justify-start">
              <div className="h-8 w-8 rounded-full gradient-primary grid place-items-center text-primary-foreground"><Bot className="h-4 w-4" /></div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="typing-dot inline-block h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="typing-dot inline-block h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="typing-dot inline-block h-2 w-2 rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick chips */}
      <div className="px-4 py-2 border-t border-border bg-card/40">
        <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {t.chat.quick.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-base font-medium"
            >{q}</button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/60 backdrop-blur px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder={t.chat.placeholder}
              rows={1}
              className="min-h-10 resize-none rounded-2xl"
            />
            <Button size="icon" disabled={!input.trim()} onClick={() => send(input)} className="rounded-2xl shrink-0 h-10 w-10">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-[10px] text-center text-muted-foreground">{t.chat.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
