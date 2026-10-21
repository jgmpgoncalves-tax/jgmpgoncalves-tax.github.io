# Site de João Gabriel Gonçalves

Site estático em [Astro](https://astro.build), publicado no GitHub Pages em https://jgmpgoncalves-tax.github.io/. Cada `push` para `main` publica o site automaticamente.

O conteúdo está separado do código. Para atualizar o site basta editar ficheiros de dados (YAML) ou Markdown; não é necessário mexer em templates.

A língua principal é o inglês, na raiz (`/`); o português está em `/pt/`. Os endereços antigos (português na raiz, inglês em `/en/`) redirecionam para os novos.

**Publicações** reúne a obra científica (artigos e capítulos em revistas e séries de investigação). **Artigos** reúne os textos escritos para o site: opinião e reflexões, sem revisão por pares.

As secções Artigos, Intervenções e Notícias só aparecem no menu, na página inicial e no sitemap a partir do primeiro conteúdo publicado.

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

## Formulário de contacto

O formulário da página Contactos envia as mensagens através da Formspree (conta associada a jgmpgoncalves@gmail.com). O endereço do formulário está em `src/data/profile.yaml` (`contactForm`); apagar essa linha esconde o formulário. Qualquer alteração aos campos ou ao serviço exige atualizar a política de privacidade.

## Áreas de prática

Editar `src/data/practice-areas.yaml` (título e uma ou duas frases por área, nas duas línguas). A ordem é dada pelo campo `order`.

## Defesa da dissertação

Em `src/data/profile.yaml`, no bloco `dissertation`: mudar `status` para `defended` e preencher `defenceYear` (por exemplo, `defenceYear: 2027`). A frase sobre o mestrado muda sozinha nas duas línguas.

## Acrescentar uma publicação (obra científica)

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

## Publicar um artigo (texto de opinião)

Os artigos escritos para o site ficam em `src/content/articles/pt/` (português) ou `src/content/articles/en/` (inglês). Basta existir na língua em que foi escrito: na outra língua aparece na lista com a indicação do idioma. Publicações com revisão por pares ou editadas por terceiros vão para `src/data/publications.yaml`, não para aqui.

1. Criar o ficheiro `src/content/articles/pt/<slug>.md`. O nome do ficheiro define o endereço: `/pt/artigos/<slug>/` (ou `/articles/<slug>/` em inglês). Usar minúsculas, sem acentos, com hífenes (por exemplo, `tributacao-unit-linked.md`). **Depois de publicado, nunca mudar o nome do ficheiro**: o endereço será citado.
2. Preencher o cabeçalho:

```markdown
---
title: Título do artigo
date: 2026-11-03
updated: 2026-11-20            # opcional
summary: Resumo de uma ou duas frases (aparece na lista e no topo da página).
type: opinion                  # ver tipos abaixo
tags: [IRC, Reestruturações]
translationOf: slug-na-outra-lingua   # opcional
pdf: nome-do-ficheiro.pdf      # opcional: ficheiro colocado em public/pdf/
draft: true                    # true enquanto estiver em preparação
---
```

Tipos (`src/data/article-types.yaml`):

| `type` | Português | Inglês |
|---|---|---|
| `opinion` | Opinião | Opinion |
| `case-commentary` | Comentário de jurisprudência | Case commentary |
| `ruling-commentary` | Comentário a informação vinculativa | Commentary on a binding ruling |
| `legislative-note` | Nota legislativa | Legislative note |

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

O site gera automaticamente: a entrada na lista, os cartões "Em destaque", o bloco "Como citar" (regras de estilo da Católica Law Review para textos consultados na internet), os dados estruturados, as etiquetas para partilha, o feed RSS (`/pt/artigos/rss.xml` e `/articles/rss.xml`) e o menu "Artigos" a partir do primeiro artigo.

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
| `src/assets/banners/publicacoes.jpg` | Banner da página Publicações | Bloco azul-marinho com o título |
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
