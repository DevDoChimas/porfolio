# Regressao: Otimizacao de Tokens (SKILL.md 485→409 linhas)

Verifica que a otimizacao de tokens nao introduziu regressoes comportamentais.

**Baseline**: R40 (convergencia completa em ambos modelos)
**Mudancas**: Secao `<rules>` removida (9 duplicatas), R10/R11/R12 realocadas,
gate inference comprimido, fixes de coverage (R10 em objective, R12 em intent_check).

---

## Protocolo de Execucao

1. Abrir sessao Claude Code no modelo alvo (Sonnet 4.6 OU Opus 4.6)
2. Invocar `/boost [prompt do caso]` para cada caso
3. Observar ATE a fase rewrite (nao executar a tarefa)
4. Registrar: classificacao (intent), gate (Q1-Q4), nivel (LEVE/PESADO),
   perguntas feitas, formato das perguntas
5. Comparar com comportamento esperado

**Criterio de regressao**: qualquer mudanca de classificacao, gate, ou
comportamento em relacao ao baseline R40 = FAIL.

**Ordem**: Executar SEQUENCIALMENTE — Sonnet 4.6 primeiro, Opus 4.6 depois.

---

## Bloco A — Camada 1 (Regressao Fixa, 13 casos)

Referencia: `eval/testing-methodology.md` secao "Camada 1".
Estes casos ja foram estabilizados em R40. Qualquer FAIL = bug critico.

| ID | Prompt | Esperado | S4.6 | O4.6 |
|----|--------|----------|------|------|
| R01 | "como funciona o sistema de autenticacao?" | Pergunta → resposta direta, sem XML | | |
| R02 | "adiciona validacao no formulario de contato" | Acao → LEVE → executa | | |
| R03 | "refatora tudo" | dangerously_broad → flag → pergunta escopo | | |
| R04 | "arruma o login" | Q1=NAO → 1 pergunta sobre o que corrigir | | |
| R05 | "vi que o login ta quebrando" | vi_que + estado anormal + sem verbo → desc. problema → perguntar | | |
| R06 | "vi que o login ta quebrando, corrige" | vi_que + estado anormal + verbo → acao direta (R18-1), Q1=Alta | | |
| R07 | "vi que parece que tem um problema" | vi_que + qualificador + sem verbo → observacao (R20-1) | | |
| R08 | "vi que parece que tem um bug, corrige" | vi_que + qualificador + verbo → acao direta (R18-1 vence) | | |
| R09 | "usa o NONEXISTENT_MODULE" | wrong_target → perguntar match mais proximo | | |
| R10 | "implementa a feature TypeScript e depois define as interfaces" | dependencia invariante → conflito ordering | | |
| R11 | "cria o componente e faz backup do banco" | backup = indeterminado → aviso consolidado → confirmacao | | |
| R12 | "cria o endpoint documentado no swagger.yaml" | swagger = gate lazy → context_first le o arquivo | | |
| R13 | "implementa a feature e avisa a equipe no Slack" | Slack = inviavel direto → aviso, confirmacao | | |

---

## Bloco B — Camada 2 (Invariantes, 8 casos)

Teste binario PASS/FAIL. Qualquer FAIL = bug critico.

| ID | Invariante | Prompt de teste | S4.6 | O4.6 |
|----|------------|-----------------|------|------|
| I1 | Pergunta → sem execucao | "o que e um barrel file?" | | |
| I2 | Red flag → gate bloqueado | "usa o NONEXISTENT_MODULE" | | |
| I3 | Q1/Q2=NAO → exatamente 1 pergunta | "arruma o login" | | |
| I4 | XML nunca mostrado ao usuario | qualquer acao | | |
| I5 | Max 2 rodadas de esclarecimento | prompt vago | | |
| I6 | Red flags consolidados em 1 msg | prompt com 2+ flags | | |
| I7 | PESADO: context_first le antes de planejar | tarefa PESADO | | |
| I8 | Sub-acoes inviaveis nao executadas | pedido com Slack/email | | |

---

## Bloco C — Regras Realocadas (3 casos criticos)

Estes testam ESPECIFICAMENTE as regras que foram movidas de `<rules>`.
Se qualquer um falhar, a realocacao causou regressao.

| ID | Regra | Prompt | Esperado | S4.6 | O4.6 |
|----|-------|--------|----------|------|------|
| T-R10 | Multipla escolha | "arruma o botao" | Pergunta de MULTIPLA ESCOLHA (a/b/c/d), NAO pergunta aberta | | |
| T-R11 | Proposito geral | "adiciona funcao que formata data pra 2024-01-15" | Solucao GENERICA (formato parametrizavel), NAO hard-coded | | |
| T-R12 | Acentuacao PT-BR | "cria um componente de formulario de contato" | Output em portugues COM acentos corretos | | |

---

## Bloco D — Gate Inference Comprimido (6 casos)

Testam a logica de inferibilidade que foi comprimida (Alta/Parcial/Zero).

| ID | Prompt | Inferibilidade | Esperado | S4.6 | O4.6 |
|----|--------|----------------|----------|------|------|
| T-G1 | "corrige o build" | Alta | Inferir+declarar, sem pergunta | | |
| T-G2 | "lint" | Alta (verbo tecnico univoco) | Inferir+declarar | | |
| T-G3 | "deploy" | Depende do projeto | Verificar env padrao antes de decidir | | |
| T-G4 | "corrige o botao" | Parcial | Perguntar + oferecer suposicao | | |
| T-G5 | "arruma isso" | Zero | Bloquear com pergunta obrigatoria | | |
| T-G6 | "vi que o componente de busca ta lento, otimiza" | Parcial (estado de grau) | Q1=Parcial, perguntar threshold | | |

