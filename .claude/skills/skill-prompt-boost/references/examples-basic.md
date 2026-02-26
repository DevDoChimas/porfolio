# Prompt Boost — Exemplos Básicos (1–8)

Exemplos dos fluxos principais: LEVE, PESADO, prompts vagos, red flags e compostos.
Para edge cases e padrões avançados: `references/examples-advanced.md`

---

## Exemplo 1: Prompt claro (LEVE)

````xml
<example name="clear-prompt-leve">
<input>adiciona validação no formulário de contato</input>
<gate>
1. SEI O QUE FAZER? SIM (adicionar validação)
2. SEI ONDE FAZER? SIM (formulário de contato, a ser localizado)
3. É SEGURO EXECUTAR? SIM
4. É COMPLEXO? NÃO (1-2 arquivos, escopo limitado)
→ Nível: LEVE
</gate>
<rewrite>
```xml
<boosted_prompt>
  <task>
    <action>add</action>
    <target>form validation for contact form</target>
    <scope>src/components/ContactForm/</scope>
  </task>
  <instructions>
    <step order="1">Ler o componente do formulário para mapear campos existentes</step>
    <step order="2">Adicionar validação para campos obrigatórios e formato de email</step>
    <step order="3">Exibir mensagens de erro inline para cada campo inválido</step>
  </instructions>
  <done_when>
    <criterion>Formulário valida todos os campos e exibe erros apropriados</criterion>
  </done_when>
</boosted_prompt>
```
</rewrite>
<user_sees>
> Boost [LEVE]: adicionar validação ao formulário de contato
</user_sees>
</example>
````

---

## Exemplo 2: Prompt claro que exige template PESADO

````xml
<example name="clear-prompt-pesado">
<input>refatora o sistema de autenticação pra usar tokens stateless com refresh</input>
<gate>
1. SEI O QUE FAZER? SIM (refatorar autenticação)
2. SEI ONDE FAZER? SIM (módulo de auth)
3. É SEGURO EXECUTAR? SIM (com testes cobrindo)
4. É COMPLEXO? SIM (cruza 4+ arquivos: auth, middleware, rotas, storage)
→ Nível: PESADO
</gate>
<rewrite>
```xml
<boosted_prompt>
  <context>
    <files_to_read>
      src/auth/index (módulo de autenticação)
      src/middleware/auth (middleware de proteção de rotas)
      src/api/login (endpoint de login)
      src/api/refresh (endpoint de renovação)
    </files_to_read>
    <existing_patterns>Sessão baseada em cookie, middleware de auth existente</existing_patterns>
    <dependencies>rotas de API, middleware, storage de tokens no cliente</dependencies>
  </context>
  <task>
    <action>refactor</action>
    <target>authentication system to use stateless tokens with refresh</target>
    <scope>src/auth/, src/middleware/, src/api/</scope>
  </task>
  <reasoning>
    Autenticação atual usa sessões server-side. Tokens stateless com refresh
    permitem autenticação sem estado no servidor com renovação automática.
    Principal risco: rotação de refresh token precisa ser atômica para evitar
    race conditions. Alternativa descartada: sessões com sticky sessions (não escala).
  </reasoning>
  <instructions>
    <step order="1">Mapear interface pública do módulo de auth atual</step>
    <step order="2">Implementar geração e validação de tokens (access + refresh)</step>
    <step order="3">Criar endpoint de refresh com rotação de token</step>
    <step order="4">Atualizar middleware para validar token em vez de sessão</step>
    <step order="5">Atualizar testes existentes + criar novos para o fluxo completo</step>
  </instructions>
  <constraints>
    <constraint>
      <do_not>Armazenar refresh token em storage acessível via script</do_not>
      <because>Vulnerável a XSS</because>
      <instead>Usar httpOnly cookie ou mecanismo equivalente seguro</instead>
    </constraint>
  </constraints>
  <docs_to_consult>
    docs/decisions/auth-strategy (decisão arquitetural, se existir)
    docs/reference/api-conventions (padrão de endpoints, se existir)
  </docs_to_consult>
  <amplifiers>
    agent: security (revisão de vulnerabilidades)
    agent: backend (APIs e middleware)
  </amplifiers>
  <done_when>
    <criterion>Login retorna access + refresh token</criterion>
    <criterion>Refresh endpoint renova tokens com rotação</criterion>
    <criterion>Middleware valida token em todas as rotas protegidas</criterion>
    <criterion>Testes cobrem fluxo completo de auth</criterion>
  </done_when>
</boosted_prompt>
```
</rewrite>
<user_sees>
> Boost [PESADO]: refatorar autenticação para tokens stateless com refresh
</user_sees>
</example>
````

