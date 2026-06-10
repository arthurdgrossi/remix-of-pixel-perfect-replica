import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import heroImage from "@/assets/hero.jpg";
import { Reveal, Stagger, Item } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
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

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className={`flex items-center gap-2 rounded-md font-display text-base font-semibold tracking-tight ${focusRing}`}
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[image:var(--gradient-accent)] text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          IA Operacional
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
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-background/40 text-foreground/80 transition-colors hover:text-foreground hover:bg-accent/10 md:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" aria-describedby={undefined} className="w-72 border-border">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-display">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-[image:var(--gradient-accent)] text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  IA Operacional
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
  const reduced = useReducedMotion();

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

      <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-6 pb-32 pt-28 md:pt-40">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-white/80"
            animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          Treinamentos corporativos · IA aplicada
        </motion.span>

        <motion.h1
          className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
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
          className="mt-6 max-w-2xl text-base text-white/75 md:text-lg"
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
            className={`group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-medium text-primary shadow-[var(--shadow-elegant)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            Solicitar diagnóstico
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
          <motion.a
            href="#solucao"
            className={`inline-flex h-11 items-center justify-center rounded-md border border-white/25 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
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
          className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 border-t border-white/15 pt-8 text-white sm:grid-cols-3 sm:gap-8"
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
    <div>
      <dt className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{k}</dt>
      <dd className="mt-1 text-xs text-white/65 md:text-sm">{v}</dd>
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
      <div className="mx-auto grid w-full max-w-6xl gap-16 px-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            O problema
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            O problema não é o acesso à IA. É a falta de método.
          </h2>
          <p className="mt-6 text-muted-foreground">
            A maior parte das empresas já experimenta IA — mas de forma desorganizada, sem critério
            e sem segurança. O resultado são ganhos pontuais que não escalam para o time.
          </p>
        </Reveal>
        <Stagger as="ul" className="space-y-4 md:col-span-7">
          {items.map((t) => (
            <Item
              as="li"
              key={t}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:border-accent/40"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="text-sm text-card-foreground md:text-base">{t}</span>
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
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            A metodologia
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Três níveis de capacitação, conforme o perfil do colaborador.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Nem todos precisam aprender desenvolvimento assistido. Cada perfil aprende o que importa
            para o seu trabalho — sem ruído, sem teoria solta.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid gap-6 md:grid-cols-3" staggerChildren={0.12}>
          {levels.map(({ icon: Icon, ...l }) => (
            <Item key={l.tag} as="article" className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)] hover:border-accent/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-[image:var(--gradient-accent)] text-primary-foreground transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {l.tag}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                  {l.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{l.audience}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-card-foreground/80">
                  {l.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5">
                  {l.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent"
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
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Modelos de oferta
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Três formatos para começar onde faz sentido.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Cada formato pode ser adaptado para o seu setor: indústria, serviços, RH, comercial,
            financeiro, qualidade ou jurídico.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" staggerChildren={0.14}>
          {offers.map((o) => (
            <Item key={o.title} as="article" className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={
                  o.featured
                    ? "relative flex h-full flex-col rounded-xl bg-primary p-8 text-primary-foreground shadow-[var(--shadow-elegant)] md:-mt-4"
                    : "relative flex h-full flex-col rounded-xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
                }
              >
                <span
                  className={
                    o.featured
                      ? "inline-block w-fit rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                      : "inline-block w-fit rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent"
                  }
                >
                  {o.tag}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
                  {o.title}
                </h3>
                <p className={o.featured ? "mt-3 text-sm text-white/75" : "mt-3 text-sm text-muted-foreground"}>
                  {o.body}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {o.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm">
                      <CheckCircle2
                        className={
                          o.featured
                            ? "mt-0.5 h-4 w-4 shrink-0 text-white/90"
                            : "mt-0.5 h-4 w-4 shrink-0 text-accent"
                        }
                      />
                      <span className={o.featured ? "text-white/90" : "text-card-foreground/85"}>
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
                      ? `group/btn mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary`
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
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Diferenciais
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Não é mais um curso genérico de prompts.
          </h2>
        </Reveal>

        <Stagger
          className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3"
          staggerChildren={0.07}
        >
          {items.map(({ icon: Icon, ...d }) => (
            <Item key={d.title} className="group relative bg-card p-7 transition-colors hover:bg-accent/[0.03]">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-transform group-hover:scale-110 group-hover:rotate-3">
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
  const reduced = useReducedMotion();
  const topics = [
    "Quais informações podem ou não ser inseridas em ferramentas externas",
    "Cuidado com dados pessoais, documentos internos e informações confidenciais",
    "Validação humana das respostas geradas",
    "Limites do uso de IA em decisões críticas",
    "Rastreabilidade de entregas importantes",
    "Critérios mínimos antes de colocar um protótipo em uso real",
  ];

  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground md:py-32">
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 80% 0%, oklch(0.55 0.13 245 / 0.6), transparent 60%), radial-gradient(ellipse 50% 50% at 0% 100%, oklch(0.45 0.11 255 / 0.4), transparent 60%)",
        }}
        animate={reduced ? undefined : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            Governança e segurança
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            IA dentro da empresa exige critério.
          </h2>
          <p className="mt-6 text-white/75">
            Tratamos segurança, privacidade e controle de dados como parte central do treinamento —
            não como detalhe. Sua equipe sai sabendo o que fazer, o que evitar e por quê.
          </p>
        </Reveal>
        <Stagger as="ul" className="grid gap-3 md:col-span-7 md:grid-cols-2" staggerChildren={0.06}>
          {topics.map((t) => (
            <Item
              as="li"
              key={t}
              className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm backdrop-blur transition-colors hover:border-white/25 hover:bg-white/10"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
              <span className="text-white/90">{t}</span>
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
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Próximo passo
        </span>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">
          Vamos mapear onde sua empresa pode ganhar tempo com IA.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
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
            className={`inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-7 text-sm font-medium text-foreground hover:border-accent hover:text-accent ${focusRing}`}
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
        <div className="flex items-center gap-2 font-display font-semibold text-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[image:var(--gradient-accent)] text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          IA Operacional
        </div>
        <p>© {new Date().getFullYear()} · Treinamento de IA aplicada para empresas.</p>
      </div>
    </footer>
  );
}

