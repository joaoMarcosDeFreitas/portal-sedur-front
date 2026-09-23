import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarClock, Mail, MapPin, MessageCircle, MonitorSmartphone, ShieldAlert, type LucideIcon } from "lucide-react";
import { Container } from "@/app/components/atoms/Container";
import { Text } from "@/app/components/atoms/Text";

export const metadata: Metadata = {
  title: "Canais de atendimento",
  description: "Portal de Serviços, WhatsApp, atendimento presencial, e-mail e denúncias: como falar com a SEDUR.",
};

const LINK = "cursor-pointer font-medium text-brand hover:underline";

function Canal({ icone: Icone, titulo, children }: { icone: LucideIcon; titulo: string; children: ReactNode }) {
  return (
    <section className="flex gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-600/10 text-brand">
        <Icone className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <Text as="h2" variant="h3">
          {titulo}
        </Text>
        <div className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-foreground-muted">{children}</div>
      </div>
    </section>
  );
}

export default function CanaisPage() {
  return (
    <Container className="py-12">
      <Text as="h1" variant="h1">
        Canais de atendimento
      </Text>
      <Text tone="muted" className="mt-3 max-w-2xl">
        Escolha a forma mais rápida de resolver o que você precisa.
      </Text>

      <div className="mt-10 grid max-w-4xl gap-x-12 gap-y-10 md:grid-cols-2">
        <Canal icone={MonitorSmartphone} titulo="Portal de Serviços">
          <p>Solicite nossos serviços de forma rápida, fácil e segura, de onde você estiver.</p>
          <Link href="/servicos" className={LINK}>
            Ver serviços
          </Link>
        </Canal>

        <Canal icone={MessageCircle} titulo="WhatsApp">
          <p>
            Tire dúvidas sobre procedimentos e serviços pelo número{" "}
            <a href="https://wa.me/5571996205122" target="_blank" rel="noreferrer" className={LINK}>
              (71) 99620-5122
            </a>
            , de segunda a sexta, das 8h às 17h.
          </p>
          <p>Envie apenas mensagens de texto: não ouvimos áudios nem atendemos ligações.</p>
        </Canal>

        <Canal icone={CalendarClock} titulo="Atendimento presencial">
          <p>O atendimento presencial é feito mediante agendamento. Escolha o dia e o horário desejados.</p>
          <a href="https://agendamento.sedur.salvador.ba.gov.br/sas/#agendamento" target="_blank" rel="noreferrer" className={LINK}>
            Agendar atendimento
          </a>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Av. ACM, nº 3224, Caminho das Árvores — Salvador/BA. Seg. a sex., 9h às 16h.
          </p>
        </Canal>

        <Canal icone={Mail} titulo="E-mail">
          <p>
            Documentos complementares e Atendimento a Convite:{" "}
            <a href="mailto:protocolo.sedur@salvador.ba.gov.br" className={LINK}>
              protocolo.sedur@salvador.ba.gov.br
            </a>
          </p>
          <p>
            Assuntos de Viabilidade:{" "}
            <a href="mailto:viabilidade.sedur@salvador.ba.gov.br" className={LINK}>
              viabilidade.sedur@salvador.ba.gov.br
            </a>
          </p>
        </Canal>

        <Canal icone={ShieldAlert} titulo="Denúncias">
          <p>
            <strong className="font-medium text-foreground">Construção irregular, atividade irregular ou crime ambiental:</strong>{" "}
            procure a Prefeitura-Bairro da sua região, mediante agendamento no site Hora Marcada.
          </p>
          <p>
            <strong className="font-medium text-foreground">Poluição sonora:</strong> ligue para o Fala Salvador (156) ou
            use o aplicativo Sonora Salvador.
          </p>
        </Canal>
      </div>

      <p className="mt-12 text-sm text-foreground-muted">
        Precisa de um sistema específico?{" "}
        <Link href="/sistemas-parceiros" className={LINK}>
          Veja os sistemas parceiros
        </Link>
        .
      </p>
    </Container>
  );
}
