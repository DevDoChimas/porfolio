# Prompt Boost — Red Flags do sanity_check

Definições completas dos flags detectados no sanity_check.
Referenciado pela fase `sanity_check` do SKILL.md.

---

## Catálogo de Flags (F1–F8)

Se QUALQUER flag for detectada, ela tem prioridade sobre o gate.
Se MÚLTIPLOS flags forem detectados, consolide todos em uma única
mensagem — não faça uma pergunta por flag.
Sempre resolva flags antes de prosseguir.

---

### F1 — wrong_target

O prompt referencia um arquivo, módulo, função ou conceito que não
existe neste projeto.

**Ação:** perguntar "Você quis dizer [match mais próximo]?" com opções.

**Nota:** a detecção no sanity_check é a priori — baseada nos sinais do
texto (referência claramente inventada, tecnologia não usada no
projeto, tipo errado). A verificação efetiva da existência ocorre
no context_first, que abortará via infeasibility_exit se o alvo
não for encontrado.

Sinais de referência claramente inventada: sufixo/prefixo explícito
que sinaliza dado fictício (por exemplo: NONEXISTENT, FAKE, TEST_ONLY,
PLACEHOLDER, DUMMY, MOCK_ONLY, INVALID, BOGUS, STUB — a lista não é
exaustiva; o critério é "o sufixo/prefixo sinaliza explicitamente que
o alvo não é real"), padrões ALL_CAPS incompatíveis com constantes do
projeto, tecnologias que contradizem a stack declarada no
CLAUDE.md/package.json. Nomes plausíveis mas não verificados
(AuthProvider, LoginModal) não disparam wrong_target no sanity_check
— delegados ao context_first via infeasibility_exit.

---

### F2 — contradictory

O prompt pede duas coisas que conflitam entre si.

**Ação:** perguntar qual delas ele realmente quer.

---

### F3 — typo_or_misspelling

O prompt contém o que parece ser um erro de digitação de um termo
conhecido do projeto.

**Ação:** confirmar o termo pretendido antes de prosseguir.

**Exceção:** se o termo normalizado for verbo técnico com Alta
inferibilidade (build, testa, lint, deploy), não perguntar —
aplicar a regra de normalização do gate diretamente (inferir+declarar).

---

### F4 — dangerously_broad

O prompt pode afetar toda a codebase ou um sistema crítico de forma
destrutiva. Exemplo: "refatora tudo", "deleta os testes".

**Ação:** pedir escopo específico antes de prosseguir.

---

### F5 — ambiguous_reference

O prompt usa um pronome ou referência vaga que pode apontar para
múltiplas coisas. Exemplo: "arruma aquilo", "melhora isso".

**Ação:** se houver domínio identificável ("o login", "o player"),
oferecer opções de escopo. Se for deítico puro sem domínio ("isso",
"aquilo"), pedir que o usuário identifique o alvo diretamente.

---

### F6 — episodic_reference

O prompt referencia estado de uma conversa anterior ou ação recente
da sessão: "o que combinamos", "o script que criamos", "como fizemos
antes", "continua o que fizemos". O skill não tem acesso à memória
episódica da sessão.

**Gatilho automático:** prompts iniciando com "sim", "yes", "yeah",
"continua", "segue", "vai em frente", "next" ou equivalentes como
primeiro token indicam resposta episódica — acionar este flag sem
análise adicional do restante do prompt.

**Exceção ao "sim":** quando a skill fez uma pergunta de confirmação
no turno imediatamente anterior desta sessão (ex: "confirmas que quer
X?"), "sim" é confirmação explícita do pedido — não é episódica,
prosseguir normalmente. Critério: "sim" isolado sem contexto de
confirmação recente → episódica; "sim" após pergunta de confirmação
→ pedido.

Para "continua"/"segue": o diagnóstico correto é "não tenho memória
do que estava sendo feito" — sugerir .claude/plans/ ou que o usuário
descreva a tarefa em andamento.

**Gatilhos de frase:** além dos tokens iniciais, frases como "o que
fizemos", "o que combinamos", "o que definimos", "o que planejamos",
"como ficou combinado", "como fizemos antes", "igual o que fizemos"
em qualquer posição do prompt também acionam este flag — o padrão
é sempre a referência à memória episódica, independente de onde a
frase aparece.

**Exceção ao gatilho automático:** tokens que coincidem com nomes de
frameworks ou ferramentas conhecidas ("next" para Next.js, "vite",
"react", "vue", "svelte", "solid" para SolidJS, "astro", "nuxt",
"remix") não disparam este flag quando aparecem como
substantivo/alvo da ação (ex: "next precisa de config", "next
tá com erro") — verificar se o token funciona como verbo episódico.

**Tokens PT-BR ambíguos:** "solid" pode ser SolidJS ou adjetivo PT-BR
("está sólido"), "next" pode ser Next.js ou "próximo" em contextos
mistos — para estes, o predicado da frase é o critério decisivo.
Predicado técnico (contém ao menos um termo de domínio de software:
build, deploy, config, erro, TypeScript, versão, dependência, etc.)
→ framework. Predicado genérico de estado anormal ("tá dando
problema", "não funciona") sem termo técnico → ambíguo → verificar.
Predicado adjetival/qualitativo ("tá bem", "está sólido") → pode
ser PT-BR → verificar. Verificar = fazer pergunta específica com
as duas interpretações como opções de múltipla escolha. Quando
ambíguo (token isolado sem predicado claro, ex: "next" sozinho ou
"vite" sem contexto), usar pergunta específica: "Você está se
referindo ao framework [Nome] ou estava continuando algo da nossa
conversa anterior?"

**Dois sub-casos:**

- Referência bloqueante (toda a ação depende do contexto episódico —
  sem a memória, nada pode ser feito): bloquear completamente e pedir
  que o usuário re-forneça o contexto. Sugestões: planos em
  .claude/plans/, colar o conteúdo, identificar o arquivo/ação.
- Referência acessória (o contexto episódico é apenas comparativo e
  a ação é executável sem ele. Ex: "igual como fizemos no outro projeto,
  configura o X aqui"): informar a limitação e oferecer executar a ação
  sem o contexto externo. Ex: "não tenho acesso ao que foi feito no
  outro projeto, mas posso [ação] neste projeto com base nas convenções
  atuais. Prossigo assim?"
  Exceção de alto impacto: quando a referência acessória pode mudar
  substancialmente a implementação (ex: "cria o componente X como
  fizemos antes" onde o padrão anterior seria arquiteturalmente
  diferente do atual), informar especificamente: "Não tenho acesso ao
  padrão usado anteriormente. Posso criar o componente X seguindo as
  convenções atuais do projeto — se o padrão anterior for diferente,
  me descreva o que precisa ser replicado."

---

### F7 — wrong_assumption

O prompt assume algo sobre a codebase que não é correto (tecnologia,
estrutura, dependência errada).

**Ação:** corrigir gentilmente e perguntar como proceder.

---

### F8 — scope_mismatch

O prompt referencia um conceito válido mas no módulo/camada errada.

**Ação:** informar onde realmente fica e perguntar como proceder.

---

### F9 — violates_project_rules

O prompt pede algo que viola convenções documentadas do projeto
(CLAUDE.md, CONTRIBUTING.md, linter configs, README, etc).

**Ação:** informar qual convenção seria violada e perguntar se deseja
prosseguir de forma diferente.

**F9 é aviso informacional, não bloqueio obrigatório.** Quando o usuário
demonstra intencionalidade clara no ordering ou no pedido (ex: "não testa
ainda", "pula o lint dessa vez", "sem commit por enquanto"), informar a
convenção e aguardar confirmação — mas não bloquear a execução com a
mesma força de F1 (wrong_target) ou F4 (dangerously_broad). O usuário
pode confirmar que quer prosseguir mesmo assim.

Sub-ações condicionais com confirmação implícita: quando a sub-ação
conflitante com regras do projeto vem qualificada por condição explícita
do usuário ("só quando eu pedir", "depois eu aviso quando quiser fazer"),
a confirmação já está embutida — não é necessário pedir confirmação adicional.
Registrar a intenção e aguardar o gatilho informado pelo usuário.

**Força da confirmação implícita:**
- Confirmação implícita **forte**: usuário especifica um gatilho concreto de
  delegação ("só quando eu pedir", "depois eu aviso quando quiser fazer",
  "quando eu mandar") → sem confirmação adicional; registrar e aguardar.
- Confirmação implícita **fraca**: usuário usa expressão temporal indefinida
  sem gatilho concreto ("por enquanto", "depois", "não agora", "eventualmente",
  "ainda") → F9 como aviso informacional leve + confirmação de 1 turno (ex:
  "Entendido, implemento sem testes e agendamos para depois. Confirma?"). Após
  confirmar, prosseguir normalmente.

**Múltiplos F9 simultâneos:** quando o prompt viola mais de uma convenção com
expressões de força fraca (ex: "sem commit por enquanto e sem testes ainda"),
consolidar ambos em 1 única mensagem de confirmação — não fazer uma pergunta
por F9. Ex: "Entendido — implemento sem commit e sem testes por ora. Confirma?"

**F9 como input isolado (sem verbo de ação principal):** quando o prompt
contém apenas restrições F9 sem ação associada (ex: "por enquanto sem testes",
"sem commit ainda"), tratar como instrução de contexto parcial → perguntar qual
é a ação desejada com a restrição já registrada: "Entendido que você quer
[restrição]. O que deseja implementar?"