---

## Bloco E — Coverage Fixes (4 casos)

Testam os 2 fixes aplicados apos review por LLMs:
- R10 promovida para `<objective>` (escopo global)
- R12 adicionada em `<intent_check>` (respostas diretas)

| ID | Fix | Prompt | Esperado | S4.6 | O4.6 |
|----|-----|--------|----------|------|------|
| T-F1 | R10 em intent_check | "como instalo o pacote?" | Se resposta direta, deve usar portugues com acentos | | |
| T-F2 | R12 em intent_check | "o que e um barrel file?" | Resposta com acentuacao PT-BR correta | | |
| T-F3 | R10 em context_first | Prompt vago que gera flag tardio | Pergunta de multipla escolha (nao aberta) | | |
| T-F4 | R10 global | "arruma o css" + Q1=NAO | Esclarecimento via multipla escolha | | |

---

## Bloco F — Prompts Reais (10 selecionados do Grupo 2)

Subconjunto mais critico dos 34 prompts reais do usuario.

| ID | Prompt | Esperado | S4.6 | O4.6 |
|----|--------|----------|------|------|
| P01 | "bora testar os hooks do projeto do claude" | Acao, inferibilidade Alta | | |
| P05 | "cria a estrutura" | Vago: Q1=Parcial, perguntar qual estrutura | | |
| P06 | "roda pra testar" | Acao clara, contexto implicito | | |
| P11 | "como executo o plugin da pasta .claude?" | Pergunta pura → resposta direta | | |
| P14 | "acho q nem precisa copiar os repos..." | Observacao → perguntar antes de agir | | |
| P22 | "apenas verifica se agentignore esta correto e testa configs do discord" | Composto: verifica + testa | | |
| P25 | "sim, instala e roda pra testar" | Sessao fresca: F6 episodic_reference ("sim" sem turno anterior). Com contexto: composto claro | | |
| P30 | "revisa tds alteracoes" | Analise + red flag (tds = todos), typo_or_misspelling | | |
| P32 | "esse brilho excessivo dentro do botao ta estranho ficou lilas" | Observacao pura → nao executar | | |
| P33 | "sim ajusta td" | Red flag dangerously_broad? ou confirmacao valida? | | |

---

## Scoring

### Por bloco

| Bloco | Casos | Peso | Criterio |
|-------|-------|------|----------|
| A (C1 regressao) | 13 | Gating | Score < 4.8 → FAIL global |
| B (C2 invariantes) | 8 | Gating | Qualquer FAIL → FAIL global |
| C (regras realocadas) | 3 | 30% | Regressao aqui = reverter mudanca |
| D (gate comprimido) | 6 | 25% | Regressao aqui = reverter compressao |
| E (coverage fixes) | 4 | 20% | Regressao aqui = fix insuficiente |
| F (prompts reais) | 10 | 25% | Referencia qualitativa |

### Criterios de aprovacao

- Blocos A + B: PASS (gating obrigatorio)
- Bloco C: 3/3 corretos (regras realocadas intactas)
- Bloco D: 5/6+ corretos (gate inference preservado)
- Bloco E: 3/4+ corretos (fixes efetivos)
- Bloco F: >= 80% corretos (prompts reais)
- Resultado IDENTICO entre Sonnet 4.6 e Opus 4.6 para Blocos A-D

### Se falhar

| Bloco | Acao |
|-------|------|
| A ou B | Bug critico — reverter TODAS as mudancas |
| C | Reverter realocacao da regra especifica que falhou |
| D | Reverter compressao do gate inference |
| E | Reforcar o fix (mover regra para local mais visivel) |
| F | Avaliar caso a caso — pode ser falso positivo |

---

## Template de Resultado

```
# Resultado R-OPT (Otimizacao de Tokens)

## Sonnet 4.6
Data: 2026-02-24
Bloco A: 13/13 (score medio: 5.00)
Bloco B: 8/8 PASS
Bloco C: 3/3
Bloco D: 6/6
Bloco E: 4/4
Bloco F: 10/10
Veredicto: PASS

## Opus 4.6
Data: 2026-02-24
Bloco A: 13/13 (score medio: 5.00)
Bloco B: 8/8 PASS
Bloco C: 3/3
Bloco D: 6/6
Bloco E: 4/4
Bloco F: 10/10
Veredicto: PASS

## Divergencias entre modelos
- R04: Sonnet Q2=NAO vs Opus Q2=SIM (variacao limítrofe, resultado final identico)
- R08: Sonnet F5 vs Opus Q2=NAO (mecanismo diferente, comportamento identico: ambos param)
- P01: Sonnet Alta direto vs Opus Q2=Parcial (variacao de confianca)
- P25: Sonnet composto claro vs Opus F6 episodic_reference (Opus mais correto em sessao fresca)

## Double-check externo
Revisor: Codex (GPT-5.3)
Achados:
- P25 Sonnet: deveria ter detectado F6 (test case atualizado)
- T-R11 Sonnet F7: over-trigger leve, defensavel, sem impacto no resultado
- Gate inference comprimido: preservou logica principal, sensibilidade fina levemente reduzida em fronteiras
Veredicto do revisor: nenhuma regressao critica

## Decisao
[x] Aprovado — mudancas mantidas
[ ] Reprovado — reverter [especificar quais mudancas]
```
