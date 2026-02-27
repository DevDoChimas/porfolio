# Plano de Melhorias — Portfolio Dev do Chimas

4 melhorias independentes, executadas em fases sequenciais.

---

## Fase 1: ESLint → Biome

**Motivação**: Biome é significativamente mais rápido (linter + formatter em uma ferramenta Rust).

**Ações**:
1. Instalar `@biomejs/biome` como devDependency
2. Criar `biome.json` com:
   - `recommended: true` para regras de linting
   - Domain `next: "all"` e `react: "all"` (Biome v2 tem suporte nativo a Next.js)
   - Formatter: 2 spaces, single quotes, semicolons `asNeeded`, trailing commas `all`
   - Ignore: `.next/`, `node_modules/`, `public/`
3. Remover deps: `eslint`, `eslint-config-next`
4. Deletar `eslint.config.mjs`
5. Atualizar `package.json` scripts:
   - `"lint": "biome check src"` (lint + format check)
   - `"format": "biome check --write src"` (auto-fix)
6. Rodar `biome check --write src` para formatar todo o código
7. Verificar build passa

**Arquivos afetados**: `package.json`, `biome.json` (novo), `eslint.config.mjs` (deletar), potencialmente todos os arquivos `.ts`/`.tsx` (formatação)

---

## Fase 2: i18n sem locale na URL

**Motivação**: O usuário não quer locale visível na URL (`/en/...`). Usar `localePrefix: 'never'` do next-intl v4.

**Como funciona**: O middleware detecta o idioma por:
1. Cookie `NEXT_LOCALE` (se existir, de visita anterior)
2. Header `Accept-Language` do navegador
3. Fallback para `defaultLocale` (pt-BR)

A troca de idioma no Navbar seta o cookie e recarrega a página.

**Ações**:
1. Em `src/i18n/routing.ts`: mudar `localePrefix: 'as-needed'` → `localePrefix: 'never'`
2. O middleware continua funcionando normalmente (mesma config)
3. Em `Navbar.tsx`: ajustar `toggleLocale()` para:
   - Usar `router.replace(pathname, { locale: next })` (já faz isso)
   - O next-intl já seta o cookie `NEXT_LOCALE` automaticamente via middleware
4. Testar: `/` deve carregar pt-BR, trocar para EN via botão, recarregar e manter EN
5. Remover a pasta `[locale]` NÃO é necessário — next-intl v4 com `localePrefix: 'never'` ainda usa a segment `[locale]` internamente no App Router, apenas não expõe na URL

**Arquivos afetados**: `src/i18n/routing.ts` (1 linha)

**Nota**: Isso também resolve o bug atual de 404 na raiz `/`, já que `localePrefix: 'never'` nunca tenta redirecionar para `/pt-BR`.

---

## Fase 3: Logo com tema via CSS

**Motivação**: A logo tem fundo amarelo/cream embutido na imagem PNG. O usuário quer fundo adaptável por tema.

**Ações**:
1. **Processar a imagem**: usar Python (Pillow) para remover o fundo da logo e salvar como PNG com transparência
   - Detectar a cor de fundo predominante (amarelo/cream)
   - Aplicar remoção por threshold de cor
   - Se o resultado não for satisfatório, informar o usuário
2. **CSS por tema**: no container da logo em `Hero.tsx`:
   - Tema claro: fundo `cream` (já existente como `--cream`)
   - Tema escuro: fundo `surface` (já existente como `--surface`)
   - A classe já usa `bg-[rgb(var(--surface))]`, que já muda por tema
   - Com logo transparente, o fundo do container define a cor visual
3. Opcionalmente adicionar variáveis CSS dedicadas para o fundo da logo se necessário

**Arquivos afetados**: `public/images/logo.png` (reprocessado), `src/components/sections/Hero.tsx` (ajustes mínimos de CSS)

---

## Fase 4: Conteúdo editável via Markdown/YAML

**Motivação**: Permitir edição de dados pessoais, profissionais, contato e textos sem mexer em TypeScript/JSON.

