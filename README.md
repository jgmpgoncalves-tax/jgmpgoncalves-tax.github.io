# Site profissional de João Gabriel Gonçalves

Site estático em [Astro](https://astro.build), publicado no GitHub Pages através de GitHub Actions. Cada `push` para `main` publica o site automaticamente.

O conteúdo está separado do código. Para atualizar o site basta editar ficheiros de dados (YAML) ou Markdown; não é necessário mexer em templates.

## Atualizar o cargo atual

Editar `src/data/experience.yaml`, na entrada da entidade empregadora atual:

- acrescentar o novo cargo à lista `roles`, com a data de início;
- manter `end: null` enquanto a função se mantiver (é apresentado como "presente" / "present").

Os dados de identificação e contactos (título profissional, email, LinkedIn) estão em `src/data/profile.yaml`.

## Acrescentar uma publicação

Acrescentar uma entrada em `src/data/publications.yaml`:

```yaml
- id: identificador-unico
  title: "Título exatamente como publicado"
  venue: Nome da revista ou série
  edition: 2.ª ed.        # opcional
  date: 2026-05            # ano (2026) ou ano e mês (2026-05)
  url: https://...         # opcional; sem URL, o título não tem link
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

A página de notícias só aparece no menu, e as três notícias mais recentes só aparecem na homepage, a partir da primeira notícia publicada.

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
