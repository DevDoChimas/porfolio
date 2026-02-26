# Dev do Chimas — Portfolio

Portfolio profissional em Next.js 14 com suporte a multilíngua (pt-BR / en) e dark mode.

## 🚀 Setup

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## 📝 Como editar o conteúdo

### Dados estruturados (links, skills, projetos, experiência)
Edite o arquivo:
```
src/content/config.ts
```

### Textos / traduções
Edite os arquivos:
```
messages/pt-BR.json   ← Português
messages/en.json      ← English
```

### Logo
Coloque o arquivo de logo em:
```
public/images/logo.png
```

## 🏗️ Estrutura

```
src/
  app/[locale]/
    layout.tsx          ← providers (tema, i18n)
    page.tsx            ← monta as seções
  components/
    layout/
      Navbar.tsx        ← navegação, toggle de tema e idioma
      Footer.tsx
      ThemeProvider.tsx
    sections/
      Hero.tsx
      Marquee.tsx
      About.tsx
      Skills.tsx
      Experience.tsx
      Projects.tsx
      Workflow.tsx
      Contact.tsx
  content/
    config.ts           ← ⭐ PRINCIPAL — edite aqui
  lib/
    utils.ts
messages/
  pt-BR.json            ← textos em português
  en.json               ← textos em inglês
```

## 🎨 Design tokens

As cores e fontes estão em `src/app/globals.css` como CSS custom properties.
Para mudar a paleta, edite as variáveis em `:root` e `.dark`.

## 🌍 Adicionar novo idioma

1. Crie `messages/es.json` (ou outro locale)
2. Adicione `'es'` ao array `locales` em `src/i18n.ts`
3. Adicione as roles no `heroRoles` em `src/content/config.ts`

## 🧩 Adicionar shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button card badge
```

## 📦 Deploy

O projeto é compatível com Vercel, Netlify, e qualquer plataforma que suporte Next.js.

```bash
npm run build
```
