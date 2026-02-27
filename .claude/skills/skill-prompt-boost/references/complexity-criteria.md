# Prompt Boost — Critérios de Complexidade LEVE vs PESADO

Referência para a avaliação Q4 do gate e escolha de template no rewrite.

---

## Regra geral

Se a tarefa envolve apenas 1-2 arquivos sem decisão arquitetural,
escolha LEVE. Se há dúvida real sobre escopo ou risco, escolha
PESADO — o custo de contexto extra é menor que o custo de perder
reasoning e constraints numa tarefa complexa. O executor pode
reclassificar LEVE→PESADO durante a execução se o escopo crescer.

---

## Critérios PESADO (qualquer um basta)

| Critério | Definição | Exemplo |
|----------|-----------|---------|
| Afeta 3+ arquivos | Total de arquivos modificados (não contando testes) | Refatorar sistema de autenticação |
| Decisão arquitetural | Escolha entre padrões, estruturas ou abordagens | Migrar de protocolo síncrono para assíncrono |
| Refactor > 20 linhas | Total de linhas alteradas (diff), não por arquivo | Reorganizar módulo de API |
| Review de sistema inteiro | Sistema = módulo com pasta própria no projeto | Auditar todo o sistema de logging |
| Feature que cruza camadas | Frontend + Backend, UI + State, API + DB | Adicionar upload com preview + storage |
| Atualização de dependência core | Qualquer dependência principal do projeto | Atualizar framework para nova major version |
| Novo sistema/módulo completo | Pasta nova com estrutura completa | Criar sistema de notificações |

---

## Critérios LEVE (todos devem ser verdadeiros)

| Critério | Exemplo |
|----------|---------|
| 1-2 arquivos afetados | Adicionar teste para 1 módulo |
| Sem decisão arquitetural | Corrigir bug em função existente |
| Escopo claro e limitado | Mudar cor de um elemento visual |
| Não cruza camadas | Ajustar lógica dentro de 1 sistema |
| Sem dependências externas novas | Refatorar função pura |

---

## Exemplos classificados

### LEVE
- "adiciona validação no form" → 1-2 arquivos, sem decisão
- "corrige o bug no filtro de busca" → 1-2 arquivos, correção pontual
- "muda a cor do header" → 1 arquivo, visual simples
- "renomeia variável X" → busca + replace, sem lógica
- "adiciona constante pro timeout" → 1 arquivo, extrai valor

### PESADO
- "migra autenticação pra tokens stateless" → 4+ arquivos, arquitetura
- "adiciona sistema de cache" → cruza API + storage + middleware
- "refatora rotas pra usar file-based routing" → 10+ arquivos, arquitetura
- "atualiza framework principal para nova major version" → dependência core, breaking changes
- "implementa sistema de notificações" → novo sistema completo, múltiplas camadas
- "audita performance das queries" → review de sistema inteiro

---

## Q4 Adiado — Determinar em context_first

Quando a quantidade de arquivos afetados só pode ser determinada após explorar
o projeto, marque Q4 como indeterminado e avalie após context_first.

| Caso | Razão para adiar |
|------|-----------------|
| "cria uma página de perfil" | Pode ser 1 componente (LEVE) ou componente + rota + state (PESADO) |
| "adiciona uma tela de onboarding" | Estrutura de navegação só conhecida após ler o projeto |
| "cria a view de checkout" | Pode cruzar UI + state + API dependendo da arquitetura |

Ao avaliar Q4 em context_first: se a estrutura real revelar 3+ arquivos ou
decisão arquitetural → reclassificar para PESADO antes do rewrite.

---

## Templates

Os templates LEVE e PESADO estão definidos na fase `rewrite` do SKILL.md.
Consulte-os lá para evitar duplicação e dessincronização.
