# Prompt Boost — Templates e Regras de Reescrita

Templates XML, técnicas de prompt engineering e regras de validação
para a fase `rewrite` do SKILL.md.

---

## Template LEVE

Para tarefas simples (Q4 = NÃO). Overhead mínimo, execução rápida.

```xml
<boosted_prompt>
  <task>
    <action>[verbo imperativo: create, fix, refactor, add, remove, optimize]</action>
    <target>[objeto específico: componente, módulo, função, sistema]</target>
    <scope>[caminhos reais de arquivos ou nomes de módulos do projeto]</scope>
  </task>

  <instructions>
    <step order="1">[primeiro passo concreto]</step>
    <step order="N">[quantos passos forem necessários]</step>
  </instructions>

  <done_when>
    <criterion>[critério de conclusão verificável]</criterion>
  </done_when>
</boosted_prompt>
```

Mostrar ao usuário: `> Boost [LEVE]: [resumo de 1 linha]`

---

## Template PESADO

Para tarefas complexas (Q4 = SIM). Inclui contexto completo, reasoning,
constraints e plano de execução.

```xml
<boosted_prompt>
  <context>
    <files_to_read>[arquivos para explorar antes de começar]</files_to_read>
    <existing_patterns>[padrões relevantes já existentes na codebase]</existing_patterns>
    <dependencies>[módulos/sistemas com os quais esta mudança interage]</dependencies>
  </context>

  <task>
    <action>[verbo imperativo: create, fix, refactor, add, remove, optimize]</action>
    <target>[objeto específico: componente, módulo, função, sistema]</target>
    <scope>[caminhos reais de arquivos ou nomes de módulos do projeto]</scope>
  </task>

  <reasoning>
    [Explique em 2-4 frases: (1) o que será feito e por quê,
    (2) qual alternativa foi descartada, (3) principal risco.]
  </reasoning>

  <instructions>
    <step order="1">[primeiro passo concreto]</step>
    <step order="2">[segundo passo — referencie arquivos/funções específicas]</step>
    <step order="N">[quantos passos forem necessários]</step>
  </instructions>

  <constraints>
    <constraint>
      <do_not>[o que evitar]</do_not>
      <because>[por que isso importa]</because>
      <instead>[o que fazer em vez disso]</instead>
    </constraint>
  </constraints>

  <docs_to_consult>
    [Apenas docs do projeto identificados no context_first como
    relevantes para esta tarefa específica.]
  </docs_to_consult>

  <amplifiers>
    [Skills, agents ou automações configuradas no projeto, se existirem]
  </amplifiers>

  <execution_plan>
    [Para fluxos com decisões/loops, incluir Mermaid flowchart]
  </execution_plan>

  <done_when>
    <criterion>[critério de conclusão verificável]</criterion>
  </done_when>
</boosted_prompt>
```

Mostrar ao usuário: `> Boost [PESADO]: [resumo de 1 linha]`

---

## Técnicas de Prompt Engineering

Aplicar durante a reescrita:

1. **SEJA EXPLÍCITO** — Sempre especifique escopo e profundidade.
   "Crie testes" = mínimo. "Crie testes cobrindo todas as funções
   exportadas" = cobertura total.

2. **AÇÃO, NÃO SUGESTÃO** — Formule instruções como ações a implementar.
   "Mude esta função" não "Você poderia considerar mudar".

3. **EXEMPLOS CONCRETOS > ADJETIVOS** — Mostre um exemplo concreto em
   vez de descrever com adjetivos.

4. **SEQUÊNCIAS NUMERADAS** — Use "1. Faça X 2. Faça Y" em vez de prosa.
   Números melhoram a aderência.

5. **CONTEXTO ANTES DE INSTRUÇÕES** — Coloque dados relevantes ANTES dos
   passos de instrução, não depois.

6. **CONSTRAINTS COM RAZÕES** — Todo "não faça" deve incluir POR QUE e
   o que fazer EM VEZ DISSO.

7. **REFORÇO ESTRUTURAL** — Para tarefas complexas, use XML para fronteiras
   entre seções e Mermaid para fluxos com decisões/loops.

---

## Regras de Validação do XML

- `<action>` deve ser um único verbo imperativo, nunca palavras vagas
  como "arruma", "mexe", "olha". Traduza para inglês preciso.
- `<scope>` deve referenciar caminhos reais descobertos no context_first.
- `<instructions>` deve ter pelo menos 2 passos concretos e acionáveis.
- `<constraints>` deve incluir convenções relevantes do projeto (descobertas
  no context_first) quando aplicável. Não force regras não relacionadas.
- `<done_when>` deve ter pelo menos 1 critério verificável.
- `<reasoning>` deve explicar a abordagem escolhida e riscos considerados.
- Para LEVE: omitir context, reasoning, constraints, docs_to_consult,
  amplifiers, execution_plan. Foco em ação direta e rápida.
- Para PESADO: incluir docs_to_consult com caminhos reais quando existirem
  (omitir a tag se não houver docs relevantes), amplifiers com skills/agents
  relevantes quando existirem, e execution_plan com Mermaid quando o fluxo
  tiver decisões ou loops.
