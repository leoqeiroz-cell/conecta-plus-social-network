# Conecta+

Conecta+ e uma rede social academica e comunitaria para aproximar estudantes, monitores e liderancas locais em torno de duvidas, projetos, oportunidades, materiais e grupos de estudo.

O projeto foi desenvolvido como uma aplicacao full stack com Vue 3, TypeScript, PrimeVue, Tailwind CSS, Pinia e Vue Router no frontend; Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod, JWT e bcrypt no backend.

## Proposta

Muitas comunidades academicas perdem conhecimento em conversas dispersas, grupos temporarios e materiais sem organizacao. O Conecta+ centraliza esse fluxo em um produto simples: feed por categorias, perfis, ranking de colaboracao, comentarios, curtidas e grupos de estudo.

## Funcionalidades

- Cadastro, login e sessao protegida com JWT.
- Perfil de usuario com curso, bio, avatar e pontuacao.
- Edicao de perfil com upload de foto ou escolha de avatares prontos.
- Feed de publicacoes com busca, filtro por categoria e tags.
- CRUD de posts para autores autenticados, com moderacao por administrador.
- Comentarios editaveis/removiveis e curtidas com alternancia entre curtir e descurtir.
- Tags iniciais: `#estudos`, `#projetos`, `#emprego` e `#duvidas`.
- Modo comunidade com grupos de estudo e participacao.
- Painel administrativo com indicadores, posts recentes e usuarios ativos.
- Dark mode persistente.
- Pagina "Sobre o projeto e impacto social".
- Swagger/OpenAPI em `/docs`.
- Seed de dados para demonstracao.
- Docker Compose para frontend, backend e banco.

## Arquitetura

![Visao do feed](docs/screenshots/feed-preview.svg)

```mermaid
flowchart LR
  User[Usuario] --> Web[Vue 3 + PrimeVue]
  Web --> API[Express API]
  API --> Auth[JWT + bcrypt]
  API --> Validation[Zod Schemas]
  API --> Services[Services]
  Services --> Repositories[Repositories]
  Repositories --> Prisma[Prisma ORM]
  Prisma --> DB[(PostgreSQL)]
  API --> Docs[Swagger/OpenAPI]
```

## Organizacao

```text
apps/
  api/
    prisma/              schema e seed
    src/
      controllers/       entrada HTTP
      services/          regras de negocio
      repositories/      acesso a dados
      routes/            rotas Express
      schemas/           validacoes Zod
      middlewares/       autenticacao e erros
      dto/               tipos de transferencia
  web/
    src/
      components/        layout e componentes reutilizaveis
      pages/             telas principais
      router/            rotas Vue
      services/          cliente HTTP
      stores/            estado Pinia
```

## Como executar localmente

1. Instale as dependencias:

```bash
npm install
```

2. Copie as variaveis de ambiente:

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env
```

3. Suba o PostgreSQL:

```bash
docker compose up -d postgres
```

4. Gere o cliente Prisma e rode as migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. Popule a base de demonstracao:

```bash
npm run seed
```

6. Execute a aplicacao:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:3333/api`

Swagger: `http://localhost:3333/docs`

## Docker completo

```bash
docker compose up --build
```

Frontend: `http://localhost:8081`

API: `http://localhost:3333/api`

## Acesso de demonstracao

Administrador:

- E-mail: `admin@conectamais.edu`
- Senha: `Conecta@123`

Usuario:

- E-mail: `ana@conectamais.edu`
- Senha: `Conecta@123`

## Endpoints principais

| Metodo | Rota | Descricao |
| --- | --- | --- |
| POST | `/api/auth/register` | Cria conta |
| POST | `/api/auth/login` | Autentica usuario |
| GET | `/api/auth/me` | Retorna usuario autenticado |
| GET | `/api/posts` | Lista feed com filtros |
| POST | `/api/posts` | Cria publicacao |
| PUT | `/api/posts/:id` | Atualiza publicacao |
| DELETE | `/api/posts/:id` | Remove publicacao |
| POST | `/api/posts/:id/like` | Alterna curtida |
| POST | `/api/posts/:id/comments` | Adiciona comentario |
| PUT | `/api/posts/comments/:commentId` | Atualiza comentario |
| DELETE | `/api/posts/comments/:commentId` | Remove comentario |
| GET | `/api/users/search` | Busca usuarios |
| PUT | `/api/users/me` | Atualiza perfil, bio e avatar |
| GET | `/api/groups` | Lista grupos |
| POST | `/api/groups/:id/join` | Entra ou sai de um grupo |
| GET | `/api/admin/metrics` | Indicadores administrativos |

## Inovacoes implementadas

![Painel administrativo](docs/screenshots/admin-preview.svg)

- Ranking de colaboracao calculado por publicacoes, comentarios e interacoes.
- Grupos de estudo como camada comunitaria alem do feed.
- Feed com filtros por categoria, busca textual e tags academicas.
- Conteudo gerenciavel pelo proprio usuario, incluindo edicao, exclusao e moderacao.
- Perfil personalizavel com avatar gerado ou foto enviada pelo estudante.
- Painel administrativo para leitura rapida de saude da comunidade.
- UX com dark mode e interface responsiva voltada para apresentacao de hackathon.

## Pitch

Link do pitch: [video_pitch_final_com_audio.mp4](https://github.com/leoqeiroz-cell/conecta-plus-social-network/raw/main/docs/pitch/video_pitch_final_com_audio.mp4)

O video apresenta problema, solucao, demonstracao do produto em funcionamento, recursos de colaboracao, painel administrativo, documentacao da API e impacto social academico.

Sugestao de roteiro:

1. Problema: conhecimento academico se perde em canais dispersos.
2. Solucao: Conecta+ organiza duvidas, projetos, materiais e grupos.
3. Demonstracao: login, feed, post, comentario, curtida, grupos e ranking.
4. Impacto: mais colaboracao, acolhimento e aprendizagem entre estudantes.

## Qualidade

```bash
npm run lint
npm run test
npm run build
```

O projeto prioriza arquitetura em camadas, validacao de entrada, separacao de responsabilidades, documentacao de API e experiencia de uso consistente.
