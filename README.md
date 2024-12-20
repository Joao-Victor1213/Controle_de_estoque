# **Gerenciador de Estoque**  
Este projeto é uma aplicação CRUD desenvolvida para demonstrar minhas habilidades em criar sistemas completos, e utilização do firebase para login, gerenciamento de dados e permissões de usuário. A aplicação tem um design baseado em tons de azul e foi projetada para organizar e gerenciar estoques de maneira eficiente e prática.

---

## **Link de Visualização**  
Você pode visualizar o projeto hospedado na Vercel [aqui]('https://controle-de-estoque-seven.vercel.app/).

---

## **Descrição do Projeto**  
O Gerenciador de Estoque é uma aplicação web que permite a manipulação de estoques de forma eficiente, com permissões baseadas em diferentes tipos de usuários. O sistema é dividido em duas principais categorias de permissões: **Gestor** e **Funcionário**, cada uma com funcionalidades específicas para atender às necessidades de gerenciamento e operação.

---

## **Funcionalidades**

### **Para Gestores:**
- **Gerenciamento de Estoque**:
  - Adicionar novos itens.
  - Editar informações dos itens (descrição, quantidade, etc.).
  - Remover itens do estoque.
- **Gerenciamento de Funcionários**:
  - Gerenciar informações dos funcionários cadastrados.
  - Aprovar ou rejeitar solicitações de novos funcionários.

### **Para Funcionários:**
1. **Cadastro e Acesso**:
   - Utilizar o código da empresa para solicitar acesso ao sistema.
   - Aguardar aprovação do gestor para ter permissão de uso.
2. **Tipos de Funcionários**:
   - **Leitor**:
     - Visualizar o estoque completo.
     - Editar apenas a quantidade dos itens.
   - **Editor**:
     - Adicionar novos itens ao estoque.
     - Editar as informações dos itens (descrição, quantidade, etc.).
     - Remover itens existentes.

---

## **Como Usar**

1. **Para Gestores**:
   - Faça login como gestor.
   - Utilize as ferramentas de gerenciamento para organizar o estoque e os funcionários.
   - Aprove ou rejeite solicitações de novos funcionários na aba de gerenciamento.

2. **Para Funcionários**:
   - Solicite acesso ao sistema utilizando o código fornecido por uma empresa gestora.
   - Após a aprovação, use as permissões disponíveis de acordo com seu tipo de usuário (Leitor ou Editor).

---

## **Design e Tema**  
- O tema azul proporciona uma interface limpa e profissional, voltada para facilidade de uso.  
- O layout é responsivo, garantindo acessibilidade em dispositivos móveis e desktops.

---

## **Tecnologias Utilizadas**  
- **Framework**: React.js / Next.js  
- **Linguagens**: Typescript e Javascript 
- **Banco de Dados**: Firebase  
- **Hospedagem**: Vercel  
- **Estilização**: Tailwind e CSS
---

## **Permissões e Segurança**  
A aplicação foi projetada com um sistema de permissões para garantir que cada usuário tenha acesso apenas às funcionalidades adequadas à sua função.

---

## **Conclusão**  
Este Gerenciador de Estoque é uma demonstração prática de minhas habilidades no desenvolvimento de sistemas CRUD, com foco em organização, segurança e experiência do usuário.
