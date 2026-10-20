# Site de João Gabriel Gonçalves

Site estático em [Astro](https://astro.build), publicado no GitHub Pages em https://jgmpgoncalves-tax.github.io/. Cada `push` para `main` publica o site automaticamente.

O conteúdo está separado do código. Para atualizar o site basta editar ficheiros de dados (YAML) ou Markdown; não é necessário mexer em templates.

As secções Comentários e notas, Intervenções e Notícias só aparecem no menu, na página inicial, no hub de Publicações e no sitemap a partir do primeiro conteúdo publicado.

## Mudar de cargo ou de sociedade

Editar apenas `src/data/profile.yaml`:

```yaml
  role: { pt: advogado sénior, en: senior associate }
  # Como a sociedade é descrita no texto (o nome não aparece nas páginas).
  employer: { pt: numa sociedade de advogados internacional, en: at an international law firm }
  # Só para os motores de busca (dados estruturados).
  firm: "Brasil, Salomão e Matthes - Sociedade de Advogados"
  formerEmployers:
    - KPMG Portugal
    - Abreu Advogados
```

A primeira frase do texto da página Sobre é gerada a partir destes campos («João Gabriel Gonçalves é advogado sénior numa sociedade de advogados internacional, em Lisboa.»). Ao mudar de sociedade, acrescentar a anterior a `formerEmployers`.

O resto da descrição está em `src/content/description/pt.md` e `en.md`: o texto da página inicial no cabeçalho (`home`), o texto da página Sobre no corpo.

## Defesa da dissertação

Em `src/data/profile.yaml`, no bloco `dissertation`: mudar `status` para `defended` e preencher `defenceYear` (por exemplo, `defenceYear: 2027`). A frase sobre o mestrado muda sozinha nas duas línguas.

## Acrescentar uma publicação (Artigos e estudos)

Acrescentar uma entrada em `src/data/publications.yaml`:

```yaml
- id: identificador-unico
  title: "Título exatamente como publicado"
  venue: Nome da revista ou série
  edition: { pt: 2.ª ed., en: 2nd ed. }   # opcional
  volume: Título do volume                # opcional
  pages: 10-25                            # opcional
  date: "2026-05"                         # "2026", "2026-05" ou "2026-05-14"
  coauthors: [Nome do coautor]            # opcional
  url: https://...                        # opcional; sem URL, o título não tem link
```

A ordenação e os separadores por ano são automáticos.

## Publicar um comentário ou nota

Os comentários escritos para o site ficam em `src/content/commentaries/pt/` (português) ou `src/content/commentaries/en/` (inglês). Basta existir na língua em que foi escrito: na outra língua aparece na lista com a indicação do idioma.

1. Criar o ficheiro `src/content/commentaries/pt/<slug>.md`. O nome do ficheiro define o endereço: `/comentarios/<slug>/` (ou `/en/commentaries/<slug>/`). Usar minúsculas, sem acentos, com hífenes (por exemplo, `ac-sta-dedutibilidade-encargos.md`). **Depois de publicado, nunca mudar o nome do ficheiro**: o endereço será citado.
2. Preencher o cabeçalho:

```markdown
---
title: Título do comentário
date: 2026-11-03
updated: 2026-11-20            # opcional
summary: Resumo de uma ou duas frases (aparece na lista e no topo da página).
type: case-commentary          # ver tipos abaixo
tags: [IRC, Reestruturações]
translationOf: slug-na-outra-lingua   # opcional
pdf: nome-do-ficheiro.pdf      # opcional: ficheiro colocado em public/pdf/
draft: true                    # true enquanto estiver em preparação
---
```

Tipos (`src/data/commentary-types.yaml`):

| `type` | Português | Inglês |
|---|---|---|
| `case-commentary` | Comentário de jurisprudência | Case commentary |
| `ruling-commentary` | Comentário a informação vinculativa | Commentary on a binding ruling |
| `legislative-note` | Nota legislativa | Legislative note |
| `article` | Artigo | Article |

3. Escrever o texto em Markdown:
   - títulos apenas com `##` e `###`;
   - notas de rodapé com `[^1]` no texto e `[^1]: Texto da nota.` no fim;
   - texto legal em citação, com a norma na primeira linha a negrito:

```markdown
> **Artigo 51.º do Código do IRC**
>
> 1 - Texto da norma.
```

4. Ver o resultado com `npm run dev`. Os rascunhos (`draft: true`) só aparecem localmente.
5. Para publicar, mudar para `draft: false`, fazer commit e push.

Não usar travessões (o carácter U+2014). A sequência `---` dentro de uma frase também é convertida em travessão e faz falhar o build; uma linha só com `---` é uma linha horizontal e é permitida.

O site gera automaticamente: a entrada na lista, os cartões "Em destaque", o bloco "Como citar" (regras de estilo da Católica Law Review para textos consultados na internet), os dados estruturados, as etiquetas para partilha, o feed RSS (`/comentarios/rss.xml` e `/en/commentaries/rss.xml`) e o menu "Comentários e notas" a partir do primeiro comentário.

Nota: o repositório é público. Mesmo com `draft: true`, o ficheiro fica visível no GitHub. Para manter um texto privado, não o colocar no repositório.

## Acrescentar uma notícia ou intervenção

Criar um ficheiro Markdown em `src/content/news/pt/` (ou `en/`). Basta uma língua; para ter as duas, criar o ficheiro na outra pasta e ligar com `translationOf`.

```markdown
---
date: 2026-11-03
category: talk                 # talk (Intervenção), publication (Publicação), teaching (Docência), other (Outro)
title: Intervenção sobre ... na conferência ...
link: https://...              # opcional: página do evento ou da publicação
image: ./nome-da-imagem.jpg    # opcional: imagem na mesma pasta (aparece no cartão grande)
imageAlt: Descrição da imagem  # obrigatório se houver imagem com conteúdo
---
Texto curto (as duas primeiras linhas aparecem na lista).
```

As notícias da categoria `talk` aparecem também na página Intervenções. A primeira notícia faz aparecer Notícias no menu; a primeira intervenção faz aparecer Intervenções no menu, o mosaico na página inicial e a secção na página Sobre.

## Acrescentar imagens

Todas as imagens são opcionais e otimizadas automaticamente. Formatos: `.jpg`, `.jpeg`, `.png` ou `.webp`.

| Ficheiro | Onde aparece | Sem imagem |
|---|---|---|
| `src/assets/profile.jpg` | Fotografia na página inicial | Silhueta neutra |
| `src/assets/banners/inicio.jpg` | Banner da página inicial | Bloco azul-marinho |
| `src/assets/banners/sobre.jpg` | Banner da página Sobre | Bloco azul-marinho com o nome |
| `src/assets/banners/publicacoes.jpg` | Banner de Publicações, Artigos e estudos e Comentários | Bloco azul-marinho com o título |
| `src/assets/banners/contactos.jpg` | Imagem à esquerda da caixa de contactos | A caixa ocupa a largura toda |
| `src/assets/strip.jpg` | Faixa a toda a largura na página inicial | A faixa não aparece |

Os banners devem ser imagens horizontais largas (por exemplo, 1600 × 600 px). Antes de juntar uma fotografia ao repositório, retirar os metadados (localização, câmara): o repositório é público.

## Trabalhar localmente

Requer Node.js 22.22 ou superior.

```sh
npm install
npm run dev      # servidor local em http://localhost:4321
npm run check    # validação de tipos e esquemas
npm run build    # gera o site em dist/
```

## Regras de redação e técnicas

Ver `CLAUDE.md`.