---

## Exemplo 3: Prompt vago

````xml
<example name="vague-prompt">
<input>arruma o login</input>
<gate>
1. SEI O QUE FAZER? NÃO ("arruma" é vago)
2. SEI ONDE FAZER? SIM (módulo de login, a ser localizado)
3. É SEGURO EXECUTAR? SIM
4. É COMPLEXO? -- (não avaliado, Q1 falhou)
</gate>
<action>
Domínio identificável (login), ação vaga (arruma) → inferibilidade Parcial.
Suposição padrão: validação de campos (problema mais comum em formulários de login).

"Vou assumir validação de campos — confirme ou escolha:
(a) validação de campos ← suposição padrão
(b) integração com API
(c) visual/estilo
(d) outro"
</action>
<after_clarification>
Usuário respondeu: "(a) validação de campos"
→ Q4 reavaliado: NÃO (1 módulo, correção pontual) → LEVE

```xml
<boosted_prompt>
  <task>
    <action>fix</action>
    <target>login form field validation</target>
    <scope>src/components/LoginForm/</scope>
  </task>
  <instructions>
    <step order="1">Ler componente de login para entender validação atual</step>
    <step order="2">Identificar campos sem validação ou com validação incorreta</step>
    <step order="3">Corrigir validação e rodar testes existentes</step>
  </instructions>
  <done_when>
    <criterion>Todos os campos validam corretamente, testes passam</criterion>
  </done_when>
</boosted_prompt>
```
</after_clarification>
<user_sees>
> Boost [LEVE]: corrigir validação de campos do login
</user_sees>
</example>
````

---

## Exemplo 4: Red flag — wrong_assumption

````xml
<example name="red-flag-wrong-assumption">
<input>usa o [biblioteca X] pra gerenciar o estado</input>
<sanity_check>
Red flag: wrong_assumption — projeto não usa [biblioteca X] (tecnologia incorreta).
</sanity_check>
<action>
"Este projeto não usa [biblioteca X]. O estado é gerenciado via [tecnologia real].
Como quer prosseguir?
(a) usar [tecnologia real] no módulo src/state/
(b) instalar [biblioteca X] no projeto (requer confirmação)
(c) cancelar"
</action>
<after_clarification>
Usuário respondeu: "(a) usa o que tiver"
→ Gate reavaliado: Q1 SIM, Q2 SIM, Q3 SIM, Q4 NÃO → LEVE

```xml
<boosted_prompt>
  <task>
    <action>refactor</action>
    <target>state management using project's existing solution</target>
    <scope>src/state/</scope>
  </task>
  <instructions>
    <step order="1">Ler o módulo de estado atual para entender a API disponível</step>
    <step order="2">Identificar o componente que precisava usar [biblioteca X]</step>
    <step order="3">Adaptar o código para usar [tecnologia real] equivalente</step>
  </instructions>
  <done_when>
    <criterion>Estado gerenciado via [tecnologia real], sem dependência de [biblioteca X]</criterion>
  </done_when>
</boosted_prompt>
```

> Boost [LEVE]: adaptar gerenciamento de estado para usar [tecnologia real]
</after_clarification>
</example>
````

---

## Exemplo 5: Red flag — scope_mismatch

````xml
<example name="red-flag-scope-mismatch">
<input>muda a cor do header no arquivo de rotas</input>
<sanity_check>
Red flag: scope_mismatch — cores/estilos ficam nos componentes ou no
tema, não no arquivo de rotas.
</sanity_check>
<action>
"Cores do header ficam no componente Header/ ou no tema (arquivo de estilos),
não nas rotas. Como quer prosseguir?
(a) alterar no componente Header/
(b) alterar no tema global (src/theme/)
(c) cancelar"
</action>
<after_clarification>
Usuário respondeu: "(a) no header"
→ Gate reavaliado: Q1 SIM, Q2 SIM, Q3 SIM, Q4 NÃO → LEVE

