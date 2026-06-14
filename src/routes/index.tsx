import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Brain,
  Wrench,
  Code2,
  ShieldCheck,
  Target,
  Layers,
  Sparkles,
  CheckCircle2,
  Mail,
  Menu,
} from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import heroImage from "@/assets/hero.jpg";
import { Reveal, Stagger, Item } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#problema", label: "Problema" },
  { href: "#solucao", label: "Solução" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "#diferenciais", label: "Diferenciais" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IA Operacional — Treinamento de IA aplicada para equipes corporativas" },
      {
        name: "description",
        content:
          "Capacitação prática de IA para empresas: produtividade, criação de soluções internas e desenvolvimento assistido — com método, segurança e foco em resultado.",
      },
      {
        property: "og:title",
        content: "IA Operacional — Treinamento de IA aplicada para equipes corporativas",
      },
      {
        property: "og:description",
        content:
          "Transforme equipes em usuários eficientes de IA. Diagnóstico, workshops e programas aplicados ao seu negócio.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main>
          <Hero />
          <Problem />
          <Levels />
          <Offers />
          <Differentials />
          <Governance />
          <CTA />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Brand logo — the official "AI OPS" lockup (`public/logo.png`). It already
 * carries the wordmark + tagline, so it stands alone (no adjacent text). Served
 * statically from `public/` rather than imported, so it is SSR-safe and not
 * hashed into the bundle.
 *
 * The source PNG has an opaque near-white background, so it is set on a white
 * "logo chip" — a rounded, padded badge with a hairline ring — so it reads as
 * an intentional lockup on both the dark (default) and light themes rather than
 * a pasted white rectangle.
 */
function BrandLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg bg-white px-2 py-1 shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      <img
        src="/logo.png"
        alt="AI OPS — AI Operations"
        width={577}
        height={433}
        className="h-6 w-auto select-none md:h-7"
      />
    </span>
  );
}

/**
 * Editorial section eyebrow: a tabular index number + hairline rule + label.
 * One consistent system across every section, which reads as deliberate rather
 * than the default "uppercase tracked label" repeated five times.
 */