**Arquitetura proposta**:

```
content/
├── identity.md          # Dados pessoais + empresa (frontmatter YAML)
├── projects.md          # Lista de projetos (frontmatter YAML por projeto)
├── experience.md        # Experiências profissionais (frontmatter YAML)
├── skills.md            # Skills e tech stack (frontmatter YAML)
├── workflow.md          # Etapas do processo (frontmatter YAML)
└── locales/
    ├── pt-BR.md         # Textos longos em PT-BR (bio, descrições, labels)
    └── en.md            # Textos longos em EN
```

**Formato exemplo** (`content/identity.md`):
```markdown
---
name: Jean Carlos Londero
brand: Dev do Chimas
role: Full-Stack Developer
email: contato@devdochimas.com.br
phone: "+55 (46) 3300-2670"
location: Florianópolis, SC — Brasil
logo: /images/logo.png

company:
  name: Londero Soluções em Tecnologia Ltda
  cnpj: 49.110.591/0001-49
  founded: "2023"
  status: Ativa

social:
  github: https://github.com/SEU_USUARIO
  linkedin: https://linkedin.com/in/SEU_USUARIO
---
```

**Formato exemplo** (`content/locales/pt-BR.md`):
```markdown
---
nav:
  about: Sobre
  skills: Skills
  experience: Experiência
  projects: Projetos
  contact: Contato
  toggleTheme: Alternar tema
  toggleLang: Switch to English

hero:
  greeting: "Olá, eu sou"
  scrollHint: Role para explorar
  roles:
    - Arquiteto de Software
    - Dev Full-Stack
    - Entusiasta de IA
    - Fazedor de Soluções
---

## about

### bio1
Sou desenvolvedor full-stack com mais de 6 anos transformando ideias complexas em produtos digitais reais...

### bio2
Trabalho principalmente com Python e TypeScript...

### quote
Código bom é aquele que o próximo dev entende — e o cliente nem precisa saber que existe.

## projects.supercota
SaaS de geração de orçamentos inteligentes para empresas...

## projects.jusdocs
Plataforma de documentos jurídicos...

## projects.cacheta
Jogo de cartas multiplayer em tempo real...
```

**Ações**:
1. Instalar `gray-matter` (parser de frontmatter YAML)
2. Criar arquivos `.md` em `content/` com todos os dados atuais migrados
3. Criar `src/lib/content.ts` — módulo de leitura que:
   - Lê e parseia os arquivos `.md` com `gray-matter`
   - Parseia seções do body markdown em textos por chave (usando headers como delimitadores)
   - Exporta funções tipadas: `getIdentity()`, `getProjects()`, `getSkills()`, etc.
   - Exporta `getMessages(locale)` que monta o objeto de mensagens para next-intl
4. Atualizar `src/i18n/request.ts` para usar `getMessages(locale)` em vez de `import()` direto
5. Atualizar todos os componentes que importam de `@/content/config` para usar as novas funções
6. Deletar `src/content/config.ts` e `messages/*.json` (migrados para `.md`)
7. Verificar build + runtime

**Arquivos afetados**: `content/*.md` (novos), `src/lib/content.ts` (novo), `src/i18n/request.ts`, `src/content/config.ts` (deletar), `messages/*.json` (deletar), todos os componentes que importam de `@/content/config`

---

## Ordem de execução

1. **Fase 2** (i18n) — Mais simples, 1 linha. Resolve o bug do 404 na raiz.
2. **Fase 1** (Biome) — Independente, formata o código.
3. **Fase 3** (Logo) — Processamento de imagem + CSS.
4. **Fase 4** (Markdown) — Mais complexa, migração de conteúdo.

## Validação final

- `pnpm build` passa sem erros
- `pnpm lint` (biome check) passa sem erros
- Dev server funciona: `/` carrega pt-BR, troca de idioma funciona, temas funcionam
- Logo adapta cor de fundo por tema
- Conteúdo vem dos arquivos `.md`