```xml
<boosted_prompt>
  <task>
    <action>modify</action>
    <target>header color</target>
    <scope>src/components/Header/</scope>
  </task>
  <instructions>
    <step order="1">Ler componente Header para identificar classes/variáveis de cor atuais</step>
    <step order="2">Alterar a cor conforme solicitado pelo usuário</step>
  </instructions>
  <done_when>
    <criterion>Cor do header atualizada no componente, visual correto</criterion>
  </done_when>
</boosted_prompt>
```

> Boost [LEVE]: alterar cor do header no componente Header/
</after_clarification>
</example>
````

---

## Exemplo 6: PESADO — refactor multi-arquivo

````xml
<example name="pesado-multi-file">
<input>migra todas as chamadas de API pra usar um cliente HTTP centralizado</input>
<gate>
1. SEI O QUE FAZER? SIM (migrar busca de dados para cliente centralizado)
2. SEI ONDE FAZER? SIM (módulos que fazem fetch de dados)
3. É SEGURO EXECUTAR? SIM (com testes cobrindo)
4. É COMPLEXO? SIM (5+ arquivos, nova abstração, muda padrão de data fetching)
→ Nível: PESADO
</gate>
<rewrite>
```xml
<boosted_prompt>
  <context>
    <files_to_read>
      src/api/ (todas as chamadas atuais)
      src/services/ (serviços de dados existentes)
      manifesto de dependências (dependências atuais)
    </files_to_read>
    <existing_patterns>Chamadas HTTP manuais espalhadas, tratamento de erro local</existing_patterns>
    <dependencies>módulos que consomem dados, cache de API</dependencies>
  </context>
  <task>
    <action>refactor</action>
    <target>API calls to use centralized HTTP client</target>
    <scope>src/api/, src/services/, src/</scope>
  </task>
  <reasoning>
    Data fetching atual usa chamadas HTTP manuais com tratamento de erro
    repetido em cada módulo. Um cliente centralizado unifica interceptors,
    retry, headers e tratamento de erros. Alternativa descartada: wrapper
    por endpoint sem centralização — não resolve duplicação de lógica.
    Risco: migrar incrementalmente sem quebrar módulos que ainda usam
    o padrão antigo.
  </reasoning>
  <instructions>
    <step order="1">Criar módulo de cliente HTTP com interceptores e tratamento de erros</step>
    <step order="2">Criar funções wrapper para cada endpoint existente</step>
    <step order="3">Migrar módulos um por um, começando pelos mais simples</step>
    <step order="4">Remover código de fetch manual após cada migração</step>
    <step order="5">Atualizar testes para usar o novo cliente</step>
  </instructions>
  <constraints>
    <constraint>
      <do_not>Migrar todos os módulos de uma vez</do_not>
      <because>Risco de regressão em múltiplos pontos simultaneamente</because>
      <instead>Migrar incrementalmente, validando cada módulo</instead>
    </constraint>
  </constraints>
  <execution_plan>
    flowchart TD
      A[Criar cliente HTTP] --> B[Criar wrappers por endpoint]
      B --> C[Migrar módulo mais simples]
      C --> D{Testes passam?}
      D -->|não| E[Corrigir]
      E --> D
      D -->|sim| F{Mais módulos?}
      F -->|sim| C
      F -->|não| G[Remover código morto]
      G --> H[Validação final]
  </execution_plan>
  <done_when>
    <criterion>Todas as chamadas de API usam o cliente centralizado</criterion>
    <criterion>Código de fetch manual removido</criterion>
    <criterion>Testes atualizados e passando</criterion>
  </done_when>
</boosted_prompt>
```
</rewrite>
<user_sees>
> Boost [PESADO]: migrar busca de dados para cliente HTTP centralizado
</user_sees>
</example>
````

---

## Exemplo 7: Pesquisa web obrigatória

