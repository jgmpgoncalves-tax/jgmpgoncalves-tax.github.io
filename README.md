# Site profissional de João Gabriel Gonçalves

Site estático em [Astro](https://astro.build), publicado no GitHub Pages através de GitHub Actions. Cada `push` para `main` publica o site automaticamente.

O conteúdo está separado do código. Para atualizar o site basta editar ficheiros de dados (YAML) ou Markdown; não é necessário mexer em templates.

## Atualizar o cargo atual

Editar apenas `src/data/experience.yaml`, na entrada da entidade empregadora atual (a que tem `end: null`):

1. no cargo atual, substituir `end: null` pela data de fim (por exemplo, `end: "2027-01"`);
2. acrescentar o novo cargo à lista `roles`, com `start` e `end: null`.

```yaml
  roles:
    - title: { pt: Associado Sénior, en: Senior Associate }
      start: "2026-06"
      end: "2027-01"
    - title: { pt: Novo cargo, en: New title }
      start: "2027-01"
      end: null
```

A biografia (`src/data/profile.yaml`) é atualizada automaticamente: o texto `{position}` é preenchido com o cargo atual e a entidade.

Se mudar de entidade empregadora, criar uma nova entrada com `end: null` e o campo `position` (por exemplo, `"{role} na Nova Sociedade"` / `"a {role} at Nova Sociedade"`), e indicar a data de fim (`end`) na entrada anterior.

Os dados de identificação e contactos (título profissional, email, LinkedIn) estão em `src/data/profile.yaml`.

## Defesa da dissertação

Em `src/data/education.yaml`, na entrada do mestrado: mudar `status` para `defended`, preencher `defenceDate` e `grade` e indicar o ano em `end`.

## Acrescentar uma publicação

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

A ordenação cronológica inversa e os separadores por ano são automáticos.

## Acrescentar uma notícia

Criar dois ficheiros Markdown, um por idioma, com o mesmo nome:

- `src/content/news/pt/2026-11-03-exemplo.md`
- `src/content/news/en/2026-11-03-exemplo.md`

```markdown
---
date: 2026-11-03
category: Conferência
title: Título da notícia
link: https://...   # opcional
---
Texto curto.
```

A página de notícias só aparece no menu, e as três notícias mais recentes só aparecem na homepage, a partir da primeira notícia publicada em cada idioma.

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
