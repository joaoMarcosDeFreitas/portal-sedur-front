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

interface DocumentoForm {
  titulo: string;
  indispensavel: boolean;
}

interface SolicitacaoFormProps {
  servico: { id: string; nome: string; categoria: string };
  documentos: DocumentoForm[];
  taxas: ItemTaxa[];
}

type Erros = Partial<Record<"imovel" | "bairro" | "area" | "declaracao", string>>;

export function SolicitacaoForm({ servico, documentos, taxas }: SolicitacaoFormProps) {
  const router = useRouter();
  const { usuario } = useSessao();

  const [imovel, setImovel] = useState("");
  const [bairro, setBairro] = useState("");
  const [area, setArea] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anexados, setAnexados] = useState<string[]>([]);
  const [declaro, setDeclaro] = useState(false);
  const [erros, setErros] = useState<Erros>({});

  const precisaArea = exigeArea(taxas);
  const areaNumerica = Number(area.replace(",", ".")) || 0;
  const valorEstimado = taxas.length > 0 ? calcularValorDam(taxas, areaNumerica) : 0;

  function alternarAnexo(titulo: string) {
    setAnexados((atuais) => (atuais.includes(titulo) ? atuais.filter((t) => t !== titulo) : [...atuais, titulo]));
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const novosErros: Erros = {};
    if (!imovel.trim()) novosErros.imovel = "Informe o endereço do imóvel.";
    if (!bairro.trim()) novosErros.bairro = "Informe o bairro.";
    if (precisaArea && areaNumerica <= 0) novosErros.area = "Informe a área da intervenção em m².";
    if (!declaro) novosErros.declaracao = "Confirme a declaração para enviar.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const protocolo = criarSolicitacao({
      servicoId: servico.id,
      servicoNome: servico.nome,
      categoria: servico.categoria,
      requerente: usuario?.nome ?? "Cidadão",
      imovel: imovel.trim(),
      bairro: bairro.trim(),
      descricao: descricao.trim(),
      area: precisaArea ? areaNumerica : undefined,
      documentosAnexados: anexados,
      valorDam: valorEstimado,
    });
    router.push(`/minhas-solicitacoes/${protocolo}`);
  }

  return (
    <form onSubmit={enviar} noValidate className="mt-8 flex max-w-2xl flex-col gap-6">
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

      {taxas.length > 0 && (
        <div className="rounded-2xl bg-surface-muted p-5">
          <Text variant="small" tone="muted">
            Valor estimado da taxa (DAM)
          </Text>
          <Text as="p" variant="h3" className="mt-1 tabular-nums">
            {formatarValor(valorEstimado)}
          </Text>
          <Text variant="small" tone="muted" className="mt-1">
            O DAM será gerado ao enviar a solicitação.
          </Text>
        </div>
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
          Enviar solicitação
        </Button>
      </div>
    </form>
  );
}
