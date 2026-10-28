# MangáSensei — front-end

Interface React, TypeScript e Vite para cadastro/login, exploração de mangás, coleção pessoal e perfil.

## Estrutura

- `src/app`: roteamento e proteção de páginas autenticadas.
- `src/features`: telas e componentes organizados por domínio (`auth`, `collection`, `dashboard`, `manga`, `profile`).
- `src/components`: elementos compartilhados pela aplicação.
- `src/service`: chamadas HTTP, tipos de API, autenticação/sessão, mangás, coleções e perfil.
- `src/styles`: estilos globais e layout comum.
- `src/assets`: imagens e identidade visual.

## Desenvolvimento

Configure `VITE_API_URL` com a URL do back-end (veja `.env.example`), instale as dependências e rode `npm run dev`. O padrão local é `http://localhost:8080`.

`npm run build` executa a verificação TypeScript e gera os arquivos de produção em `dist/`.

