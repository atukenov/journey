"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiCheck, FiDownload, FiUpload, FiRotateCcw } from "react-icons/fi";
import { useJourney } from "@/lib/store";
import { Content, QuestStop } from "@/lib/content";

/**
 * Скрытая админ-панель организатора.
 * Пароль по умолчанию: forever (меняется здесь же, вкладка «Контент»).
 */

const AUTH_KEY = "our-journey:admin";

type Tab = "checklist" | "dinner" | "content" | "answers" | "service";

export default function AdminPage() {
  const { content, hydrated } = useJourney();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
  }, []);

  if (!hydrated) return <div className="flex-1" />;

  if (!authed) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === content.adminPassword) {
              sessionStorage.setItem(AUTH_KEY, "1");
              setAuthed(true);
            } else {
              setError(true);
              setPassword("");
            }
          }}
          className="glass rounded-3xl p-10 w-full max-w-sm text-center"
        >
          <FiLock className="mx-auto mb-5 text-gold" size={24} />
          <h1 className="font-display text-2xl mb-6">Панель организатора</h1>
          <input
            type="password"
            className="input-soft text-center mb-4"
            placeholder="пароль"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            autoFocus
          />
          {error && <p className="text-sm text-blush mb-4">Неверный пароль</p>}
          <button type="submit" className="btn-primary w-full justify-center">
            Войти
          </button>
        </form>
      </main>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [tab, setTab] = useState<Tab>("checklist");
  const tabs: { id: Tab; label: string }[] = [
    { id: "checklist", label: "Чек-лист" },
    { id: "dinner", label: "Ужин" },
    { id: "content", label: "Контент" },
    { id: "answers", label: "Её ответы" },
    { id: "service", label: "Сервис" },
  ];

  return (
    <main className="flex-1 px-6 py-16 max-w-3xl mx-auto w-full">
      <h1 className="font-display text-3xl mb-8">Панель организатора</h1>
      <div className="flex flex-wrap gap-2 mb-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 ${
              tab === t.id
                ? "bg-gold text-surface-strong shadow-lg"
                : "glass text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "checklist" && <ChecklistTab />}
      {tab === "dinner" && <DinnerTab />}
      {tab === "content" && <ContentTab />}
      {tab === "answers" && <AnswersTab />}
      {tab === "service" && <ServiceTab />}
    </main>
  );
}

/* ───────────────────────────── Чек-листы ─────────────────────────────── */

