import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";

import { Reveal, Stagger, Item } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * True only after the first client render. Used to keep SSR and the first
 * hydration render identical (final, static state) and to enable entrance
 * animations afterwards — mirrors the guard in `reveal.tsx`.
 */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* -------------------------------------------------------------------------- */
/* Data-viz primitives                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Number that counts up from 0 once it scrolls into view (easeOutCubic).
 * Respects reduced-motion and SSR by rendering the final value immediately.
 */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // Always start at 0 so the server and first client render agree (avoids a
  // hydration mismatch). The effect resolves the final value after mount.
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

/** Single horizontal bar that grows to `pct`% width when scrolled into view. */
function Bar({ pct, className, delay = 0 }: { pct: number; className: string; delay?: number }) {
  const reduced = useReducedMotion();
  const animate = useMounted() && !reduced;
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
      <motion.div
        className={cn("h-full rounded-full", className)}
        initial={animate ? { width: 0 } : false}
        whileInView={animate ? { width: `${pct}%` } : undefined}
        style={animate ? undefined : { width: `${pct}%` }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      />
    </div>
  );
}

type Segment = { label: string; pct: number; className: string };

/** Stacked segmented bar (e.g. the 10/20/70 split) — each segment grows in turn. */
function SegmentedBar({ segments }: { segments: Segment[] }) {
  const reduced = useReducedMotion();
  const animate = useMounted() && !reduced;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {segments.map((s, i) => (
          <motion.div
            key={s.label}
            className={cn("h-full", s.className)}
            initial={animate ? { width: 0 } : false}
            whileInView={animate ? { width: `${s.pct}%` } : undefined}
            style={animate ? undefined : { width: `${s.pct}%` }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.12 * i }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-[2px]", s.className)} />
            <span className="font-mono text-[11px] text-muted-foreground">
              <span className="text-foreground">{s.pct}%</span> {s.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Framed panel that wraps each mistake's visualization, with a cited source. */
function VizPanel({ source, children }: { source: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-7">
      {children}
      <p className="mt-6 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Fonte · {source}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mistake block                                                              */
/* -------------------------------------------------------------------------- */

function Mistake({
  n,
  title,
  children,
  viz,
}: {
  n: number;
  title: string;
  children: ReactNode;
  viz: ReactNode;
}) {
  return (
    <Reveal as="article" className="border-t border-border py-12 first:border-t-0 md:py-16">
      <div className="grid items-start gap-x-12 gap-y-8 md:grid-cols-12">
        <div className="md:col-span-6 lg:col-span-5">
          <div className="flex items-baseline gap-3 font-mono text-sm font-medium tabular-nums text-accent">
            {String(n).padStart(2, "0")}
            <span className="text-muted-foreground/50">/ 03</span>
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold leading-snug tracking-tight md:text-[1.75rem]">
            {title}
          </h3>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            {children}
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">{viz}</div>
      </div>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function WhyAiProjectsFail() {
  return (
    <section id="por-que-falham" className="border-b border-border py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* Thesis */}
        <Reveal className="max-w-3xl">
          <SectionLabel index="02">Por que projetos falham</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.75rem]">
            Quase nenhum projeto de IA falha pela ferramenta.{" "}
            <span className="text-highlight">Falha pela estratégia.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            A maioria das iniciativas de IA não morre por escolher o modelo errado — morre por ser
            aplicada no lugar errado, do jeito errado. Estes são os três erros que mais se repetem.
          </p>
        </Reveal>

        {/* Mistakes */}
        <div className="mt-12 md:mt-16">
          <Mistake
            n={1}
            title="Implantam IA onde aparece — não onde funciona."
            viz={
              <VizPanel source="MIT">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Orçamento de IA nas empresas
                </p>
                <p className="mt-3 font-display text-5xl font-semibold tracking-tight text-foreground">
                  <CountUp to={50} suffix="%" />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  vai direto para vendas e marketing.
                </p>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>Vendas &amp; Marketing</span>
                      <span className="text-foreground">50%</span>
                    </div>
                    <Bar pct={50} className="bg-muted-foreground/50" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>Back-office · operações · jurídico · financeiro</span>
                      <span className="text-highlight">maior ROI</span>
                    </div>
                    <Bar pct={88} className="bg-highlight" delay={0.25} />
                  </div>
                </div>
              </VizPanel>
            }
          >
            <p>
              O MIT mapeou para onde vai o orçamento de IA: metade segue direto para vendas e
              marketing. Mas os maiores retornos comprovados estão no back-office — operações,
              jurídico e financeiro.
            </p>
            <p>
              São áreas onde uma boa implementação gera impacto enorme em empresas de médio a grande
              porte, podendo significar <strong className="text-foreground">milhões em redução de
              contratos terceirizados</strong>. O problema: investe-se onde é fácil mostrar resultado
              para o board e os investidores — não onde o retorno é real.
            </p>
          </Mistake>

          <Mistake
            n={2}
            title="Tentam construir o próprio modelo. Deveriam usar um que já existe."
            viz={
              <VizPanel source="AI OPS">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Construir vs. usar
                </p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-destructive/30 bg-destructive/[0.06] p-4">
                    <div className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                      <X className="h-4 w-4 text-destructive" />
                      Construir um LLM do zero
                    </div>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                      tempo · capital · infraestrutura para sustentar o processamento
                    </p>
                  </div>
                  <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-4">
                    <div className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      Usar um modelo de fronteira
                    </div>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                      Claude · Gemini · GPT — atualizados toda semana, bilhões investidos
                    </p>
                  </div>
                </div>
              </VizPanel>
            }
          >
            <p>
              Acontece em poucos casos, mas vale o alerta: construir um LLM do zero exige tempo,
              capital e — acima de tudo — infraestrutura para sustentar o poder de processamento.
            </p>
            <p>
              Enquanto isso, modelos como Claude, Gemini e GPT são atualizados praticamente toda
              semana, com bilhões de dólares por trás. Insistir em construir o próprio modelo raramente
              é estratégia. <strong className="text-foreground">Quase sempre é orgulho.</strong>
            </p>
          </Mistake>

          <Mistake
            n={3}
            title="Confundem piloto com transformação."
            viz={
              <VizPanel source="BCG">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  A regra 10 / 20 / 70 — onde mora o sucesso
                </p>
                <div className="mt-5">
                  <SegmentedBar
                    segments={[
                      { label: "Algoritmo", pct: 10, className: "bg-muted-foreground/40" },
                      { label: "Tecnologia & dados", pct: 20, className: "bg-accent/70" },
                      { label: "Pessoas & mudança", pct: 70, className: "bg-highlight" },
                    ]}
                  />
                </div>
                <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Como a maioria executa — invertido
                </p>
                <div className="mt-5">
                  <SegmentedBar
                    segments={[
                      { label: "Escolha da ferramenta", pct: 70, className: "bg-foreground/25" },
                      { label: "Tecnologia & dados", pct: 20, className: "bg-accent/40" },
                      { label: "Pessoas", pct: 10, className: "bg-highlight" },
                    ]}
                  />
                </div>
              </VizPanel>
            }
          >
            <p>
              Um estudo da BCG com centenas de organizações revelou um padrão — a regra{" "}
              <strong className="text-foreground">10/20/70</strong>: 10% do sucesso vem do algoritmo,
              20% da tecnologia e dos dados, e 70% da gestão de pessoas e da mudança.
            </p>
            <p>
              A maioria das empresas inverte a conta: gasta 70% escolhendo a ferramenta, 20% em
              tecnologia e dados e apenas 10% no que realmente decide — como as pessoas vão trabalhar.
              Resultado: o projeto <strong className="text-foreground">nunca sai do piloto.</strong>
            </p>
          </Mistake>
        </div>

        {/* Provocation */}
        <Reveal className="mt-16 border-t border-border pt-16 text-center md:mt-20 md:pt-20">
          <p className="mx-auto max-w-3xl font-display text-2xl font-semibold leading-snug tracking-tight md:text-[2rem]">
            Empresas não falham por escolher a IA errada. Falham por implantá-la na área errada e
            nunca sair do piloto.
          </p>
          <p className="mt-6 font-display text-xl font-medium text-muted-foreground md:text-2xl">
            Muitas estão cometendo esse erro agora.{" "}
            <span className="text-highlight">E a sua — é uma delas?</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
