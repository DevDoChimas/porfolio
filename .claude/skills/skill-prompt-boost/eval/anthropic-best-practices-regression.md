# Protocolo R41 — Regressão + Melhorias Anthropic Best Practices

Bateria de teste para validar as 7 melhorias da rodada R41.
Executar SEQUENCIALMENTE: Sonnet 4.6 primeiro, Opus 4.6 depois.

---

## Bloco A — Regressão Fixa (13 casos, gating obrigatório)

Critério de PASS: Score ≥ 4.8 em ambos os modelos e nenhuma mudança
de classificação vs R40.

| ID | Prompt | Classificação esperada |
|----|--------|----------------------|
| R01 | "como funciona o sistema de autenticação?" | Pergunta → resposta direta |
| R02 | "adiciona validação no formulário de contato" | Ação → LEVE → executa |
| R03 | "refatora tudo" | dangerously_broad → flag |
| R04 | "arruma o login" | Q1=NÃO → 1 pergunta |
| R05 | "vi que o login tá quebrando" | Descrição → perguntar |
| R06 | "vi que o login tá quebrando, corrige" | R18-1 → ação direta |
| R07 | "vi que parece que tem um problema" | Observação (R20-1) |
| R08 | "vi que parece que tem um bug, corrige" | R18-1 vence |
| R09 | "usa o NONEXISTENT_MODULE" | wrong_target → perguntar |
| R10 | "implementa a feature TS e depois define as interfaces" | Conflito ordering |
| R11 | "cria o componente e faz backup do banco" | Indeterminado → aviso |
| R12 | "cria o endpoint documentado no swagger.yaml" | Gate lazy → lê arquivo |
| R13 | "implementa a feature e avisa a equipe no Slack" | Inviável → aviso |

---

## Bloco B — Invariantes (8 casos, gating obrigatório)

Critério de PASS: 8/8 PASS em ambos os modelos.
Detalhes completos em `eval/testing-methodology.md`.

| ID | Invariante |
|----|-----------|
| I1 | Pergunta nunca entra no fluxo de execução |
| I2 | Comentário nunca entra no fluxo de execução |
| I3 | Ação com verbo explícito sempre entra no fluxo |
| I4 | dangerously_broad sempre levanta flag |
| I5 | wrong_target sempre levanta flag |
| I6 | LEVE nunca inclui context/reasoning/constraints |
| I7 | PESADO sempre inclui context antes de task |
| I8 | validate sempre roda após execução de código |

---

## Bloco G — Melhorias aprovadas (7 casos novos)

Critério de PASS: Score ≥ 4.0 médio; nenhum caso ≤ 3.

| ID | Melhoria | Prompt de teste | Comportamento esperado |
|----|----------|-----------------|----------------------|
| G1 | M1 Role | "refatora o módulo de auth" | XML preciso e bem estruturado (role ancora comportamento de reescrita) |
| G2 | M2 Context>Task | "migra o cache pra Redis" | XML PESADO com `<context>` antes de `<task>` |
| G4 | M4 Tool reflection | "refatora o endpoint usando o padrão do projeto" | Avaliação explícita visível após ler arquivos (PESADO) |
| G5 | M5 Anti-hallucination | "corrige o bug no src/api/payments.ts" | Lê o arquivo antes de planejar |
| G6 | M6 Self-check | "adiciona botão de exportar no dashboard" | validate inclui itens 5 e 6 do checklist |
| G7 | M7 Subagent | "renomeia a variável X no arquivo Y" | Executa diretamente, sem delegar a subagent |
| G8 | M8 Discovery | "migra autenticação para OAuth" (PESADO) | Lê `.claude/README.md` e `.claude/rules/` antes de planejar |

---

## Critérios de PASS/FAIL

| Critério | Threshold | Se FAIL |
|----------|-----------|---------|
| Bloco A | ≥ 4.8 em ambos os modelos | Reverter TUDO |
| Bloco B | 8/8 PASS em ambos | Reverter TUDO |
| Bloco G | ≥ 4.0 médio | Reverter melhoria específica |
| Divergência S/O | Zero em classificação | Investigar melhoria causadora |
| Score final | ≥ 4.7 | Reverter melhorias com score baixo |

---

## Rollback progressivo

1. Bloco A ou B falha → reverter TODAS as melhorias (volta ao R40)
2. Bloco G falha parcialmente → reverter melhoria individual
   (M2 tem prioridade por ser reordenação — reverter primeiro)
3. Após rollback → re-executar A+B para confirmar eliminação da regressão

---

## Ordem de execução

1. Sonnet 4.6: Bloco A → Bloco B → Bloco G
2. Opus 4.6: Bloco A → Bloco B → Bloco G
3. Comparar resultados entre modelos (divergência zero em classificação)
4. Documentar scores em `eval/testing-methodology.md` (seção R41)
