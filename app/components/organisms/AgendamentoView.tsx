"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarCheck, CalendarX2, Clock, MapPin } from "lucide-react";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { Button } from "@/app/components/atoms/Button";
import { Input } from "@/app/components/atoms/Input";
import { FormField } from "@/app/components/molecules/FormField";
import { useSessao } from "@/lib/auth/sessao";
import {
  cancelarAgendamento,
  criarAgendamento,
  HORARIOS,
  horarioIndisponivel,
  proximosDiasUteis,
  useAgendamentos,
} from "@/lib/agendamento/store";
import type { Agendamento } from "@/types/agendamento";

const CAMPO =
  "w-full cursor-pointer rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 aria-[invalid=true]:border-danger";

const OUTROS_ASSUNTOS = "Outro assunto / não sei qual serviço";

type Erros = Partial<Record<"assunto" | "data" | "horario" | "nome", string>>;

/** "2026-09-30" → "Quarta-feira, 30 de setembro de 2026". */
function dataPorExtenso(data: string): string {
  const [ano, mes, dia] = data.split("-").map(Number);
  const texto = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date(ano, mes - 1, dia));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

interface AgendamentoViewProps {
  /** Categorias da Carta de Serviços, para a pessoa dizer sobre o que quer conversar. */
  assuntos: string[];
}

/**
 * Agendamento de atendimento presencial na SEDUR (simulado). No portal atual é um sistema à parte,
 * sem login; aqui segue igual: qualquer pessoa marca, e os agendamentos ficam neste navegador.
 */
