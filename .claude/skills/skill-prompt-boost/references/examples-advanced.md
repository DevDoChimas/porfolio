# Prompt Boost — Exemplos Avançados (9–15)

Edge cases, padrões compostos, observações e reclassificações.
Para fluxos principais (LEVE, PESADO, red flags): `references/examples-basic.md`

---

## Exemplo 9: Gate lazy — spec em arquivo referenciado

````xml
<example name="gate-lazy-spec-file">
<input>implementa o endpoint descrito no REQUIREMENTS.md</input>
<gate>
1. SEI O QUE FAZER? NÃO DETERMINADO (scope depende do conteúdo de REQUIREMENTS.md)
2. SEI ONDE FAZER? NÃO DETERMINADO (idem)
→ Gate lazy: Q1/Q2 indetermináveis por documento → context_first lê REQUIREMENTS.md
   antes de reavaliar o gate. Não bloquear com pergunta.
</gate>
<context_first>
Ler REQUIREMENTS.md → descoberto: endpoint POST /api/items com campos name, price,
categoria; validação de campos obrigatórios; resposta 201 Created com o item criado.
</context_first>
<gate_reavaliado>
1. SEI O QUE FAZER? SIM (criar endpoint POST /api/items conforme spec)
2. SEI ONDE FAZER? SIM (src/api/items/)
3. É SEGURO EXECUTAR? SIM
4. É COMPLEXO? NÃO (1-2 arquivos, endpoint novo com spec clara)
→ Nível: LEVE
</gate_reavaliado>
<rewrite>
```xml
<boosted_prompt>
  <task>
    <action>create</action>
    <target>POST /api/items endpoint</target>
    <scope>src/api/items/</scope>
  </task>
  <instructions>
    <step order="1">Criar handler para POST /api/items com validação de name, price, categoria</step>
    <step order="2">Retornar 201 Created com o item criado conforme spec em REQUIREMENTS.md</step>
    <step order="3">Adicionar testes para casos válidos e inválidos</step>
  </instructions>
  <done_when>
    <criterion>Endpoint criado conforme spec em REQUIREMENTS.md</criterion>
    <criterion>Validações de campos implementadas, testes passando</criterion>
  </done_when>
</boosted_prompt>
```
</rewrite>
<user_sees>
> Boost [LEVE]: criar endpoint POST /api/items conforme REQUIREMENTS.md
</user_sees>
</example>
````

---

## Exemplo 10: vi que + qualificador de incerteza → observação

````xml
<example name="vi-que-qualifier-observacao">
<input>vi que parece que tem um problema no módulo de pagamentos</input>
<intent_check>
"vi que" + qualificador de incerteza ("parece") + sem verbo de ação explícito
→ R20-1 prevalece: observação, não descrição de problema
"vi que parece" = especulação sobre fato percebido, não fato observado diretamente
→ Não agir. Perguntar.
</intent_check>
<action>
"Entendi que você percebeu algo suspeito no módulo de pagamentos.
Quer que eu:
(a) investigue o problema (análise e relatório)
(b) implemente uma correção específica — se sim, qual o problema exato?"
</action>
</example>
````

---

## Exemplo 11: Composite — sub-ação inviável que invalida o objetivo

````xml
<example name="compound-inaviavel-objetivo">
<input>implementa a feature de exportação e faz upload automático no servidor FTP da empresa</input>
<intent_check>Pedido composto: implementar feature + sub-ação de upload externo</intent_check>
<sanity_check>
Sub-ação: "upload no servidor FTP" = inviável diretamente (acesso a servidor externo,
credenciais não disponíveis para automação)
Inviabilidade que invalida objetivo: sem upload, a feature de exportação não serve
ao objetivo declarado — o objetivo completo não pode ser atingido.
</sanity_check>
<action>
"Posso implementar a feature de exportação localmente. No entanto, o upload automático
no servidor FTP da empresa não é possível — requer credenciais e acesso externo não
disponíveis aqui. Sem o upload, o objetivo completo não seria atingido.
Como quer prosseguir?
(a) implementar apenas a feature de exportação (sem upload)
(b) implementar a feature + documentar os passos para upload manual
(c) cancelar"
</action>
</example>
````

---

## Exemplo 12: Composite — sub-ação restrita (requer confirmação)

