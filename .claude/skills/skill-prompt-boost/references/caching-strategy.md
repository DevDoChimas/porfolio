# Caching Strategy para Skills

## Prompt Caching (API Anthropic)

O `cache_control: {type: "ephemeral"}` cacheia blocos estaticos acima de
1.024 tokens por 5 minutos. Skills com conteudo 100% estatico (sem
interpolacao dinamica) sao candidatos ideais.

### Aplicabilidade ao Claude Code CLI

O Claude Code NAO expoe `cache_control` diretamente no Skill tool.
O conteudo do SKILL.md entra como tool result no contexto. A otimizacao
viavel e estrutural: reduzir o SKILL.md e usar lazy-load de references.

### Melhores praticas

1. **Mantenha o SKILL.md enxuto**: regras duplicadas desperdicam tokens
   a cada invocacao. Mova detalhes para `references/` (carregados sob
   demanda).
2. **References sao lazy**: arquivos em `references/` so sao lidos quando
   o modelo chama Read tool. Nao contam no custo base da invocacao.
3. **Conteudo estatico vs dinamico**: se uma secao do SKILL.md nunca muda
   entre invocacoes, ela e candidata a caching na API. Se usa
   `$ARGUMENTS`, a interpolacao invalida o cache daquele bloco.
4. **Tamanho ideal**: SKILL.md abaixo de 4.000 tokens e o sweet spot —
   grande o suficiente para instruir, pequeno o suficiente para nao
   dominar o contexto.

### Integracoes API diretas

Para quem usa a API Anthropic diretamente (nao via Claude Code):

```json
{
  "role": "user",
  "content": [
    {
      "type": "text",
      "text": "<conteudo do SKILL.md>",
      "cache_control": { "type": "ephemeral" }
    },
    {
      "type": "text",
      "text": "Prompt do usuario aqui"
    }
  ]
}
```

O primeiro bloco (SKILL.md) sera cacheado por 5 minutos. Invocacoes
subsequentes dentro da janela usam o cache (custo reduzido em ~90%).
