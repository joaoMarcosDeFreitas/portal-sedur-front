"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Paperclip } from "lucide-react";
import { Text } from "@/app/components/atoms/Text";
import { Badge } from "@/app/components/atoms/Badge";
import { Button } from "@/app/components/atoms/Button";
import { Input, Textarea } from "@/app/components/atoms/Input";
import { FormField } from "@/app/components/molecules/FormField";
import { useSessao } from "@/lib/auth/sessao";
import { criarSolicitacao } from "@/lib/solicitacoes/store";
import { calcularValorDam, exigeArea, formatarValor } from "@/lib/solicitacoes/dam";
import type { ItemTaxa } from "@/lib/normalize/servico";
import type { TipoSolicitacao } from "@/types/solicitacao";

interface DocumentoForm {
  titulo: string;
  indispensavel: boolean;
}

interface SolicitacaoFormProps {
  servico: { id: string; nome: string; categoria: string };
  /** "dam" = Emissão de DAM; "processo" = Abrir processo (os dois botões reais das fichas). */
  acao: TipoSolicitacao;
  documentos: DocumentoForm[];
  taxas: ItemTaxa[];
}

type Erros = Partial<Record<"imovel" | "bairro" | "area" | "declaracao", string>>;

/**
 * Formulário das duas ações do portal atual (o que vem depois do login gov.br não foi coletado; aqui é
 * simulado):
 * - Emissão de DAM: confere a taxa (com a área, se for cobrada por m²) e gera o DAM para pagar. Não abre processo.
 * - Abrir processo: endereço, descrição e documentos; gera o protocolo e segue para análise. Não gera DAM.
 */
