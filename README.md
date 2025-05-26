
# Rick and Morty - Angular App

Aplicação web desenvolvida em **Angular 19 (standalone components)** que consome a **API pública do Rick and Morty** para exibir, criar, editar e excluir personagens, utilizando **Bootstrap** e **SCSS** para estilização.

Este projeto foi desenvolvido com foco na prática e demonstração de habilidades com **Angular moderno**, **componentização**, **gestão de estado**, **rotas** e integração com **APIs REST**.

---

## Tecnologias utilizadas

- Angular 19 (standalone components)
- TypeScript
- RxJS
- Bootstrap 5
- SCSS (SASS)
- Vite

---

## Como rodar o projeto localmente

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/rick-and-morty.git
cd rick-and-morty
```

2. **Instale as dependências:**

```bash
npm install
```

ou

```bash
yarn
```

3. **Execute o servidor de desenvolvimento:**

```bash
ng serve
```

4. **Acesse:**

```
http://localhost:4200/
```

---

## Scripts úteis

| Comando      | Descrição                                      |
| -------------| ---------------------------------------------- |
| `ng serve`   | Inicia o servidor de desenvolvimento           |
| `ng build`   | Realiza o build otimizado do projeto           |
| `ng test`    | Executa os testes unitários com Karma          |
| `ng e2e`     | Executa os testes end-to-end (ajuste necessário)|

---

## Estrutura do projeto

```
src/
 ├── app/
 │    ├── components/
 │    │    ├── about/              # Página sobre
 │    │    ├── character-card/     # Exibição de personagens em cards
 │    │    ├── character-form/     # Formulário de criação e edição
 │    │    ├── character-list/     # Listagem de personagens
 │    │    └── character-modal/    # Modal de visualização de personagem
 │    │
 │    ├── models/
 │    │    ├── character.enums.ts  # Enumerações para personagens
 │    │    └── character.model.ts  # Modelo de dados do personagem
 │    │
 │    ├── services/
 │    │    ├── character-modal.service.ts        # Lógica do modal
 │    │    ├── character-store.service.ts        # Gerenciamento de estado dos personagens
 │    │    └── rick-and-morty.service.ts         # Comunicação com a API Rick and Morty
 │    │
 │    ├── shared/
 │    │    ├── alert/            # Componentes de alerta
 │    │    └── confirm-modal/    # Componentes de confirmação
 │    │
 │    ├── app.component.*        # Arquivo raiz da aplicação
 │    ├── app.config.*           # Configurações do Angular
 │    └── app.routes.*           # Configuração das rotas
 │
 ├── styles/
 │    └── _variables.scss        # Variáveis globais de estilo
 │
 └── public/
      ├── default-character.jpeg # Imagem padrão de personagem
      ├── favicon.ico
      └── logo.svg
```

---

## Funcionalidades implementadas

- Listagem paginada de personagens.
- Visualização de detalhes em modal.
- Edição e criação de personagens via formulário.
- Exclusão com confirmação.
- Feedbacks com toasts de sucesso e erro.
- Responsividade com Bootstrap.

---

## Testes

O projeto utiliza **Karma** e **Jasmine** para testes unitários. Para rodar:

```bash
ng test
```

Para testes end-to-end, configure a ferramenta de sua preferência (ex.: Cypress, Playwright).

---

## Referências

- [API Rick and Morty](https://rickandmortyapi.com/)
- [Documentação Angular](https://angular.dev/)
- [Bootstrap](https://getbootstrap.com/)

---

## Autor

Daniel Luz  
[LinkedIn](https://www.linkedin.com/in/seu-perfil)  
[GitHub](https://github.com/seu-usuario)

---

## Objetivo

Este projeto foi desenvolvido com o objetivo de consolidar conhecimentos e demonstrar habilidades práticas em **desenvolvimento frontend**, com foco em **Angular**, **integração de APIs** e **boas práticas de componentização e arquitetura**.

---