````xml
<example name="compound-subacao-restrita">
<input>cria a feature de comentários e abre o PR no GitHub</input>
<intent_check>Pedido composto: criar feature + sub-ação de criação de PR</intent_check>
<gate>
Ação principal: Q1 SIM, Q2 SIM, Q3 SIM, Q4 depende do escopo → LEVE/PESADO
Sub-ação: PR no GitHub = restrita (tecnicamente possível, mas requer confirmação
explícita por regra do projeto — afeta estado compartilhado externo)
→ Aviso consolidado antes de prosseguir
</gate>
<action>
"Vou criar a feature de comentários. Para abrir o PR no GitHub, essa ação requer
sua confirmação explícita — confirmas que quer que eu abra o PR após implementar?"
</action>
<after_clarification>
Usuário confirmou → implementar feature → abrir PR após conclusão.
Usuário negou → implementar apenas a feature, sem PR.
</after_clarification>
</example>
````

---

## Exemplo 13: Qualificadores aninhados + verbo de ação (R18-1 vence)

````xml
<example name="qualificadores-aninhados-com-verbo">
<input>parece que acho que o componente de tabela tá com bug, arruma</input>
<intent_check>
Qualificadores aninhados ("parece que", "acho que") + sem "vi que" + COM verbo de
ação explícito ("arruma")
→ R18-1 vence: verbo de ação prevalece sobre qualificadores de incerteza
→ Classificar como pedido explícito (não observação)
</intent_check>
<gate>
1. SEI O QUE FAZER? NÃO (ação vaga: "arruma" + bug não especificado)
2. SEI ONDE FAZER? SIM (componente de tabela)
→ Q1 NÃO: 1 pergunta direcionada
</gate>
<action>
"Vou corrigir o bug no componente de tabela. Qual é o comportamento incorreto?
(a) dados exibidos errados (ordenação, filtro, cálculo)
(b) erro de renderização (visual quebrado)
(c) performance (lentidão com muitos dados)
(d) outro"
</action>
<after_clarification>
Usuário respondeu: "(a) filtro não está funcionando"
→ Gate reavaliado: Q1 SIM, Q2 SIM, Q3 SIM, Q4 NÃO → LEVE
→ Boost [LEVE]: corrigir filtro no componente de tabela
</after_clarification>
</example>
````

---

## Exemplo 14: Reclassificação LEVE → PESADO durante execução

````xml
<example name="reclassificacao-leve-pesado">
<input>adiciona campo de telefone no formulário de cadastro</input>
<gate>
1. SEI O QUE FAZER? SIM (adicionar campo)
2. SEI ONDE FAZER? SIM (formulário de cadastro)
3. É SEGURO EXECUTAR? SIM
4. É COMPLEXO? NÃO (1-2 arquivos aparentemente) → LEVE
</gate>
<execute_task>
Durante execução: campo de telefone requer
- Validação no formulário (frontend)
- Schema de banco de dados (migration)
- Endpoint de atualização de perfil (backend)
- Testes E2E atualizados
→ 4+ arquivos, cruza frontend + backend + banco
→ GATILHO: afeta 3+ arquivos + cruza múltiplas camadas
</execute_task>
<reclassification>
> Reclassificando para PESADO: adicionar campo de telefone requer mudanças em 4
> camadas (form, schema, endpoint, testes) — escopo maior que o previsto.

Voltando ao context_first para mapear todas as dependências antes de prosseguir.
</reclassification>
<user_sees>
> Reclassificando para PESADO: adicionar campo de telefone requer mudanças em 4
> camadas (form, schema, endpoint, testes) — escopo maior que o previsto.
</user_sees>
</example>
````

---

## Exemplo 15: Composite — gate lazy + sub-ação restrita (R26-1)

````xml
<example name="gate-lazy-restricted-subaction">
<input>implementa o que está no REQUIREMENTS.md e depois faz commit</input>
<intent_check>Pedido composto com ordering explícito ("e depois")</intent_check>
<gate>
Sub-ações: (1) implementa conforme REQUIREMENTS.md = gate lazy (Q1/Q2 indetermináveis)
           (2) faz commit = restrita (requer confirmação explícita por regra do projeto)
→ Composite com gate lazy + sub-ação restrita:
  Emitir aviso consolidado ANTES de ir para context_first.
  Não ler REQUIREMENTS.md antes de confirmar as restrições.
</gate>
<action>
"Vou implementar o que está no REQUIREMENTS.md. Para fazer commit após implementar,
essa ação requer sua confirmação explícita — confirmas que quer que eu faça o commit
ao final?"
</action>
<after_clarification>
Usuário confirmou → context_first lê REQUIREMENTS.md → gate reavaliado → executa → commit.
Usuário negou → context_first lê REQUIREMENTS.md → executa → sem commit.
</after_clarification>
</example>
````