export function SolicitacaoForm({ servico, acao, documentos, taxas }: SolicitacaoFormProps) {
  const router = useRouter();
  const { usuario } = useSessao();
  const ehDam = acao === "dam";

  const [imovel, setImovel] = useState("");
  const [bairro, setBairro] = useState("");
  const [area, setArea] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexados, setAnexados] = useState<string[]>([]);
  const [declaro, setDeclaro] = useState(false);
  const [erros, setErros] = useState<Erros>({});

  const precisaArea = ehDam && exigeArea(taxas);
  const areaNumerica = Number(area.replace(",", ".")) || 0;
  const valorDam = calcularValorDam(taxas, areaNumerica);

  function alternarAnexo(titulo: string) {
    setAnexados((atuais) => (atuais.includes(titulo) ? atuais.filter((t) => t !== titulo) : [...atuais, titulo]));
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = {};
    if (ehDam) {
      if (precisaArea && areaNumerica <= 0) novosErros.area = "Informe a área da intervenção em m².";
    } else {
      if (!imovel.trim()) novosErros.imovel = "Informe o endereço do imóvel.";
      if (!bairro.trim()) novosErros.bairro = "Informe o bairro.";
      if (!declaro) novosErros.declaracao = "Confirme a declaração para enviar.";
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const protocolo = criarSolicitacao({
      tipo: acao,
      servicoId: servico.id,
      servicoNome: servico.nome,
      categoria: servico.categoria,
      requerente: usuario?.nome ?? "Cidadão",
      ...(ehDam
        ? { area: precisaArea ? areaNumerica : undefined, valorDam }
        : { imovel: imovel.trim(), bairro: bairro.trim(), descricao: descricao.trim(), documentosAnexados: anexados }),
    });
    router.push(`/minhas-solicitacoes/${protocolo}`);
  }

  if (ehDam) {
    return (
      <form onSubmit={enviar} noValidate className="mt-8 flex max-w-2xl flex-col gap-6">
        <Text tone="muted">
          O DAM (Documento de Arrecadação Municipal) é a guia para pagar a taxa deste serviço. Confira o valor e emita o DAM
          para pagar.
        </Text>

        {taxas.length > 0 ? (
          <section aria-labelledby="taxas-dam">
            <Text as="h2" variant="h3" id="taxas-dam">
              Taxas
            </Text>
            <dl className="mt-4 flex flex-col gap-2.5">
              {taxas.map((taxa, indice) => (
                <div key={`${taxa.descricao}-${indice}`} className="flex items-baseline justify-between gap-6">
                  <dt className="text-foreground">{taxa.descricao}</dt>
                  <dd className="shrink-0 font-medium tabular-nums text-foreground">{taxa.valor}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : (
          <Text tone="muted">Não encontramos o valor da taxa deste serviço para calcular o DAM.</Text>
        )}

        {precisaArea && (
          <FormField
            id="area"
            label="Área da intervenção (m²)"
            hint="Parte da taxa deste serviço é cobrada por metro quadrado."
            erro={erros.area}
          >
            <Input
              id="area"
              inputMode="decimal"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ex.: 120"
              aria-invalid={Boolean(erros.area)}
            />
          </FormField>
        )}

        <div className="rounded-2xl bg-surface-muted p-5">
          <Text variant="small" tone="muted">
            Valor do DAM
          </Text>
          <Text as="p" variant="h3" className="mt-1 tabular-nums">
            {formatarValor(valorDam)}
          </Text>
          <Text variant="small" tone="muted" className="mt-1">
            Requerente: {usuario?.nome ?? "Cidadão"}. O DAM é gerado ao clicar em “Emitir DAM”.
          </Text>
        </div>

        <div>
          <Button type="submit" size="lg" disabled={taxas.length === 0}>
            Emitir DAM
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-8 flex max-w-2xl flex-col gap-6">
      <Text tone="muted">
        Informe os dados abaixo. Ao enviar, o processo é aberto e você recebe o número do protocolo para acompanhar.
      </Text>

      <FormField id="imovel" label="Endereço do imóvel" erro={erros.imovel}>
        <Input
          id="imovel"
          value={imovel}
          onChange={(e) => setImovel(e.target.value)}
          placeholder="Rua, número, complemento"
          aria-invalid={Boolean(erros.imovel)}
        />
      </FormField>

      <FormField id="bairro" label="Bairro" erro={erros.bairro}>
        <Input
          id="bairro"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder="Ex.: Caminho das Árvores"
          aria-invalid={Boolean(erros.bairro)}
        />
      </FormField>

      <FormField id="descricao" label="Descrição da solicitação (opcional)">
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Conte brevemente o que será feito."
        />
      </FormField>

      {documentos.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-foreground">Documentos</legend>
          <p className="text-xs text-foreground-muted">
            Demonstração: o botão apenas marca o documento como anexado, sem enviar arquivo.
          </p>
          <ul className="flex flex-col gap-2">
            {documentos.map((documento) => {
              const anexado = anexados.includes(documento.titulo);
              return (
                <li key={documento.titulo} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2 hover:bg-surface-muted">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{documento.titulo}</p>
                    {documento.indispensavel && (
                      <div className="mt-1">
                        <Badge tone="warning">Indispensável para análise</Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={anexado ? "primary" : "secondary"}
                    aria-pressed={anexado}
                    onClick={() => alternarAnexo(documento.titulo)}
                    className="shrink-0"
                  >
                    {anexado ? <Check className="size-4" aria-hidden="true" /> : <Paperclip className="size-4" aria-hidden="true" />}
                    {anexado ? "Anexado" : "Anexar"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={declaro}
            onChange={(e) => setDeclaro(e.target.checked)}
            className="mt-0.5 size-4 cursor-pointer accent-primary-600"
          />
          Declaro que as informações prestadas são verdadeiras.
        </label>
        {erros.declaracao && (
          <p role="alert" className="text-xs text-danger">
            {erros.declaracao}
          </p>
        )}
      </div>

      <div>
        <Button type="submit" size="lg">
          Abrir processo
        </Button>
      </div>
    </form>
  );
}
