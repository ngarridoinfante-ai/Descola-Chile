# Concierge IA 24/7 - Descola Chile Powered by Dicas da Pri

Objetivo: transformar o conhecimento da Dicas da Pri (videos, guias, FAQ e experiencia real) em uma camada de inteligencia que responda duvidas de brasileiros no Chile com contexto pratico e linguagem clara.

## 1) Decisao de marca

- Nova diretriz: Descola Chile powered by Dicas da Pri.
- Posicionamento: concierge de viagem 24/7 para brasileiros no Chile.
- Promessa: respostas objetivas, com contexto local e orientacao acionavel.

## 2) Fontes de conhecimento

Prioridade de ingestao:

1. Videos YouTube da Dicas da Pri (titulos, descricoes, transcricoes).
2. Guias e paginas proprias do site Descola Chile.
3. FAQ real coletada via WhatsApp e suporte.
4. Regras comerciais (cupons, parceiros, condicoes).

Checklist por video:

1. URL do video.
2. Tema principal (ex.: neve, cambio, bairros, restaurante).
3. Perfil do turista (casal, familia, primeira viagem, inverno).
4. Risco/erro comum citado no conteudo.
5. Acao recomendada final.

## 3) NotebookLM como base de conhecimento

Fluxo recomendado:

1. Criar um caderno mestre: "Descola Chile - Base Dicas da Pri".
2. Subir lotes de conteudo por tema (neve, cambio, transporte, etc.).
3. Manter taxonomia padrao de tags:
- `tema:` neve | cambio | roteiro | bairros | gastronomia | compras | seguranca
- `perfil:` casal | familia | solo | primeira-viagem
- `estacao:` inverno | verao | meia-estacao
- `cidade:` santiago | valle-nevado | vina-del-mar
4. Registrar respostas de referencia para perguntas recorrentes.
5. Revisar respostas com curadoria humana semanal.

Regras editoriais da resposta IA:

- Comecar com resposta direta em 1-2 frases.
- Entregar passos praticos em lista curta.
- Avisar excecoes e riscos comuns.
- Encerrar com proxima acao objetiva.
- Escalar para humano quando houver compra, emergencia ou duvida sensivel.

## 4) Arquitetura alvo (pragmatica)

Camadas:

1. Conhecimento: NotebookLM com conteudo da Dicas da Pri.
2. Orquestracao: n8n para pipeline de ingestao, logs e monitoramento.
3. Persistencia: Supabase para historico de perguntas, feedback e lacunas.
4. Interface: site Descola Chile + WhatsApp como canal principal.

Eventos minimos para mensurar:

- `dc_ai_question_started`
- `dc_ai_answer_delivered`
- `dc_ai_escalation_whatsapp`
- `dc_ai_feedback_positive`
- `dc_ai_feedback_negative`

## 5) Backlog de implementacao

Fase 1 (1-2 semanas):

1. Curadoria dos 50-100 videos mais relevantes.
2. Caderno NotebookLM por tema.
3. Definir playbook de respostas e tom de voz.
4. Publicar bloco "Concierge IA" na home (✅ feito - Mai 2026).
5. Rebranding para Dicas da Pri: cores rosa/coral aplicadas em todo CSS (✅ feito - Mai 2026).

Fase 2 (2-4 semanas):

1. Capturar FAQ do WhatsApp e classificar por intencao.
2. Criar base de lacunas (perguntas sem resposta boa).
3. Instrumentar eventos GA4 para uso da IA.
4. Definir SLA de escalada para atendimento humano.

Fase 3 (4-8 semanas):

1. Integrar automacoes via n8n para atualizar base de conhecimento.
2. Criar painel de qualidade de respostas (taxa de resolucao).
3. Expandir para recomendacoes personalizadas por perfil de viagem.

## 6) Governanca

- Dono de conteudo: equipe editorial (curadoria Dicas da Pri).
- Dono tecnico: equipe Descola (integracao e monitoramento).
- Revisao semanal:
1. Top perguntas da semana.
2. Respostas com baixa satisfacao.
3. Novos temas para ingestao.

## 7) Definicao de pronto de resposta IA

Uma resposta so e considerada pronta quando:

1. E clara e especifica para brasileiros no Chile.
2. Evita suposicoes sem fonte.
3. Inclui proxima acao e, se preciso, escalada humana.
4. Pode ser auditada em historico (pergunta, resposta, feedback).
