# 🚀 Study Flow

**Study Flow** é uma aplicação web para estudantes e profissionais que desejam manter o foco e organizar sessões de estudo usando a técnica Pomodoro.  
O app fornece controle de tempo, feedback visual, frases motivacionais e um ambiente bonito e intuitivo com visual tecnológico (Vanta.js + Tailwind).

---

## 🎯 Objetivo

Ajudar o usuário a manter a produtividade durante os estudos com:

- Criação de sessões de estudo personalizadas
- Definição de tempo de foco e número de ciclos Pomodoro
- Animação com confete e frases motivacionais ao concluir ciclos
- Sons para início e finalização de sessões
- Interface agradável, responsiva e com fundo animado (efeito Vanta.js)

---

## 🧠 Arquitetura

Utilizei o padrão **MVC (Model-View-Controller)** dentro do React:

- **Model**: `StudySession` define a estrutura dos dados de cada sessão
- **View**: Componentes React (`Home`, `Timer`, `SessionCard`, etc.)
- **Controller**: `SessionController` controla a lógica de criação, edição e ciclo das sessões

---

## ⚙️ Tecnologias e Stacks Usadas

| Tipo             | Tecnologia                         |
|------------------|------------------------------------|
| Frontend         | [React + TypeScript](https://reactjs.org/) |
| Estilização      | [Tailwind CSS](https://tailwindcss.com/) (v3.3.2) |
| Build tool       | [Vite](https://vitejs.dev/)        |
| Animações        | [Vanta.js (Net)](https://www.vantajs.com/) + [Three.js](https://threejs.org/) |
| Sons             | HTML5 `<audio>` embutido no React  |
| Confete 🎉       | [`react-confetti`](https://www.npmjs.com/package/react-confetti) |
| Hooks Utilitários| [`react-use`](https://github.com/streamich/react-use) |
| Gerenciamento    | Estado com `useState` e lógica separada com Controller |
| Versão de build  | `Vite + React 18 + TS + Tailwind 3.3.2` |

---

## 📸 Tela atual

![image](https://github.com/user-attachments/assets/0330bccc-3649-455a-b1ae-1dfc33c7c933)
![image](https://github.com/user-attachments/assets/785f3901-26ad-41f3-b629-8f62434d3fad)



---

## 🔜 Próximas Atualizações

- ✅ Página de boas-vindas com nome personalizado (✔️ implementado)
- 🔐 Login com Google (Firebase Authentication)
- 📊 Dashboard de desempenho semanal e mensal
- 📅 Histórico de sessões concluídas
- 🎯 Gráficos com tempo de foco real
- 🌓 Modo escuro (já default) + tema personalizável
- 📱 Instalação como PWA (progressive web app)

---

## 🧑‍💻 Desenvolvido por

> 💚 **Adriane Oliveira - [@adriolivdev](https://github.com/adriolivdev)**  
> Projeto pessoal criado como portfólio com foco em produtividade, foco e estudos.

---

## 📁 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/adriolivdev/study-flow.git

# 2. Instale as dependências
npm install

# 3. Rode o projeto
npm run dev
Acesse em: http://localhost:5173

Sinta-se livre para usar, estudar e contribuir!




