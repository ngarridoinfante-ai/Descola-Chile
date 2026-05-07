# Plano de Metas e KPIs - 90 dias

Este plano prioriza conversao, clareza e confianca para turistas brasileiros em Santiago.

## 1) North Star Metric

North Star:

- Cupons usados por semana (dc_coupon_used)

Por que:

- Compra sem uso nao gera valor para parceiro.
- Uso comprova resultado comercial e fortalece renovacao de parceria.

## 2) KPIs por etapa do funil

Topo (descoberta):

- Usuarios que chegam em /descontos
- dc_view_discount_list
- CTR dos CTAs principais (dc_click_home_cta)

Meio (consideracao):

- dc_view_discount_detail
- taxa detalhe/lista
- uso de filtros (dc_apply_filter)

Fundo (compra):

- dc_begin_checkout
- dc_checkout_submit
- dc_purchase_success
- taxa compra = purchase_success / begin_checkout

Pos-compra (ativacao e valor):

- dc_coupon_activated
- dc_coupon_used
- taxa ativacao = activated / purchase_success
- taxa uso = used / activated

## 3) Metas sugeridas por fase

### Fase 1 (Semana 1 a 2) - Instrumentacao + baseline

Objetivo:

- estabilidade de tracking e baseline real

Metas:

- 95%+ de sessoes com evento dc_page_view
- 0 erros de script analytics em producao
- 100% das paginas chave enviando eventos

### Fase 2 (Semana 3 a 6) - Conversao primaria

Objetivo:

- melhorar compra a partir de descoberta

Metas:

- +20% em dc_purchase_success
- taxa detalhe/lista >= 35%
- taxa begin_checkout/detalhe >= 20%

### Fase 3 (Semana 7 a 12) - Valor para parceiros

Objetivo:

- aumentar uso real e prova de resultado

Metas:

- taxa ativacao >= 65%
- taxa uso >= 55%
- top 10 parceiros com crescimento de uso >= 15%

## 4) KPI targets iniciais (referencia)

- CTR home para descontos >= 12%
- Detalhe por lista >= 35%
- Checkout iniciado por detalhe >= 20%
- Compra por checkout iniciado >= 45%
- Ativacao por compra >= 65%
- Uso por ativacao >= 55%

## 5) Rituais de growth

Daily:

- anomalias de queda por pagina ou canal
- parceiros com pico de uso

Weekly:

- 1 experimento de copy no hero
- 1 experimento de card (badge, beneficio, prova social)
- 1 experimento de filtro ou ordenacao

Monthly:

- revisao de precos
- revisao de beneficios por categoria
- revisao de comissao por parceiro

## 6) Experimentos recomendados (ordem)

1. Hero copy orientado a economia real
2. Card com badge de confianca vs sem badge
3. Ordenacao por "Mais usados" como default
4. CTA do detalhe "Ativar desconto" com urgencia suave
5. WhatsApp contextual por categoria

## 7) Alertas operacionais

Alertar se:

- dc_purchase_success cair >20% semana/semana
- dc_coupon_used cair >15% semana/semana
- parceiro top cair >25% em uso
- source/medium novo com alto volume e baixa compra