function SectionLabel({
  index,
  children,
  className,
  tone = "default",
}: {
  index: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "feature";
}) {
  const onFeature = tone === "feature";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "font-display text-sm font-semibold tabular-nums",
          onFeature ? "text-feature-accent" : "text-accent",
        )}
      >
        {index}
      </span>
      <span
        aria-hidden
        className={cn("h-px w-8", onFeature ? "bg-white/20" : "bg-border")}
      />
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.22em]",
          onFeature ? "text-feature-muted" : "text-muted-foreground",
        )}
      >
        {children}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          aria-label="AI OPS — início"
          className={`flex items-center rounded-md ${focusRing}`}
        >
          <BrandLogo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground ${focusRing}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contato"
            className={`hidden h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex ${focusRing}`}
          >
            Falar com a gente
          </a>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Abrir menu"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-background/40 text-foreground/80 transition-colors hover:bg-accent/10 hover:text-foreground md:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined} className="w-72 border-border">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <BrandLogo />
                  <span className="sr-only">IA Operacional</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground ${focusRing}`}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#contato"
                  onClick={() => setOpen(false)}
                  className={`mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 ${focusRing}`}
                >
                  Falar com a gente
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */

function Hero() {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <motion.img
          src={heroImage}
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-95"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.95 }}
          transition={{ duration: 1.6, ease }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.18 0.06 265 / 0.55) 0%, oklch(0.18 0.06 265 / 0.85) 70%, var(--background) 100%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--highlight) 70%, transparent), transparent)",
          }}
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-6 pb-28 pt-28 md:pb-36 md:pt-40">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-feature-accent"
            style={{
              boxShadow: "0 0 0 3px color-mix(in oklab, var(--feature-accent) 25%, transparent)",
            }}
          />
          Treinamentos corporativos · IA aplicada
        </motion.span>

        <motion.h1
          className="mt-7 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          IA que vira{" "}
          <span className="relative inline-block text-highlight">
            resultado
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-1 h-[3px] origin-left rounded-full bg-highlight/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1, ease }}
            />
          </span>{" "}
          dentro da sua empresa.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease }}
        >
          Capacitamos equipes corporativas para usar Inteligência Artificial de forma prática, segura
          e orientada a resultados — aplicando as ferramentas certas em tarefas reais do dia a dia.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
        >
          <motion.a
            href="#contato"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-medium text-feature shadow-[var(--shadow-elegant)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            Solicitar diagnóstico
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
          <motion.a
            href="#solucao"
            className="inline-flex h-11 items-center justify-center rounded-md border border-white/25 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)", y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            Ver a metodologia
          </motion.a>
        </motion.div>

        <Stagger
          as="ul"
          delayChildren={0.85}
          staggerChildren={0.12}
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-8 border-t border-white/15 pt-8 text-white sm:grid-cols-3"
        >
          <Item as="li">
            <Stat k="3" v="níveis de capacitação por perfil" />
          </Item>
          <Item as="li">
            <Stat k="100%" v="aplicado às tarefas reais da empresa" />
          </Item>
          <Item as="li">
            <Stat k="0" v="dependência de plataforma proprietária" />
          </Item>
        </Stagger>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="sm:border-l sm:border-white/15 sm:pl-5">
      <dt className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{k}</dt>
      <dd className="mt-1.5 text-sm leading-snug text-white/70">{v}</dd>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Problem() {
  const items = [
    "Uso superficial de IA limitado a textos e resumos genéricos.",
    "Dificuldade em formular comandos e fornecer contexto adequado.",
    "Escolha incorreta da ferramenta para cada tipo de tarefa.",
    "Baixa capacidade de validar respostas geradas por IA.",
    "Risco de exposição de dados sensíveis por falta de orientação.",
    "Dependência de poucos colaboradores que sabem usar melhor as ferramentas.",
  ];
  return (
    <section id="problema" className="border-b border-border bg-surface py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl gap-x-16 gap-y-12 px-6 md:grid-cols-12">
        <Reveal className="md:col-span-5 md:sticky md:top-28 md:self-start">
          <SectionLabel index="01">O problema</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            O problema não é o acesso à IA. É a falta de método.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            A maior parte das empresas já experimenta IA — mas de forma desorganizada, sem critério
            e sem segurança. O resultado são ganhos pontuais que não escalam para o time.
          </p>
        </Reveal>
        <Stagger as="ul" className="space-y-3 md:col-span-7" staggerChildren={0.07}>
          {items.map((t, i) => (
            <Item
              as="li"
              key={t}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/40"
            >
              <span className="mt-0.5 font-display text-sm font-semibold tabular-nums text-accent/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed text-card-foreground md:text-base">{t}</span>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Levels() {
  const levels = [
    {
      icon: Brain,
      tag: "Nível 1",
      title: "IA para produtividade diária",
      audience: "Para todos os colaboradores",
      body: "Uso prático de IA em tarefas comuns: textos, resumos, planilhas, comunicados, atas, e-mails e planos de ação.",
      tools: ["ChatGPT", "Claude", "Gemini", "Perplexity", "Copilot"],
    },
    {
      icon: Wrench,
      tag: "Nível 2",
      title: "Criação de soluções internas",
      audience: "Para líderes e usuários-chave",
      body: "Prototipagem de ferramentas internas simples: formulários, dashboards, mini-CRMs, fluxos para RH, comercial, qualidade e financeiro.",
      tools: ["Lovable", "Airtable", "Notion", "Make", "Zapier", "Canva AI"],
    },
    {
      icon: Code2,
      tag: "Nível 3",
      title: "Desenvolvimento assistido",
      audience: "Para equipes técnicas e TI",
      body: "Uso de agentes e ambientes de desenvolvimento assistido para acelerar criação, manutenção e documentação de software.",
      tools: ["Cursor", "Claude Code", "Copilot", "Replit", "Antigravity"],
    },
  ];

  return (
    <section id="solucao" className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel index="02" className="justify-center">
            A metodologia
          </SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Três níveis de capacitação, conforme o perfil do colaborador.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Nem todos precisam aprender desenvolvimento assistido. Cada perfil aprende o que importa
            para o seu trabalho — sem ruído, sem teoria solta.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid gap-6 md:grid-cols-3" staggerChildren={0.12}>
          {levels.map(({ icon: Icon, ...l }) => (
            <Item key={l.tag} as="article" className="h-full">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-accent/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-accent/25 bg-accent/[0.08] text-accent transition-colors group-hover:border-accent/50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                    {l.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">{l.title}</h3>
                <p className="mt-1.5 text-xs font-medium text-muted-foreground">{l.audience}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{l.body}</p>
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5">
                  {l.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:border-accent/30 group-hover:text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Offers() {
  const offers = [
    {
      tag: "Início rápido",
      title: "Diagnóstico de IA",
      body: "Avaliação curta para mapear oportunidades de uso de IA na sua empresa.",
      bullets: [
        "Mapa inicial de tarefas com potencial de ganho",
        "Indicação de áreas prioritárias",
        "Sugestão de trilha de treinamento",
      ],
    },
    {
      tag: "Mais procurado",
      title: "Workshop Prático",
      body: "Treinamento de curta duração com foco em ferramentas, método e aplicações reais.",
      bullets: [
        "Equipe capacitada no uso básico e intermediário",
        "Exemplos aplicados às áreas da empresa",
        "Introdução a boas práticas de segurança",
      ],
      featured: true,
    },
    {
      tag: "Resultado completo",
      title: "Programa Aplicado",
      body: "Diagnóstico, treinamento por perfil e criação de playbook interno de IA.",
      bullets: [
        "Equipe treinada por nível de maturidade",
        "Biblioteca de prompts e fluxos",
        "Primeiros protótipos documentados",
      ],
    },
  ];

  return (
    <section id="ofertas" className="border-y border-border bg-surface py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionLabel index="03">Modelos de oferta</SectionLabel>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Três formatos para começar onde faz sentido.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Cada formato pode ser adaptado para o seu setor: indústria, serviços, RH, comercial,
            financeiro, qualidade ou jurídico.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" staggerChildren={0.14}>
          {offers.map((o) => (
            <Item key={o.title} as="article" className="h-full">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={
                  o.featured
                    ? "relative flex h-full flex-col rounded-xl bg-feature p-8 text-feature-foreground shadow-[var(--shadow-elegant)] ring-1 ring-feature-border md:-mt-4"
                    : "relative flex h-full flex-col rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
                }
              >
                <span
                  className={
                    o.featured
                      ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-feature-foreground"
                      : "inline-block w-fit rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent"
                  }
                >
                  {o.featured && <span className="h-1.5 w-1.5 rounded-full bg-feature-accent" />}
                  {o.tag}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{o.title}</h3>
                <p
                  className={
                    o.featured
                      ? "mt-3 text-sm leading-relaxed text-feature-muted"
                      : "mt-3 text-sm leading-relaxed text-muted-foreground"
                  }
                >
                  {o.body}
                </p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
                  {o.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm">
                      <CheckCircle2
                        className={
                          o.featured
                            ? "mt-0.5 h-4 w-4 shrink-0 text-feature-accent"
                            : "mt-0.5 h-4 w-4 shrink-0 text-accent"
                        }
                      />
                      <span className={o.featured ? "text-feature-foreground/90" : "text-card-foreground"}>
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
                <motion.a
                  href="#contato"
                  whileTap={{ scale: 0.97 }}
                  className={
                    o.featured
                      ? "group/btn mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-feature transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-feature"
                      : `group/btn mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent ${focusRing}`
                  }
                >
                  Saber mais
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </motion.a>
              </motion.div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Differentials() {
  const items = [
    {
      icon: Target,
      title: "Aplicado ao trabalho real",
      body: "O treinamento parte de tarefas e problemas concretos da empresa, não de exemplos genéricos.",
    },
    {
      icon: Layers,
      title: "Independente de ferramenta",
      body: "Ensinamos a escolher a ferramenta certa para cada necessidade — sem amarrar você a uma plataforma.",
    },
    {
      icon: Brain,
      title: "Capacitação por maturidade",
      body: "Separa usuários comuns, usuários-chave e usuários técnicos. Cada um aprende o que importa.",
    },
    {
      icon: Sparkles,
      title: "Foco em resultado operacional",
      body: "O objetivo não é escrever prompts melhores. É transformar IA em ganho de produtividade real.",
    },
    {
      icon: ShieldCheck,
      title: "Segurança e governança",
      body: "Orientação para evitar uso desordenado, exposição de dados e dependência de práticas informais.",
    },
    {
      icon: Wrench,
      title: "Customização por setor",
      body: "Método adaptável para RH, financeiro, comercial, qualidade, operação, jurídico e indústria.",
    },
  ];

  return (
    <section id="diferenciais" className="py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <SectionLabel index="04">Diferenciais</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Não é mais um curso genérico de prompts.
          </h2>
        </Reveal>

        <Stagger
          className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 md:grid-cols-3"
          staggerChildren={0.07}
        >
          {items.map(({ icon: Icon, ...d }) => (
            <Item
              key={d.title}
              className="group relative bg-card p-7 transition-colors hover:bg-accent/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/25 bg-accent/[0.08] text-accent transition-colors group-hover:border-accent/50">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Governance() {
  const topics = [
    "Quais informações podem ou não ser inseridas em ferramentas externas",
    "Cuidado com dados pessoais, documentos internos e informações confidenciais",
    "Validação humana das respostas geradas",
    "Limites do uso de IA em decisões críticas",
    "Rastreabilidade de entregas importantes",
    "Critérios mínimos antes de colocar um protótipo em uso real",
  ];

  return (
    <section className="relative isolate overflow-hidden bg-feature py-24 text-feature-foreground md:py-32">
      {/* Restrained static texture — a single soft top-edge glow, no looping
          animation. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 85% -10%, color-mix(in oklab, var(--feature-accent) 18%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--feature-accent) 55%, transparent), transparent)",
        }}
      />
      <div className="mx-auto grid w-full max-w-6xl gap-x-16 gap-y-12 px-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <SectionLabel index="05" tone="feature">
            Governança e segurança
          </SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            IA dentro da empresa exige critério.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-feature-muted">
            Tratamos segurança, privacidade e controle de dados como parte central do treinamento —
            não como detalhe. Sua equipe sai sabendo o que fazer, o que evitar e por quê.
          </p>
        </Reveal>
        <Stagger as="ul" className="grid gap-3 md:col-span-7 md:grid-cols-2" staggerChildren={0.06}>
          {topics.map((t) => (
            <Item
              as="li"
              key={t}
              className="flex items-start gap-3 rounded-lg border border-feature-border bg-white/[0.04] p-4 text-sm transition-colors hover:border-white/25 hover:bg-white/[0.07]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-feature-accent" />
              <span className="text-feature-foreground/90">{t}</span>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CTA() {
  return (
    <section id="contato" className="py-24 md:py-32">
      <Reveal className="mx-auto w-full max-w-4xl px-6 text-center">
        <SectionLabel index="06" className="justify-center">
          Próximo passo
        </SectionLabel>
        <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Vamos mapear onde sua empresa pode ganhar tempo com IA.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Comece com um diagnóstico curto. Identificamos as tarefas com maior potencial de retorno
          e desenhamos a trilha de capacitação ideal para o seu time.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            href="mailto:contato@ia-operacional.com.br?subject=Diagn%C3%B3stico%20de%20IA"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={`group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] ${focusRing}`}
          >
            <Mail className="h-4 w-4" />
            Solicitar diagnóstico
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
          <motion.a
            href="#solucao"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={`inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-7 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent ${focusRing}`}
          >
            Rever metodologia
          </motion.a>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 text-sm text-muted-foreground md:flex-row md:items-center">
        <div className="flex items-center text-foreground">
          <BrandLogo />
        </div>
        <p>© {new Date().getFullYear()} · Treinamento de IA aplicada para empresas.</p>
      </div>
    </footer>
  );
}
