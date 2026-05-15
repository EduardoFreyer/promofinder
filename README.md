# PromoFinder

Comparador de precos que agrega ofertas do **Mercado Livre**, **Buscape** e **Zoom** em uma unica interface.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

## Funcionalidades

- **Busca unificada** — pesquise um produto e veja resultados de tres marketplaces ao mesmo tempo
- **Filtro por fonte** — filtre ofertas por Mercado Livre, Buscape ou Zoom
- **Historico de precos** — grafico interativo com evolucao de preco ao longo do tempo (min, media, max)
- **Buscas recentes** — acesso rapido as ultimas pesquisas (salvas no localStorage)
- **Skeleton loading** — feedback visual enquanto os resultados carregam
- **Dark theme** — interface escura com design system baseado em variaveis CSS

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 |
| Bundler | Vite 8 |
| Graficos | Recharts |
| Icones | Lucide React |
| Linter | ESLint |

## Pre-requisitos

- [Node.js](https://nodejs.org/) >= 18
- Backend ([api-promofinder](https://github.com/EduardoFreyer/api-promofinder)) rodando em `http://localhost:8000`

## Instalacao

```bash
git clone https://github.com/EduardoFreyer/promofinder.git
cd promofinder
npm install
```

## Uso

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

> O backend precisa estar rodando para as buscas funcionarem. Veja o repositorio [api-promofinder](https://github.com/EduardoFreyer/api-promofinder) para instrucoes.

## Scripts

| Comando | Descricao |
|---------|----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de producao em `dist/` |
| `npm run preview` | Serve o build de producao localmente |
| `npm run lint` | Executa o ESLint |

## Estrutura do Projeto

```
src/
├── App.jsx              # Componente principal com busca e filtros
├── main.jsx             # Entry point
├── index.css            # Design system e estilos globais
├── App.css              # Estilos adicionais
├── components/
│   ├── SearchBar.jsx    # Barra de busca
│   ├── ProductCard.jsx  # Card de produto com preco e detalhes
│   ├── PriceChart.jsx   # Modal com grafico de historico de precos
│   ├── RecentSearches.jsx # Chips de buscas recentes
│   └── SkeletonGrid.jsx # Loading skeleton para os cards
└── assets/
    └── hero.png
```

## API

O frontend consome dois endpoints do backend:

| Metodo | Endpoint | Descricao |
|--------|----------|----------|
| GET | `/api/search?q={termo}` | Busca produtos nos tres marketplaces |
| GET | `/api/history/{product_id}?months=6` | Retorna historico de precos do produto |

## License

MIT
