# SonoraDrop Distribution 🎧🇦🇴

Plataforma angolana de **distribuição musical**: leva a tua música ao Spotify, Apple Music, YouTube Music, Boomplay e mais de 180 lojas em 190+ países — e recebe os royalties via Multicaixa Express, BAI ou PayPal.

Aplicação web completa, em português de Angola, construída com **React + Vite + TypeScript + Tailwind CSS**.

---

## Como correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificação TypeScript + build de produção (dist/)
npm run preview  # pré-visualizar o build
```

## Conta de demonstração

| Campo | Valor |
| --- | --- |
| Email | `mario@sonoradrop.ao` |
| Palavra-passe | `demo1234` |

Também podes criar uma conta nova em `/registar` — os dados ficam guardados no teu navegador (`localStorage`).

---

## Funcionalidades

### Site público
- **Landing page** com hero, lojas suportadas, como funciona, recursos, preços (mensal/anual), testemunhos, FAQ interativo e newsletter validada.
- **Autenticação** (`/entrar`, `/registar`) num fluxo único, com autofill da conta demo, seleção de plano e validações.
- **Páginas legais** (`/legal/termos`, `/legal/privacidade`, `/legal/royalties`) com tabela de tarifas por loja.
- **404** dedicada e navegação com scroll-to-top.

### Painel do artista (`/painel`)
| Rota | O que faz |
| --- | --- |
| `/painel` | KPIs, streams a 12 meses, top faixas, atividade recente, alerta de «ação necessária», rascunho por concluir e plano. |
| `/painel/lancamentos` | Catálogo com separadores por estado (contagem automática), pesquisa sincronizada com `?q=`, modal de detalhes, correção e eliminação com confirmação. |
| `/painel/novo-lancamento` | Assistente em 4 passos (detalhes → faixas & capa → lojas → revisão) com validação por passo, upload de capa com redimensionamento automático para 1000×1000, capas sugeridas, UPC gerado no envio e **retoma de rascunhos** (`?rascunho=…`). Também serve para **corrigir lançamentos em «ação necessária»**. |
| `/painel/estatisticas` | KPIs agregados, alternância 30 dias/12 meses, streams por loja (donut), países, top faixas e **exportação CSV**. |
| `/painel/rendimentos` | Saldo disponível, pendente e total ganho, gráfico de receita, métodos de pagamento e **pedido de levantamento** (mínimo $50, validações de saldo) com histórico. |
| `/painel/perfil` | Identidade do artista, upload de fotografia com recorte quadrado, biografia com contador, links oficiais e cartão de artista verificado. |
| `/painel/definicoes` | Moeda **USD ⇄ AOA** (taxa 1 USD = 915 Kz), idioma, notificações, alteração de palavra-passe, gestão de plano e reposição da demonstração. |

### Experiência
- Layout responsivo com sidebar fixa no desktop e gaveta no telemóvel.
- Pesquisa global no cabeçalho (`Ctrl/⌘ + K`), chip de saldo, notificações com badge e menu de conta.
- Sistema de *toasts*, modais acessíveis (`role="dialog"`, fecho com `Esc`), estados de foco e `aria-label` em ações por ícone.
- Tema escuro com paleta dourada, animações suaves e gráficos Recharts.

---

## Arquitetura

```
src/
├── App.tsx                 # rotas (público, legais, painel, 404)
├── main.tsx                # bootstrap + BrowserRouter
├── types.ts                # tipos de domínio
├── context/AppContext.tsx  # estado global + persistência (localStorage)
├── data/seed.ts            # dados de demonstração (lançamentos, pagamentos, séries)
├── lib/format.ts           # formatação pt-AO (números, USD/AOA, datas) e utilitários
├── components/             # Logo, Modal, StatusBadge, Toasts, DashboardLayout
└── pages/
    ├── Landing.tsx, Auth.tsx, Legal.tsx
    └── dashboard/          # Overview, Releases, NewRelease, Analytics,
                            # Earnings, Profile, Settings
```

**Estado**: `AppContext` centraliza autenticação (demo + contas registadas), CRUD de lançamentos, levantamentos, moeda, notificações, perfil e reposição da demonstração. Tudo persiste em `localStorage` com prefixo `sonoradrop.*`.

**Regras de negócio simuladas**: levantamento mínimo de $50; royalties no plano Profissional a 0%; envio de lançamento gera UPC e passa o estado para *Em processamento*; lançamento com «ação necessária» pode ser corrigido no assistente e reenviado.

---

## Notas

- Os dados são fictícios e vivem apenas no navegador — não há backend.
- As capas, fotografia e imagens em `public/assets/` foram geradas para esta demonstração.
- `npm run build` corre `tsc --noEmit` antes do Vite, pelo que erros de tipos bloqueiam o build.