function CheckItem({ id, label }: { id: string; label: string }) {
  const { checks, toggleCheck } = useJourney();
  const done = Boolean(checks[id]);
  return (
    <button
      onClick={() => toggleCheck(id)}
      className="flex items-center gap-3 w-full text-left py-2.5 group"
    >
      <span
        className={`flex items-center justify-center h-6 w-6 rounded-lg border transition-all duration-300 shrink-0 ${
          done ? "bg-gold border-gold-deep" : "border-line bg-surface-strong group-hover:border-gold"
        }`}
      >
        {done && <FiCheck size={14} className="text-surface-strong" />}
      </span>
      <span
        className={`transition-all duration-300 ${
          done ? "line-through text-ink-faint" : "text-ink"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function ChecklistTab() {
  const { content, checks } = useJourney();
  const total = content.checklist.reduce((n, s) => n + s.items.length, 0);
  const done = content.checklist.reduce(
    (n, s, si) => n + s.items.filter((_, ii) => checks[`cl:${si}:${ii}`]).length,
    0
  );

  return (
    <div>
      <div className="glass rounded-2xl p-5 mb-6">
        <div className="flex justify-between text-sm text-ink-soft mb-2">
          <span>Готовность</span>
          <span>{done} / {total}</span>
        </div>
        <div className="h-2 rounded-full bg-gold-soft overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-deep))" }}
            animate={{ width: `${total ? (done / total) * 100 : 0}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {content.checklist.map((section, si) => (
          <div key={section.title} className="glass rounded-2xl p-6">
            <h3 className="font-display text-xl mb-3">{section.title}</h3>
            {section.items.map((item, ii) => (
              <CheckItem key={ii} id={`cl:${si}:${ii}`} label={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DinnerTab() {
  const { content } = useJourney();
  return (
    <div className="glass rounded-2xl p-6 max-w-md">
      <h3 className="font-display text-xl mb-1">Список покупок</h3>
      <p className="text-sm text-ink-faint mb-4">Ужин перед самым важным вопросом</p>
      {content.dinnerList.map((item, i) => (
        <CheckItem key={i} id={`dn:${i}`} label={item} />
      ))}
    </div>
  );
}

/* ───────────────────────────── Контент ───────────────────────────────── */

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-xs tracking-widest uppercase text-ink-faint mb-1.5">
        {label}
      </span>
      {multiline ? (
        <textarea
          className="input-soft min-h-[90px] resize-y"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="input-soft"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function ContentTab() {
  const { content, updateContent } = useJourney();

  const patchStop = (id: string, patch: Partial<QuestStop>) => {
    updateContent({
      stops: content.stops.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const patch = <K extends keyof Content>(key: K, value: Content[K]) =>
    updateContent({ [key]: value } as Partial<Content>);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-soft">
        Изменения сохраняются сразу на этом устройстве. Открой сайт на её
        телефоне и настрой там же — или перенеси экспортом во вкладке «Сервис».
      </p>

      <details className="glass rounded-2xl p-6" open>
        <summary className="font-display text-xl cursor-pointer">Мы</summary>
        <div className="mt-4">
          <Field label="Твоё имя" value={content.couple.name1} onChange={(v) => patch("couple", { ...content.couple, name1: v })} />
          <Field label="Её имя" value={content.couple.name2} onChange={(v) => patch("couple", { ...content.couple, name2: v })} />
          <Field label="Дата начала отношений (ГГГГ-ММ-ДД)" value={content.couple.startDate} onChange={(v) => patch("couple", { ...content.couple, startDate: v })} />
          <Field label="Дата и время предложения (ГГГГ-ММ-ДДTЧЧ:ММ:СС)" value={content.couple.proposalDateTime} onChange={(v) => patch("couple", { ...content.couple, proposalDateTime: v })} />
        </div>
      </details>

      <details className="glass rounded-2xl p-6">
        <summary className="font-display text-xl cursor-pointer">Вступление и главы</summary>
        <div className="mt-4">
          <Field label="Название" value={content.opening.title} onChange={(v) => patch("opening", { ...content.opening, title: v })} />
          <Field label="Подзаголовок" value={content.opening.subtitle} onChange={(v) => patch("opening", { ...content.opening, subtitle: v })} multiline />
          <Field label="Глава 1 — текст" value={content.story1.text} onChange={(v) => patch("story1", { ...content.story1, text: v })} multiline />
          <Field label="Глава 2 — строки (по одной на строку)" value={content.story2.lines.join("\n")} onChange={(v) => patch("story2", { ...content.story2, lines: v.split("\n").filter(Boolean) })} multiline />
        </div>
      </details>

      {content.stops.map((stop) => (
        <details key={stop.id} className="glass rounded-2xl p-6">
          <summary className="font-display text-xl cursor-pointer">
            Точка {stop.order} · {stop.name}
          </summary>
          <div className="mt-4">
            <Field label="Название места" value={stop.name} onChange={(v) => patchStop(stop.id, { name: v })} />
            <Field label="Подсказка (видна до прибытия)" value={stop.hint} onChange={(v) => patchStop(stop.id, { hint: v })} multiline />
            <Field label="Кодовое слово" value={stop.codeWord} onChange={(v) => patchStop(stop.id, { codeWord: v })} />
            <Field label="Послание" value={stop.message} onChange={(v) => patchStop(stop.id, { message: v })} multiline />
            {stop.question !== undefined && (
              <Field label="Вопрос" value={stop.question ?? ""} onChange={(v) => patchStop(stop.id, { question: v })} multiline />
            )}
            {stop.taskPrompt !== undefined && (
              <Field label="Задание" value={stop.taskPrompt ?? ""} onChange={(v) => patchStop(stop.id, { taskPrompt: v })} multiline />
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Широта" value={String(stop.lat)} onChange={(v) => patchStop(stop.id, { lat: Number(v) || stop.lat })} />
              <Field label="Долгота" value={String(stop.lng)} onChange={(v) => patchStop(stop.id, { lng: Number(v) || stop.lng })} />
            </div>
          </div>
        </details>
      ))}

      <details className="glass rounded-2xl p-6">
        <summary className="font-display text-xl cursor-pointer">Финал и предложение</summary>
        <div className="mt-4">
          <Field label="Финальная карта — послание" value={content.finalMap.message} onChange={(v) => patch("finalMap", { ...content.finalMap, message: v })} multiline />
          <Field label="Дом — послание" value={content.homeScreen.message} onChange={(v) => patch("homeScreen", { ...content.homeScreen, message: v })} multiline />
          <Field label="Предложение — строка 1" value={content.proposal.line1} onChange={(v) => patch("proposal", { ...content.proposal, line1: v })} />
          <Field label="Предложение — строка 2" value={content.proposal.line2} onChange={(v) => patch("proposal", { ...content.proposal, line2: v })} />
          <Field label="Вопрос" value={content.proposal.question} onChange={(v) => patch("proposal", { ...content.proposal, question: v })} />
        </div>
      </details>

      <details className="glass rounded-2xl p-6">
        <summary className="font-display text-xl cursor-pointer">Признания, фото, плейлист</summary>
        <div className="mt-4">
          <Field
            label="Плавающие признания (по одному на строку)"
            value={content.loveMessages.join("\n")}
            onChange={(v) => patch("loveMessages", v.split("\n").filter(Boolean))}
            multiline
          />
          <Field
            label="Фотографии — путь | подпись (по одной на строку). Файлы клади в public/photos"
            value={content.gallery.map((g) => `${g.src} | ${g.caption}`).join("\n")}
            onChange={(v) =>
              patch(
                "gallery",
                v.split("\n").filter(Boolean).map((line) => {
                  const [src, ...rest] = line.split("|");
                  return { src: src.trim(), caption: rest.join("|").trim() };
                })
              )
            }
            multiline
          />
          <Field
            label="Плейлист (по одной композиции на строку)"
            value={content.playlist.join("\n")}
            onChange={(v) => patch("playlist", v.split("\n").filter(Boolean))}
            multiline
          />
          <Field
            label="Пароль этой панели"
            value={content.adminPassword}
            onChange={(v) => patch("adminPassword", v)}
          />
        </div>
      </details>
    </div>
  );
}

/* ───────────────────────────── Ответы ────────────────────────────────── */

function AnswersTab() {
  const { content, answers } = useJourney();
  const withAnswers = content.stops.filter((s) => answers[s.id]);

  if (withAnswers.length === 0) {
    return (
      <p className="text-ink-soft">
        Пока пусто. Её слова появятся здесь по мере прохождения маршрута.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {withAnswers.map((s) => (
        <div key={s.id} className="glass rounded-2xl p-6">
          <p className="text-xs tracking-widest uppercase text-ink-faint mb-2">
            {s.name} — {s.question ?? s.taskPrompt}
          </p>
          <blockquote className="font-display italic text-lg leading-relaxed">
            «{answers[s.id]}»
          </blockquote>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────── Сервис ────────────────────────────────── */

/** Кнопка с двухшаговым подтверждением — надёжнее native confirm() в PWA */
function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  className = "",
  icon,
}: {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
  className?: string;
  icon?: React.ReactNode;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      onClick={() => {
        if (armed) {
          onConfirm();
          setArmed(false);
        } else {
          setArmed(true);
        }
      }}
      className={`btn-ghost w-full justify-center ${armed ? "!border-blush !text-blush" : ""} ${className}`}
    >
      {icon} {armed ? confirmLabel : label}
    </button>
  );
}

function ServiceTab() {
  const { content, resetProgress, resetContent, updateContent } = useJourney();
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(null), 3000);
    return () => clearTimeout(t);
  }, [done]);

  const exportAll = () => {
    const blob = new Blob(
      [JSON.stringify({ content, exportedAt: new Date().toISOString() }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "our-journey-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const data = JSON.parse(text);
        if (data.content) updateContent(data.content);
      } catch {
        alert("Не удалось прочитать файл");
      }
    });
  };

  return (
    <div className="space-y-4 max-w-md">
      <button onClick={exportAll} className="btn-ghost w-full justify-center">
        <FiDownload size={15} /> Экспортировать контент (JSON)
      </button>
      <label className="btn-ghost w-full justify-center cursor-pointer">
        <FiUpload size={15} /> Импортировать контент
        <input type="file" accept="application/json" className="hidden" onChange={importAll} />
      </label>
      <ConfirmButton
        label="Сбросить прохождение и ответы"
        confirmLabel="Точно сбросить? Ответы удалятся"
        onConfirm={() => {
          resetProgress();
          setDone("Прохождение и ответы сброшены — история начнётся с обложки");
        }}
        icon={<FiRotateCcw size={15} />}
      />
      <ConfirmButton
        label="Сбросить контент к исходному"
        confirmLabel="Точно вернуть исходные тексты?"
        onConfirm={() => {
          resetContent();
          setDone("Контент возвращён к исходному");
        }}
        className="text-blush"
        icon={<FiRotateCcw size={15} />}
      />
      {done && <p className="text-sm text-gold-deep text-center">{done}</p>}
      <p className="text-xs text-ink-faint leading-relaxed pt-2">
        Контент и прохождение живут в браузере устройства. Настрой всё на её
        телефоне заранее — или экспортируй отсюда и импортируй там.
      </p>
    </div>
  );
}
