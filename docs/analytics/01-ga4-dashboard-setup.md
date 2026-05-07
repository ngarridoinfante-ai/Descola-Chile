# GA4 Dashboard Setup - Descola Chile

Este documento define como montar os 3 painéis principais no GA4 para operar crescimento e conversao da Descola Chile.

## 1) Pre-requisitos

1. Ativar GA4 no projeto:

- Arquivo: analytics-config.js
- enabled: true
- measurementId: seu id GA4 no formato G-XXXXXXXXXX
- debug: false em producao

2. Verificar eventos no navegador (DevTools):

- Procure logs [DescolaAnalytics] no console.
- Valide eventos no Network (collect?v=2) ou DebugView do GA4.

## 2) Eventos disponiveis no site

- dc_page_view
- dc_click_home_cta
- dc_click_whatsapp
- dc_view_discount_list
- dc_apply_filter
- dc_filter_no_results
- dc_view_discount_detail
- dc_click_activate_discount
- dc_begin_checkout
- dc_checkout_submit
- dc_purchase_success
- dc_coupon_activated
- dc_coupon_used
- dc_coupon_shared

## 3) Parametros importantes enviados

Comuns:

- page_path
- page_title
- timestamp
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- referrer

De conversao:

- product_id
- product_name
- product_price
- currency
- coupon_id
- coupon_name
- partner
- category
- district
- activation_code
- value

## 4) Configuracao no GA4

### 4.1 Marcar eventos como conversao

No GA4 > Admin > Events, marque como conversao:

- dc_purchase_success
- dc_coupon_activated
- dc_coupon_used

### 4.2 Criar dimensoes personalizadas

No GA4 > Admin > Custom definitions > Create custom dimensions:

Escopo Event:

- partner
- category
- district
- coupon_id
- coupon_name
- product_id
- product_name
- utm_source
- utm_medium
- utm_campaign

Metricas personalizadas (se necessario):

- value (event parameter)
- product_price (event parameter)

## 5) Painel 1 - Embudo de Conversao (turista)

Objetivo: entender onde o usuario abandona.

### Funil sugerido

Etapas (funnel exploration):

1. dc_view_discount_list
2. dc_view_discount_detail
3. dc_click_activate_discount
4. dc_begin_checkout
5. dc_checkout_submit
6. dc_purchase_success
7. dc_coupon_activated
8. dc_coupon_used

### Quebras recomendadas

- source / medium
- device category
- category
- partner

### KPI principal

- Taxa de compra: dc_purchase_success / dc_view_discount_list
- Taxa de ativacao: dc_coupon_activated / dc_purchase_success
- Taxa de uso: dc_coupon_used / dc_coupon_activated

## 6) Painel 2 - Performance por Partner

Objetivo: provar geracao de valor para parceiros.

### Tabela principal

Dimensoes:

- partner
- category

Metricas:

- Event count (dc_view_discount_detail)
- Event count (dc_coupon_activated)
- Event count (dc_coupon_used)
- Total users

### Indicadores derivados

- Ativacao por visualizacao: ativados / detalhes
- Uso por ativacao: usados / ativados
- Share de uso por parceiro: usados parceiro / usados total

## 7) Painel 3 - Performance por Canal (Growth)

Objetivo: saber quais campanhas trazem turistas mais qualificados.

### Tabela principal

Dimensoes:

- utm_source
- utm_medium
- utm_campaign

Metricas:

- Event count (dc_view_discount_list)
- Event count (dc_purchase_success)
- Event count (dc_coupon_used)
- Conversion rate (calculada)

### Regras de leitura

- Canal bom: compra e uso alto.
- Canal ruim: muito trafego e baixa compra.
- Canal para escalar: custo baixo com alta ativacao e uso.

## 8) Cadencia de analise

Diario (15 min):

- compras do dia
- ativacoes do dia
- uso por parceiro

Semanal (60 min):

- funil por canal
- top e low partners
- campanha ganhadora e campanha pausar

Mensal (90 min):

- cohort por mes de chegada
- mix de categorias
- decisao de precificacao e comissao
