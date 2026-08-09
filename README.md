# Unifor Connect - Marketplace Universitário

Uma plataforma de marketplace voltada para o ambiente universitário (Student Marketplace). O sistema permite a publicação, busca e negociação de itens entre estudantes, promovendo economia circular dentro das universidades. O projeto foi desenvolvido empregando conceitos de Clean Architecture, Domain-Driven Design (DDD) e funcionalidades modernas como Progressive Web App (PWA).

## 🚀 Links em Produção

- **Frontend (Aplicação Web):** [https://unifor-connect-six.vercel.app/](https://unifor-connect-six.vercel.app/)
- **Backend (API):** [https://desafio-vortex.onrender.com](https://desafio-vortex.onrender.com)

---

## 🛠️ Tecnologias e Frameworks

O projeto é dividido em duas frentes: **Backend (API)** e **Frontend (Web)**, utilizando as seguintes tecnologias:

### Backend

- **Ambiente & Linguagem:** Node.js, TypeScript
- **Framework Web:** Express 5
- **Banco de Dados:** MongoDB (com `mongoose`) para armazenamento principal
- **Cache:** Redis (com `ioredis`) para otimização de consultas
- **Validação:** Zod
- **Autenticação:** JSON Web Token (JWT) e `bcryptjs`
- **Arquitetura:** Clean Architecture + Domain-Driven Design (DDD)

### Frontend

- **Framework / Biblioteca:** React 19, TypeScript
- **Build Tool:** Vite
- **Roteamento:** React Router DOM v7
- **Gerenciamento de Formulários:** React Hook Form + Zod (Resolver)
- **Requisições HTTP:** Axios
- **PWA:** Vite Plugin PWA (suporte offline)

---

## 💻 Como Rodar o Projeto Localmente

O projeto está totalmente configurado para rodar de forma unificada através do Docker Compose, inicializando toda a infraestrutura (Frontend, API, MongoDB e Redis) de uma só vez.

### Pré-requisitos

- **Docker** e **Docker Compose** instalados em sua máquina.
- **Node.js** (Apenas para rodar os scripts utilitários na raiz do projeto).

### Passo a Passo

1. **Configure as variáveis de ambiente:**
   Na raiz do projeto, execute o script utilitário abaixo para criar automaticamente os arquivos `.env` baseados nos respectivos `.env.example`:

   ```bash
   npm run setup:env
   ```

   _(Caso prefira fazer manualmente, basta copiar o arquivo `.env.example` e renomear para `.env` dentro das pastas `api` e `web`)._

2. **Suba todos os serviços:**
   Ainda na raiz do projeto, execute o comando:
   ```bash
   npm run docker:up
   ```

Isso irá construir as imagens e iniciar os seguintes containers em background:

- **Frontend (Web):** Acessível localmente pelo seu navegador em `http://localhost:5173`
- **Backend (API):** Executa na rede privada do Docker (não exposto localmente) sendo acessado diretamente pelo Frontend via proxy/rede interna.
- **Bancos de Dados:** MongoDB e Redis (Também na rede privada, transparentes e exclusivos para a API).

_Para parar a execução e remover os containers, basta rodar:_

```bash
npm run docker:down
```

---

## 📖 Diário de Bordo de IA

Este diário de bordo documenta o processo, as ferramentas, as estratégias de engenharia de prompts e as reflexões críticas sobre o uso de Inteligência Artificial durante o desenvolvimento do projeto.

### 1. Ferramentas Utilizadas

Durante o ciclo de desenvolvimento, utilizei a IDE **Antigravity** orquestrando diferentes modelos de linguagem de ponta:

- **Opus** (para planejamento complexo e quebra de tarefas)
- **Sonnet 4.6** (para execução de código e tarefas intermediárias)
- **Gemini 3.1 Pro** (para execução de código e suporte geral)

### 2. Estratégia de Engenharia de Prompts

Para garantir que a IA produzisse código de alta qualidade e mantivesse o alinhamento com os requisitos do sistema, adotei uma estratégia rigorosa baseada em **System Prompts** e **Divisão e Conquista**:

1. **Uso de System Prompts Estruturados:** Todas as interações com a IA começavam com um prompt robusto contendo quatro pilares essenciais:
   - **Role:** O papel assumido pela IA (ex: Desenvolvedor Especialista Sênior).
   - **Context:** O contexto detalhado do projeto e da situação atual.
   - **Goal:** O objetivo final e claro que a IA precisava atingir.
   - **Constraints:** Regras estritas e limitações (ex: padrões de código, não usar versões depreciadas).
2. **Criação de Especificações (Specs):** Baseado no contexto, eu escrevia um documento detalhado de especificação (ex: `items-spec.md` e `order-spec`).
3. **Quebra de Tarefas (Modelo mais inteligente):** Eu fornecia essa especificação para um modelo de maior capacidade cognitiva (como o Opus) com a instrução de quebrar a funcionalidade completa em tarefas menores e gerenciáveis. Cada tarefa gerada ganhava seu próprio arquivo `.md` com uma explicação clara do que deveria ser feito.
4. **Planejamento de Execução (Contextos Isolados):** Para cada tarefa individual, eu abria uma **nova janela de contexto** (nova sessão). Eu pedia novamente para um modelo avançado criar um plano de execução passo a passo focado apenas naquela tarefa.
5. **Execução do Código (Modelos menores):** Com o plano de execução pronto, eu delegava a escrita do código para modelos mais rápidos e eficientes em execução, como o Sonnet 4.6 ou o Gemini 3.1 Pro.

### 3. Compartilhamento de Histórico

Minha estratégia foi guiada principalmente por especificações base, que serviram como documentação "fonte da verdade" para as IAs e foram utilizadas nos diferentes contextos. Abaixo estão os conteúdos completos de duas das principais _specs_ utilizadas no projeto:

#### Especificação da Landing Page (web/landingpage-spec.md)

```markdown
# Context

Você fara uma landing page para o UNIFOR Circular, verifique as rotas que precisar na api. por enquanto vai ser somente a landing page, futuramente vamos fazer o resto das funcionalidades do aplicativo, como login e cadastro de itens

# RF

- Uma página de apresentação do projeto que explique a proposta de economia circular no campus
- exiba estatísticas simuladas do sistema e contenha uma vitrine pública listando os últimos itens anunciados
- Deve conter botões claros de chamada para ação (CTA) convidando o usuário a anunciar ou buscar itens.
- um Service Worker que permita que a aplicação seja "instalada" na tela inicial de um dispositivo mobile.

# RNF

- use a skill copywriting para os CTAs
- use a skill frontend design para a landing page
- Faça Estratégias de cache no Service Worker para funcionamento ou visualização offline de dados já carregados
- Deve ser responsivo

# Arquitecture

- feature based
- componentes reutilizaveis

# PWA

- Use um PWA com Service Worker
```

#### Especificação de Itens (api/src/modules/items/items-spec.md)

````markdown
# RF

- Deve ser possível listar um único, listar todos, deletar, criar e atualizar itens.
- Autenticação (criar, deletar e atualizar) e Ownership (deletar e atualizar)

# RNF

- Deve se utilizar o banco de dados MongoDB
- Deve ser usado os Custom Errors existentes
- Manipule o Price usando o value object existente
- Faça validação dos dados de entrada com Zod
- Nunca use ANY, sempre tipe a request
- Itens com status reserved e selled não devem ser exibidos no list all

## ItemModel

```json
{
  "name": "Item Teste",
  "description": "Descrição do Item Teste",
  "price": 10.99,
  "type": "sale", // crie um Enum de sale ou donation
  "status": "available | reserved | selled",
  "owner": "ID do Usuário"
}
```

# EndPoints

## Item

- `GET /item` - List all items
- `GET /item/:id` - Get item by id
- `POST /item` - Create item
- `PUT /item/:id` - Update item
- `DELETE /item/:id` - Delete item

# Arquitetura

- Clean Architecture
- SOLID
- DDD (com classes), crie as entities com create static, metodos de manipulação e get e setters
````

### 4. Reflexão Crítica e Intervenções Manuais

Embora a IA tenha acelerado muito o desenvolvimento, a revisão crítica e a intervenção humana foram essenciais. Abaixo estão algumas situações em que a IA cometeu erros ou tomou decisões arquiteturais equivocadas que precisaram ser corrigidas:

1. **Uso de Padrões e Versões Depreciadas (Express 4 vs Express 5):**
   - **O Problema:** A IA estava gerando código utilizando padrões do Express 4. Em todos os _controllers_, ela envolvia o código da rota em um bloco `try/catch` e chamava `next(error)` para direcionar as exceções ao middleware de _error handling_.
   - **A Intervenção:** Como nossa stack utiliza o **Express 5**, esse _boilerplate_ não é mais necessário. O Express 5 lida nativamente com promessas rejeitadas em rotas assíncronas. Tive que intervir, instruindo e corrigindo o código para remover os blocos `try/catch` desnecessários.

2. **Lógica de Cache Desnecessária no Service Worker:**
   - **O Problema:** Ao criar o _service worker_, a IA incluiu arbitrariamente uma camada de cache utilizando o `localStorage` do navegador. Isso gerou um comportamento indesejado, pois a aplicação começou a exibir dados desatualizados na tela.
   - **A Intervenção:** O cache manual não tinha necessidade, visto que a própria infraestrutura do _service worker_ e das bibliotecas de requisição já cuidam do gerenciamento de cache e estado adequadamente. Tive que remover o código do `localStorage` para restaurar o comportamento dinâmico e correto da aplicação.
