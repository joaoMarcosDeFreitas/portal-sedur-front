import Image from "next/image";
import Link from "next/link";
import { MappedIcon } from "@/app/components/atoms/MappedIcon";
import { iconeDeProjeto } from "@/lib/ui/secoes-icons";

interface ProjetoTileProps {
  slug: string;
  nome: string;
  /** Ilustração do projeto (os 6 originais). Sem ela, usa o ícone do projeto num círculo. */
  imagem?: string;
}

/** Projeto como no site atual: ilustração redonda em cima, nome embaixo, sem cartão em volta. */
export function ProjetoTile({ slug, nome, imagem }: ProjetoTileProps) {
  return (
    <Link
      href={`/projetos/${slug}`}
      className="group flex w-32 cursor-pointer flex-col items-center gap-3 rounded-xl px-0 py-3 text-center transition-colors hover:bg-surface-muted sm:w-40 sm:px-2"
    >
      {imagem ? (
        // Fundo branco fixo: as ilustrações são JPG com fundo branco e ficariam com um quadrado claro no tema escuro.
        <Image src={imagem} alt="" width={88} height={90} className="size-20 rounded-full bg-white object-cover sm:size-[5.5rem]" />
      ) : (
        <span className="flex size-20 items-center justify-center rounded-full bg-primary-600/10 text-brand transition-colors group-hover:bg-primary-600/15 sm:size-[5.5rem]">
          <MappedIcon icone={iconeDeProjeto(slug)} className="size-8" />
        </span>
      )}
      <span className="w-full break-words font-heading text-xs font-medium tracking-tight text-foreground sm:text-sm sm:tracking-normal">{nome}</span>
    </Link>
  );
}