export function AgendamentoView({ assuntos }: AgendamentoViewProps) {
  const { usuario, hidratado } = useSessao();
  const agendados = useAgendamentos();

  const [assunto, setAssunto] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  // null = a pessoa ainda não digitou: usa o nome do perfil de demonstração, se estiver logada.
  const [nomeDigitado, setNomeDigitado] = useState<string | null>(null);
  const [contato, setContato] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [confirmado, setConfirmado] = useState<Agendamento | undefined>();
  const tituloConfirmacao = useRef<HTMLHeadingElement>(null);

  const nome = nomeDigitado ?? usuario?.nome ?? "";
  const dias = hidratado ? proximosDiasUteis(15) : [];

  // Quando o agendamento é confirmado, leva o foco ao título da confirmação (leitor de tela anuncia).
  useEffect(() => {
    if (confirmado) tituloConfirmacao.current?.focus();
  }, [confirmado]);

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = {};
    if (!assunto) novosErros.assunto = "Escolha o assunto do atendimento.";
    if (!data) novosErros.data = "Escolha o dia.";
    if (data && !horario) novosErros.horario = "Escolha um horário disponível.";
    if (!nome.trim()) novosErros.nome = "Informe seu nome.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const protocolo = criarAgendamento({ assunto, data, horario, nome: nome.trim(), contato: contato.trim() });
    setConfirmado({
      protocolo,
      assunto,
      data,
      horario,
      nome: nome.trim(),
      contato: contato.trim(),
      criadoEm: new Date().toISOString(),
      status: "confirmado",
    });
    setAssunto("");
    setData("");
    setHorario("");
    setContato("");
  }

  const meus = agendados;

  return (
    <div className="mt-8 flex max-w-2xl flex-col gap-12">
      {confirmado && (
        <section aria-labelledby="titulo-confirmacao" className="rounded-2xl bg-primary-600/10 p-6">
          <h2 id="titulo-confirmacao" ref={tituloConfirmacao} tabIndex={-1} className="flex items-center gap-2 font-heading text-xl font-semibold text-brand focus:outline-none">
            <CalendarCheck className="size-6" aria-hidden="true" />
            Agendamento confirmado
          </h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Protocolo</dt>
              <dd className="mt-0.5 font-medium text-foreground">{confirmado.protocolo}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Assunto</dt>
              <dd className="mt-0.5 text-foreground">{confirmado.assunto}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Dia</dt>
              <dd className="mt-0.5 text-foreground">{dataPorExtenso(confirmado.data)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Horário</dt>
              <dd className="mt-0.5 text-foreground">{confirmado.horario}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-foreground-muted">
            Compareça no dia e horário marcados, com um documento de identificação e os documentos do serviço. Guarde o
            protocolo.
          </p>
        </section>
      )}

      <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
        <FormField id="assunto" label="Assunto do atendimento" erro={erros.assunto}>
          <select
            id="assunto"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            aria-invalid={Boolean(erros.assunto)}
            className={CAMPO}
          >
            <option value="">Selecione</option>
            {assuntos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
            <option value={OUTROS_ASSUNTOS}>{OUTROS_ASSUNTOS}</option>
          </select>
        </FormField>

        <FormField id="dia" label="Dia" hint="Atendimento de segunda a sexta." erro={erros.data}>
          <select
            id="dia"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
              setHorario("");
            }}
            aria-invalid={Boolean(erros.data)}
            disabled={!hidratado}
            className={CAMPO}
          >
            <option value="">{hidratado ? "Selecione o dia" : "Carregando dias…"}</option>
            {dias.map((dia) => (
              <option key={dia.valor} value={dia.valor}>
                {dia.rotulo}
              </option>
            ))}
          </select>
        </FormField>

        <fieldset className="flex flex-col gap-3" aria-describedby={erros.horario ? "erro-horario" : undefined}>
          <legend className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="size-4" aria-hidden="true" />
            Horário (das 9h às 15h30)
          </legend>
          {data ? (
            <div className="flex flex-wrap gap-2">
              {HORARIOS.map((item) => {
                const indisponivel = horarioIndisponivel(data, item, agendados);
                return (
                  <label key={item} className="relative">
                    <input
                      type="radio"
                      name="horario"
                      value={item}
                      checked={horario === item}
                      disabled={indisponivel}
                      onChange={() => setHorario(item)}
                      className="peer sr-only"
                    />
                    <span className="flex min-w-20 cursor-pointer items-center justify-center rounded-full border border-border-strong px-4 py-2 text-sm text-foreground transition-colors hover:bg-primary-600/10 peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-checked:text-neutral-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-600 peer-disabled:cursor-not-allowed peer-disabled:line-through peer-disabled:opacity-50">
                      {item}
                      {indisponivel && <span className="sr-only"> (indisponível)</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-foreground-muted">Escolha um dia para ver os horários.</p>
          )}
          {erros.horario && (
            <p id="erro-horario" role="alert" className="text-xs text-danger">
              {erros.horario}
            </p>
          )}
        </fieldset>

        <FormField id="nome-agendamento" label="Nome" erro={erros.nome}>
          <Input
            id="nome-agendamento"
            value={nome}
            onChange={(e) => setNomeDigitado(e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(erros.nome)}
          />
        </FormField>

        <FormField id="contato" label="Telefone ou e-mail (opcional)" hint="Demonstração: nenhum lembrete é enviado.">
          <Input id="contato" value={contato} onChange={(e) => setContato(e.target.value)} autoComplete="off" />
        </FormField>

        <div>
          <Button type="submit" size="lg">
            Confirmar agendamento
          </Button>
        </div>
      </form>

      <section aria-labelledby="titulo-meus">
        <Text as="h2" variant="h3" id="titulo-meus">
          Meus agendamentos
        </Text>
        {!hidratado ? (
          <Text tone="muted" className="mt-4">
            Carregando…
          </Text>
        ) : meus.length === 0 ? (
          <Text tone="muted" className="mt-4">
            Você ainda não marcou nenhum atendimento neste navegador.
          </Text>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {meus.map((item) => (
              <li key={item.protocolo} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 rounded-xl px-4 py-3 hover:bg-surface-muted">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                    {dataPorExtenso(item.data)} · {item.horario}
                    <Badge tone={item.status === "confirmado" ? "success" : "neutral"}>
                      {item.status === "confirmado" ? "Confirmado" : "Cancelado"}
                    </Badge>
                  </p>
                  <p className="mt-1 text-sm text-foreground-muted">{item.assunto}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    Protocolo {item.protocolo}
                  </p>
                </div>
                {item.status === "confirmado" && (
                  <Button variant="secondary" size="sm" onClick={() => cancelarAgendamento(item.protocolo)}>
                    <CalendarX2 className="size-4" aria-hidden="true" />
                    Cancelar<span className="sr-only"> agendamento {item.protocolo}</span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
