# CoffeMap - App Mobile

Este é um aplicativo móvel desenvolvido em **React Native** que permite localizar cafeterias próximas à sua localização atual. 
A aplicação utiliza **Firebase** como backend e **Firestore** como banco de dados não relacional para armazenar e gerenciar os dados das cafeterias.

## Funcionalidades

- **Localização em tempo real**: Detecta a posição atual do usuário e encontra cafeterias próximas.
- **Listagem de Cafeterias**: Exibe uma lista de cafeterias com nome, endereço e classificação.
- **Visualização no Mapa**: Mostra as cafeterias localizadas no mapa com base na sua localização.
- **Pesquisa**: Permite filtrar cafeterias por nome ou outros critérios.

## Tecnologias Utilizadas

- **Frontend**:
  - **React Native**: Framework para criação de aplicativos móveis nativos.
  - **Expo** (opcional): Para facilitar o desenvolvimento e o build do aplicativo.
  - **React Navigation**: Biblioteca para navegação entre telas.
  - **React Native Maps**: Para a visualização das cafeterias em um mapa interativo.
  - **Axios / Fetch API**: Para fazer requisições HTTP ao backend Firebase.

- **Backend**:
  - **Firebase Functions**: Funções serverless para gerenciar a lógica de backend.
  - **Firebase Authentication**: Para autenticação de usuários.
  - **Firestore**: Banco de dados NoSQL para armazenar informações sobre as cafeterias.

## Como Rodar o Projeto

### Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado. Você pode baixar a versão mais recente do [Node.js](https://nodejs.org/).
- **Expo CLI**: Se estiver utilizando o Expo, instale a ferramenta CLI globalmente:
  ```bash
  npm install -g expo-cli

Passo a Passo
1. Clonar o Repositório

Clone o repositório para sua máquina local:

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio

2. Instalar Dependências

Instale as dependências do projeto:
npm install

Ou, se estiver utilizando Expo:
expo install


Claro! Vou refazer o README.md sem o diagrama de arquitetura e sem misturar os assuntos. Aqui está um exemplo mais direto e conciso:

# Localizador de Cafeterias - App Mobile

Este é um aplicativo móvel desenvolvido em **React Native** que permite localizar cafeterias próximas à sua localização atual. A aplicação utiliza **Firebase** como backend e **Firestore** como banco de dados não relacional para armazenar e gerenciar os dados das cafeterias.

## Funcionalidades

- **Localização em tempo real**: Detecta a posição atual do usuário e encontra cafeterias próximas.
- **Listagem de Cafeterias**: Exibe uma lista de cafeterias com nome, endereço e classificação.
- **Visualização no Mapa**: Mostra as cafeterias localizadas no mapa com base na sua localização.
- **Pesquisa**: Permite filtrar cafeterias por nome ou outros critérios.

## Tecnologias Utilizadas

- **Frontend**:
  - **React Native**: Framework para criação de aplicativos móveis nativos.
  - **Expo** (opcional): Para facilitar o desenvolvimento e o build do aplicativo.
  - **React Navigation**: Biblioteca para navegação entre telas.
  - **React Native Maps**: Para a visualização das cafeterias em um mapa interativo.
  - **Axios / Fetch API**: Para fazer requisições HTTP ao backend Firebase.

- **Backend**:
  - **Firebase Functions**: Funções serverless para gerenciar a lógica de backend.
  - **Firebase Authentication**: Para autenticação de usuários.
  - **Firestore**: Banco de dados NoSQL para armazenar informações sobre as cafeterias.

## Como Rodar o Projeto

### Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado. Você pode baixar a versão mais recente do [Node.js](https://nodejs.org/).
- **Expo CLI**: Se estiver utilizando o Expo, instale a ferramenta CLI globalmente:
  ```bash
  npm install -g expo-cli
Conta no Firebase: Crie uma conta no Firebase e configure um projeto com Firestore.
Passo a Passo
1. Clonar o Repositório

Clone o repositório para sua máquina local:

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
2. Instalar Dependências

Instale as dependências do projeto:

npm install
Ou, se estiver utilizando Expo:

expo install
3. Configuração do Firebase

No Firebase Console:

Crie um novo projeto.
Ative o Firestore e configure as regras de segurança.
Baixe as credenciais do Firebase (arquivo google-services.json para Android ou GoogleService-Info.plist para iOS) e adicione-os ao seu projeto.
4. Rodar o App

Para rodar o app, execute:
npm start

Ou, se estiver utilizando Expo:
expo start

Isso abrirá o aplicativo no navegador e fornecerá um código QR para você escanear com o app Expo Go no seu celular.

5. Testar Funcionalidades

Ao abrir o app, ele:

Localiza sua posição atual.
Exibe uma lista de cafeterias próximas, com base na localização.
Mostra as cafeterias no mapa.
Contribuindo

Contribuições são bem-vindas! Para contribuir:

Faça um fork do repositório.
Crie uma nova branch (git checkout -b feature-nome-da-feature).
Faça suas alterações e commit (git commit -am 'Adiciona nova feature').
Push para a branch (git push origin feature-nome-da-feature).
Abra um pull request.
Licença

Este projeto está licenciado sob a MIT License.

Autores

Pablo Oliveira - Desenvolvedor Principal







  
