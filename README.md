# Sistema de Gestão de Planos de Telefonia

## Descrição do Projeto

O **Sistema de Gestão de Planos de Telefonia** é uma aplicação web desenvolvida para facilitar o gerenciamento de clientes e planos de telefonia. O sistema permite criar, editar, excluir e listar clientes e planos, bem como associar clientes a diferentes planos. Ele inclui um backend construído com **.NET Core 9** e um frontend desenvolvido em **Angular 19**.

## Funcionalidades

### **Gerenciamento de Planos**
- Cadastrar novos planos informando:
  - Nome do plano
  - Preço
  - Franquia de dados (em GB)
  - Minutos de ligação
- Editar e excluir planos existentes
- Listar todos os planos com busca e filtro por nome ou preço

### **Gerenciamento de Clientes**
- Cadastrar novos clientes informando:
  - Nome completo
  - CPF
  - Telefone
  - Email
- Editar e excluir clientes existentes
- Vincular planos ao cliente durante a criação e edição
- Listar todos os clientes com busca e filtro por nome ou CPF

### **Associação de Clientes a Planos**
- Associar um cliente a um ou mais planos
- Exibir a lista de planos associados a cada cliente

### **Dashboard (Opcional)**
- **Gráfico de pizza:** proporção de clientes associados a cada plano
- **Gráfico de barras:** número de clientes cadastrados por mês no último ano
- **Indicadores numéricos:**
  - Total de clientes cadastrados
  - Total de planos disponíveis
  - Média de planos associados por cliente
- **Filtros nos gráficos:**
  - Período de tempo (30 dias, 6 meses, 1 ano)
  - Tipo de plano (dados, minutos, etc.)
- **Paginação nas tabelas do frontend**

## Tecnologias Utilizadas

### **Backend (.NET Core)**
- API RESTful com **.NET Core 9**
- **Entity Framework Core** (Banco In-Memory)
- **Swagger** para documentação
- **CORS habilitado** para comunicação com o frontend

### **Frontend (Angular 19)**
- **Angular Material** para design
- **Serviços HTTP** para consumo da API
- **Gráficos e indicadores** para visualização de dados
- **Responsividade** para dispositivos móveis

## Configuração e Execução

### **1. Clonar o Repositório**
```sh
git clone https://https://github.com/GustavoPalmaFig/Gestao-Planos-Telefonia.git
```

### **2. Configurar e Executar o Backend**
1. Navegue até a pasta do backend:
   ```sh
   cd Gestão-Planos-Telefonia.backend
   ```
2. Instale as dependências do projeto:
   ```sh
   dotnet restore
   ```
3. Compile o projeto:
   ```sh
   dotnet build
   ```
4. Execute a API:
   ```sh
   dotnet run --urls "https://localhost:7020"
   ```
5. A API estará disponível em: [https://localhost:7020](https://localhost:7020)
6. A documentação via Swagger está disponível em: [https://localhost:7020/swagger](https://localhost:7020/swagger)

### **3. Configurar e Executar o Frontend**
1. Navegue até a pasta do frontend:
   ```sh
   cd gestao-planos-telefonia.frontend
   ```
2. Instale as dependências do Angular:
   ```sh
   npm install
   ```
3. Execute a aplicação:
   ```sh
   ng serve
   ```
4. O frontend estará disponível em: [http://localhost:4200](http://localhost:4200)

## Estrutura do Banco de Dados (Modelo UML)

### **Tabelas:**
#### **Cliente**
- `Id` (Guid)
- `Nome` (string)
- `CPF` (string)
- `Telefone` (string)
- `Email` (string)
- `CreatedAt` (DateTime)
- `UpdatedAt` (DateTime)

#### **Plano**
- `Id` (Guid)
- `Nome` (string)
- `Preço` (decimal)
- `FranquiaDados` (int - GB)
- `MinutosLigacao` (int)
- `CreatedAt` (DateTime)
- `UpdatedAt` (DateTime)

#### **ClientePlano** (Relacionamento N:N entre Cliente e Plano)
- `Id` (Guid)
- `ClienteId` (Guid, FK Cliente)
- `PlanoId` (Guid, FK Plano)
- `CreatedAt` (DateTime)