````xml
<example name="pesquisa-web-obrigatoria">
<input>atualiza a lib de validação pra v5</input>
<gate>
1. SEI O QUE FAZER? SIM (atualizar dependência)
2. SEI ONDE FAZER? SIM (manifesto de dependências + breaking changes)
3. É SEGURO EXECUTAR? SIM (com verificação de breaking changes)
4. É COMPLEXO? SIM (atualização de lib core pode quebrar múltiplos módulos)
→ Nível: PESADO
</gate>
<!-- FASE context_first (interna — não exposta ao usuário):
     OBRIGATÓRIO: usar context7/web search para buscar changelog, breaking
     changes e guia de migração da v5 ANTES de planejar. Dados de treinamento
     podem estar desatualizados. Capturado como step order="1" no XML. -->
<rewrite>
```xml
<boosted_prompt>
  <context>
    <files_to_read>manifesto de dependências, grep por imports da lib no src/</files_to_read>
    <existing_patterns>APIs da lib em uso no projeto</existing_patterns>
    <dependencies>Todos os módulos que importam a lib</dependencies>
  </context>
  <task>
    <action>update</action>
    <target>validation library to v5</target>
    <scope>manifesto de dependências, src/</scope>
  </task>
  <reasoning>
    Atualização de dependência requer verificação de breaking changes
    via MCP antes de planejar. Preciso mapear quais APIs são usadas
    no projeto e cruzar com o changelog da v5.
  </reasoning>
  <instructions>
    <step order="1">Buscar changelog/migration guide da v5 via context7</step>
    <step order="2">Mapear todas as APIs da lib usadas no projeto</step>
    <step order="3">Identificar breaking changes que afetam o projeto</step>
    <step order="4">Atualizar manifesto de dependências e corrigir breaking changes</step>
    <step order="5">Rodar testes + build para validar</step>
  </instructions>
  <done_when>
    <criterion>Lib atualizada para v5 no manifesto de dependências</criterion>
    <criterion>Nenhum breaking change não resolvido</criterion>
    <criterion>Validação do projeto passa (lint + typecheck + test + build)</criterion>
  </done_when>
</boosted_prompt>
```
</rewrite>
<user_sees>
> Boost [PESADO]: atualizar lib de validação para v5 com verificação de breaking changes
</user_sees>
</example>
````

---

## Exemplo 8: Pedido composto (decomposição)

````xml
<example name="compound-request">
<input>muda o tema pra dark mode e adiciona um toggle no header e roda os testes</input>
<intent_check>
Pedido composto com 3 ações distintas:
1. Implementar dark mode
2. Adicionar toggle no header (depende da Ação 1 — toggle precisa do tema disponível)
3. Rodar testes
→ Decompor em ações sequenciais: Ação 1 → Ação 2 (dependência causal); Ação 3 como validação final
</intent_check>
<gate>
Ação 1: Q1 SIM, Q2 SIM (tema), Q3 SIM, Q4 NÃO → LEVE
Ação 2: Q1 SIM, Q2 SIM (header), Q3 SIM, Q4 NÃO → LEVE
Ação 3: Validação (parte do fluxo validate)
</gate>
<rewrite>
Ação 1:
```xml
<boosted_prompt>
  <task>
    <action>add</action>
    <target>dark mode theme support</target>
    <scope>src/theme/</scope>
  </task>
  <instructions>
    <step order="1">Localizar arquivo de tema/variáveis de estilo</step>
    <step order="2">Adicionar variáveis para dark mode</step>
  </instructions>
  <done_when>
    <criterion>Tema dark mode disponível via variáveis de estilo</criterion>
  </done_when>
</boosted_prompt>
```

Ação 2:
```xml
<boosted_prompt>
  <task>
    <action>add</action>
    <target>dark mode toggle in header</target>
    <scope>src/components/Header/</scope>
  </task>
  <instructions>
    <step order="1">Identificar componente do header</step>
    <step order="2">Adicionar botão de toggle que alterna a classe do tema</step>
  </instructions>
  <done_when>
    <criterion>Toggle no header alterna entre light e dark mode</criterion>
  </done_when>
</boosted_prompt>
```

Ação 3: Testes são executados na fase validate — não requerem XML separado.
</rewrite>
<user_sees>
> Boost [LEVE]: implementar dark mode + toggle no header
</user_sees>
</example>
````
