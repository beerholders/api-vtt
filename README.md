# Web VTT API

This repository is the API that supports the [Web VTT](https://github.com/beerholders/web-vtt). For reference on how to execute the devloop, check the section below.

## Extras

- Gestão de usuários:
  1. [ ] (4%) Receber e-mail ao se cadastrar
  1. [ ] (3%) Fluxo de "esqueci minha senha"
  1. [ ] (5%) Integração com autenticação por 3ºs
  1. [ ] (3-7%) Possibilidade de alterar dados do perfil
  1. [ ] (5%) Autenticação de 2 fatores
- Engenharia de Software:
  1. [ ] (1-10%) Testes automatizados
  1. [x] (2-6%) Processo de _build_ para _assets_ do _front-end_:
     - [x] Minimizar arquivos CSS e JS
     - [x] Eliminação de código morto JS
     - [ ] Otimização de imagens
     - [x] Pré-processamento de CSS e JS
  1. [x] (5%) Integração contínua durante o desenvolvimento (_build_ + teste + _deploy_) -> Branch preview por PR no Frontend com proxy no Backend (esse tem deploy só na main) para otimização de custos 💰
  1. [x] (5%) Uso de _containers_ (eg Docker) para isolar ambientes e torná-los facilmente reprodutíveis
  1. [x] (5%) Descrição histórias de usuário [Parcial 😅]
     - [x] (+5%) Uso de _pull requests_ (PRs) para cada história
       - [x] (+5%) _Code review_ de todos os PRs
- Integração:
  1. [x] (5-10%) APIs de terceiros para fornecer dados do usuário (eg, biblioteca de jogos no Steam, músicas do usuário no Spotify)
  1. [ ] (3-7%) APIs "cosméticas" (eg, previsão do tempo para fazer algum efeitinho)
  1. [ ] (6%) APIs de serviço de hospedagem (eg, da AWS para armazenar fotos enviadas por usuários)
- Inteligência:
  1. [ ] (5-13%) Alguma inteligência além de um CRUD. Exemplos:
     - Algoritmos de recuperação da informação
     - Algoritmos de aprendizado de máquina
     - Algoritmos de alocação de recursos/tarefas, _match-making_, problema da mochila, determinação de caminhos...
     - Algoritmos de computação gráfica _off-line_ (eg, _ray tracing_)
- _Back-end_:
  1. [ ] (4%) Agendamento de funções do _back-end_ para executar de tempos em tempos (eg, processar o ataque do reino de um jogador a outro)
  1. [ ] (5-9%) Uso de uma fila para execução de tarefas com duração maior
  1. [ ] (6%) Propagação de atualização do _back-end_ para o _front-end_ (eg, usando Web Sockets diretamente ou alguns bancos NoSQL reativos)
  1. [x] (3%) Camada de dados RESTful
  1. [ ] (6%) Camada de dados GraphQL
  1. [ ] (5%) _Upload_ de arquivos
- _Front-end_:
  1. [ ] (7%) Todas as páginas _responsive_
  1. [ ] (3%) Modo escuro
  1. [x] (2-5%) Animações, transições e efeitos visuais diversos (onde fizer sentido)
     - [ ] (2%) Modo com menos animações
  1. [ ] (2%) Modo de impressão (se fizer sentido)
  1. [x] (5%) Organização em componentes
  1. [ ] (3-10%) Uso de APIs do HTML5 (vide seminário)
  1. [x] (2-10%) Interatividade para melhorar a experiência de uso (eg, a [Ovelhita][ovelhas] na página das ovelhas)

## Getting started

### 1. Build Docker

```
docker-compose build
```

### 2. Init the DB

```
docker-compose run --rm server init_db
```

### 3. Start the REST API server

```
docker-compose up
```

The server is now running on `http://localhost:3001`. You can now the API requests, e.g. [`http://localhost:3001/users`](http://localhost:3001/users).

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`
- `/users`: Fetch all users
### `POST`

- `/signup`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (optional): The name of the user

## Evolving the app

Evolving the application typically requires two steps:

1. Migrate your database using Prisma Migrate
1. Update your application code

For the following example scenario, assume you want to add a "profile" feature to the app where users can create a profile and write a short bio about themselves.

### 1. Migrate your database using Prisma Migrate

The first step is to add a new table, e.g. called `Profile`, to the database. You can do this by adding a new model to your [Prisma schema file](./prisma/schema.prisma) file and then running a migration afterwards:

```diff
// ./prisma/schema.prisma

model User {
  id      Int      @default(autoincrement()) @id
  name    String?
  email   String   @unique
  posts   Post[]
+ profile Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

+model Profile {
+  id     Int     @default(autoincrement()) @id
+  bio    String?
+  user   User    @relation(fields: [userId], references: [id])
+  userId Int     @unique
+}
```

Once you've updated your data model, you can execute the changes against your database with the following command:

```
docker-compose run --rm server migrate dev --name add-profile
```

This adds another migration to the `prisma/migrations` directory and creates the new `Profile` table in the database.

### 2. Update your application code

You can now use your `PrismaClient` instance to perform operations against the new `Profile` table. Those operations can be used to implement API endpoints in the REST API.

#### 2.1 Add the API endpoint to your app

Update your `index.ts` file by adding a new endpoint to your API:

```ts
app.post('/user/:id/profile', async (req, res) => {
  const { id } = req.params
  const { bio } = req.body

  const profile = await prisma.profile.create({
    data: {
      bio,
      user: {
        connect: {
          id: Number(id)
        }
      }
    }
  })

  res.json(profile)
})
```

#### 2.2 Testing out your new endpoint

Restart your application server and test out your new endpoint.

##### `POST`

- `/user/:id/profile`: Create a new profile based on the user id
  - Body:
    - `bio: String` : The bio of the user


<details><summary>Expand to view more sample Prisma Client queries on <code>Profile</code></summary>

Here are some more sample Prisma Client queries on the new <code>Profile</code> model:

##### Create a new profile for an existing user

```ts
const profile = await prisma.profile.create({
  data: {
    bio: 'Hello World',
    user: {
      connect: { email: 'alice@prisma.io' },
    },
  },
})
```

##### Create a new user with a new profile

```ts
const user = await prisma.user.create({
  data: {
    email: 'john@prisma.io',
    name: 'John',
    profile: {
      create: {
        bio: 'Hello World',
      },
    },
  },
})
```

##### Update the profile of an existing user

```ts
const userWithUpdatedProfile = await prisma.user.update({
  where: { email: 'alice@prisma.io' },
  data: {
    profile: {
      update: {
        bio: 'Hello Friends',
      },
    },
  },
})
```

</details>

## Next steps

- Check out the [Prisma docs](https://www.prisma.io/docs)
- Share your feedback in the [`prisma2`](https://prisma.slack.com/messages/CKQTGR6T0/) channel on the [Prisma Slack](https://slack.prisma.io/)
- Create issues and ask questions on [GitHub](https://github.com/prisma/prisma/)
- Watch our biweekly "What's new in Prisma" livestreams on [Youtube](https://www.youtube.com/channel/UCptAHlN1gdwD89tFM3ENb6w)
