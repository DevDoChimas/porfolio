# Prompt Boost — Classificação de Intenção

Tabelas de decisão e regras de sub-classificação para a fase `intent_check`.
Referenciado pela fase `intent_check` do SKILL.md.

---

## Tabela vi_que × verbo_de_ação

| "vi que" | verbo de ação? | resultado |
|----------|----------------|-----------|
| sim + estado anormal | sim | pedido de ação direto (R18-1 vence) |
| sim + estado anormal | não | descrição de problema → perguntar se investiga ou corrige |
| não ("acho que") | sim | pedido de ação direto (R18-1 vence) |
| não ("acho que") | não | observação → perguntar antes de agir |
| "vi que" + qualificador de incerteza | sim | pedido de ação direto (R18-1 vence sobre R20-1) |
| "vi que" + qualificador de incerteza | não | observação (R20-1 prevalece; sem ação explícita, a incerteza vence) |
| qualificadores aninhados sem "vi que" | sim | pedido de ação direto (R18-1 vence — a tabela de "vi que" não é exaustiva) |
| qualificadores aninhados sem "vi que" | não | observação (regra geral de qualificadores de incerteza) |

**Regras de aplicação:**

- Verbos de percepção que qualificam incerteza ("parece", "acho que")
  → observação. Qualificadores aninhados sem "vi que" (ex: "parece que acho
  que tem um bug") seguem a mesma regra — a cadeia de incerteza prevalece
  independentemente do número de qualificadores encadeados, desde que não haja
  verbo de ação explícito.
- "vi que"/"percebi que" + estado anormal claro → descrição de problema
  (reporta fato observado, não especula).
- Verbos de estado anormal claro ("tá dando erro", "não funciona",
  "está quebrando", "retorna errado", "não inicia", "retornando 500")
  → descrição de problema. Distinguir de estado subjetivo/de grau:
  "tá lento", "tá feio", "poderia ser melhor" → observação
  (grau/qualidade dependem de threshold do usuário) → perguntar.
- "vi que" + qualificador de incerteza = especulação sobre fato percebido,
  não fato observado diretamente → observação.
- Qualificadores aninhados: quando "vi que" e "parece que" ou "acho que"
  coexistem na mesma cláusula, o qualificador de incerteza interno prevalece.
  A regra se aplica independentemente do número de qualificadores encadeados:
  um ou mais "parece que"/"acho que" após "vi que" sem verbo de ação explícito
  sempre resultam em observação. Quando há verbo de ação explícito, R18-1
  prevalece independentemente da profundidade de aninhamento.

---

## Análise com output definido

Verbos: "analisa X", "revisa Y", "audita Z", "avalia W", "faz um review de X",
"lista os problemas de Y", "investiga X", "verifica Y", "diagnostica Z".

Trate como pedido de ação. Entre no fluxo completo com XML. Modo de
execução: tarefa de análise (a fase validate pula validação de código —
produz artefato: relatório, lista, documento).

Formulações interrogativas com output estruturado ("me diz o que falta
em X", "me mostra o que está errado em Y") também são análise se o output
esperado for lista/inventário/relatório.

**Teste rápido:** "a resposta caberia num parágrafo conversacional?" →
se NÃO → análise com output definido.

Verbos de investigação com qualificador de incerteza: quando "investigar",
"verificar" ou "diagnosticar" aparecem com qualificador de incerteza
(ex: "acho que tem um problema, investigar por favor"), o verbo de ação
vence (R18-1) — classifica como análise com output definido, não observação.

---

## Pedido Composto — Sub-regras

### Paralelo vs sequencial
Ações independentes podem ser executadas em paralelo.

Exceção paralelo→sequencial: refatorações que compartilham tipos,
interfaces ou contratos devem ser executadas sequencialmente — tipos
alterados em A precisam estar estáveis antes de B ser refatorado.

Dependência causal análise→ação: quando o composite inclui uma etapa
de análise cujo resultado determina a ação seguinte, pause após completar
a análise e apresente os resultados ao usuário antes de proceder com a
ação — a ação pode não ser necessária ou pode mudar de escopo.

### Sub-ação vs validação (PESADO)

Para cada ação secundária, testar:
- "Esta ação VALIDA a implementação principal?" (testes, typecheck,
  lint, build) → integrar como critério em `<done_when>`.
- "Esta ação produz artefato INDEPENDENTE consumível por outros?"
  (README, docs, changelog, deploy, notificação) → XML separado.

Em caso de dúvida, XML separado é mais seguro (não perde a ação).

Exemplos que devem ser integrados como `<done_when>` (não XML separado):
smoke tests, health checks, integration tests pós-deploy, testes de regressão
pós-refactor, linting pós-formatação.

Precedência sobre ordering explícito: quando o usuário especifica ordering como
"roda smoke tests depois do deploy", o smoke test ainda vai em `<done_when>` —
é validação, não ação independente. O ordering "depois" descreve o fluxo lógico
correto, que coincide com `<done_when>` sendo verificado após a execução.

### Sub-ações inviáveis

Se o pedido composto incluir uma sub-ação fora do escopo executável
(notificação de equipe, envio de e-mail, deploy manual, ação que requer
ferramenta não disponível), informar explicitamente quais sub-ações serão
executadas e quais não, pedindo confirmação antes de prosseguir.

Inviabilidade que invalida o objetivo: quando a sub-ação inviável não é
apenas auxiliar mas é condição para o objetivo principal fazer sentido,
informar que o objetivo completo não pode ser atingido e perguntar como
proceder.

### Sub-ações restritas

Distinguir de inviáveis (tecnicamente impossíveis). Push, PR, commit,
deploy em ambiente com acesso disponível são tecnicamente executáveis —
mas requerem confirmação explícita por regra do projeto.
Comportamento: informar e perguntar antes de executar.

### Sub-ação com disponibilidade indeterminada

Quando não é possível classificar a sub-ação como restrita ou inviável
sem verificar o ambiente (ex: "faz backup manual", "deploy em [ambiente X]"
quando o ambiente X não está declarado com acesso confirmado), ir para
context_first para verificar disponibilidade antes de classificar.
Distinção de inviável: se a ação poderia existir como script ou comando
local no projeto, é indeterminada — não inviável. Assistente nunca tem
acesso direto a canais externos (email, Slack) → esses são inviáveis.

Feature flag: "ativa a feature flag [X]" tem disponibilidade indeterminada
— pode ser variável no código local (executável diretamente) ou serviço
externo como LaunchDarkly/Unleash. Verificar context_first antes de classificar.

### Deploy: restrita vs indeterminada

- Deploy com ambiente **declarado** no projeto (script "deploy" em
  package.json, target em Makefile, env explícito em CLAUDE.md/README) →
  **restrita** (tecnicamente executável, requer confirmação antes de
  executar).
- Deploy com ambiente **não declarado** (ex: "faz deploy na staging" quando
  staging não está documentado no projeto) → **indeterminada** (verificar
  context_first antes de classificar).
- Nunca assumir disponibilidade de deploy sem base declarada no projeto.
- Aviso consolidado + confirmação: quando deploy restrito e outras sub-ações
  indeterminadas coexistem no composite, consolidar em 1 mensagem única.
- Exceção de ordenamento: quando a classificação do deploy (restrita vs
  indeterminada) só pode ser determinada após context_first, ir ao
  context_first primeiro para essa sub-ação, e só depois emitir o aviso
  consolidado. Não emitir aviso com classificação provisória baseada em
  suposição — verificar antes de informar.

### Push notification vs notificação de equipe

- "notificação push" (browser Push API, Web Push) — disponibilidade
  indeterminada (depende de service worker e permissão) → verificar context_first.
- "notificação de equipe" / "avisa a equipe" / "manda no Slack" / "envia
  e-mail" — inviável diretamente (requer credenciais externas) → comportamento
  de sub-ação inviável sem verificação.
- Implementar a feature de push notification ("adiciona Web Push API") — tarefa
  de desenvolvimento normal, não sub-ação de comunicação. Seguir fluxo standard.

### Entrega conversacional vs comunicação externa

"Me envia X", "me manda X", "me passa X" sem canal externo especificado =
entrega conversacional interna (apresentar resultado nesta sessão), NÃO é
sub-ação inviável.
Inviável: "manda no Slack", "envia por email para X", "notifica a equipe por Y"
(comunicação com destinatário externo via ferramenta de terceiro).

### Mix de categorias

Quando um composite contém sub-ações de categorias diferentes (restrita +
indeterminada + inviável), consolidar num único aviso ao usuário listando
cada sub-ação e sua categoria. Não fragmentar em múltiplas mensagens.

Sequência quando o composite inclui sub-ações indeterminadas ou restritas
combinadas com gate lazy: emitir o aviso consolidado imediatamente. Aguardar
confirmação antes de ir para context_first. Não ir para context_first antes
de emitir o aviso consolidado.

Sub-ações restritas (commit, push, PR, deploy em produção) em compostos com
gate lazy seguem a mesma sequência — o usuário precisa confirmar as restrições
antes de o skill comprometer tempo lendo documentos que podem não ser necessários
se o usuário cancelar. Não assumir que o usuário quer o todo antes de ele
confirmar as restrições.

Sub-ações restritas sem gate lazy: mesmo quando a ação principal tem Q1/Q2
determináveis (sem gate lazy), sub-ações restritas devem ser confirmadas
antes de iniciar qualquer execução. O rationale é o mesmo — não comprometer
trabalho se o usuário cancelar após ver a restrição. Consolide aviso de
sub-ações restritas + indeterminadas em uma única mensagem antes de executar.

### Ordering e dependências técnicas

Precedência de ordering: quando o usuário especifica ordering explícito
(usando "depois", "primeiro", ou negação direta como "não testa ainda"),
esse ordering prevalece sobre a otimização automática de integrar como
done_when.

Conflito ordering vs dependência técnica: quando o ordering explícito
contradiz uma dependência técnica obrigatória, informar o conflito e
sugerir a ordem técnica correta. Não executar em ordem tecnicamente
incorreta sem avisar.

Ordering stack-dependente: quando a corretude técnica do ordering
depende da stack identificada (ex: schema-first vs migration-first varia
por ORM), adiar a avaliação do conflito para após o context_first.

Dependência técnica invariante: quando a dependência existe em qualquer
projeto com a linguagem/paradigma base (ex: tipos/interfaces/schemas
TypeScript antes de implementação que os usa), usar conflito de ordering
diretamente.

Dependência stack-dependente: quando a dependência varia por ORM,
framework ou ferramenta de build — ordenação é stack-dependente.

Desambiguação de "depois": a palavra "depois" aparece em dois contextos
com comportamentos distintos — usar a sub-ação qualificada como critério:
- "depois" modifica sub-ação de **validação** (testes, smoke tests, lint,
  typecheck, health checks) → ordering de validação → integrar em
  `<done_when>` (R29-1). Ex: "roda smoke tests depois do deploy".
- "depois" modifica **ação restrita do projeto** (commit, push, deploy em
  produção) → F9 força fraca → aviso informacional + confirmação de 1
  turno. Ex: "commit deixa pra depois".
Regra de decisão: se a sub-ação qualificada por "depois" é do tipo
validação, prevalece R29-1. Se é do tipo ação restrita, prevalece F9 fraco.

Desambiguação semântica dentro de "depois" + validação:
- Construção `"roda/executa [validação] depois de [ação]"` → ordering natural,
  a validação ocorre após a ação principal → integrar em `<done_when>`.
- Construção `"[validação] deixa/fica pra depois"` → skip intencional (o
  usuário quer adiar, não apenas sequenciar) → F9 força fraca (equivalente
  a "sem [validação] por enquanto").
Critério: `"[objeto] deixa pra depois"` indica intenção de pular/adiar, não
de executar em sequência.
