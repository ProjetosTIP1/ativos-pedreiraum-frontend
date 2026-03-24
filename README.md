# Valemix Assets Catalog - Frontend

Este é o frontend do sistema **Valemix Assets Catalog**, uma plataforma de gerenciamento de inventário industrial. O sistema oferece um catálogo público para clientes e um dashboard administrativo seguro para gestão de ativos.

## 🚀 Tecnologias

O projeto utiliza uma stack moderna focada em performance, segurança e manutenibilidade:

- **Core:** [React 19](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8+](https://vitejs.dev/)
- **Roteamento:** [React Router 7](https://reactrouter.com/)
- **Gestão de Estado:** [Zustand](https://zustand-demo.pmnd.rs/) (Store-first architecture)
- **Validação:** [Zod](https://zod.dev/) (Sincronizado com os modelos Pydantic do backend)
- **Cliente HTTP:** [Axios](https://axios-http.com/) (Configurado com `withCredentials` para cookies HTTP-only)
- **Styling:** [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (Design System Industrial/Editorial)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🏗️ Arquitetura e Organização

O projeto segue princípios de **Clean Architecture**, separando a lógica de negócio da apresentação:

- **`src/stores/`**: Single source of truth para o estado da aplicação (Auth, Assets, Categories, UI).
- **`src/server/`**: Camada de serviço/repositório que encapsula as chamadas de API.
- **`src/hooks/`**: Hooks customizados que orquestram a lógica entre os stores e os componentes.
- **`src/components/`**: Componentes reutilizáveis divididos por contexto (ui, layout, assets, admin).
- **`src/pages/`**: Componentes de página que montam a visão final.
- **`src/schemas/`**: Definições de entidades e esquemas de validação (Zod).

### Convenções Importantes
- **Lógica em Hooks:** Componentes devem ser o mais "puros" possível (focados em UI). Toda lógica complexa ou de dados deve residir em hooks customizados.
- **Aesthetics First:** O sistema utiliza um tema industrial premium com cores harmoniosas (Stark White, structural charcoal, high-visibility yellow).
- **Tratamento de Imagens:** Uploads são feitos sequencialmente com normalização automática (Canvas API) para garantir compatibilidade e performance.

## 🛠️ Configuração e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) ou [Bun](https://bun.sh/) (Preferencial pela velocidade)

### Instalação
```bash
# Com Bun
bun install

# Ou NPM
npm install
```

### Desenvolvimento
```bash
bun run dev
```
O servidor de desenvolvimento utiliza o proxy configurado em `vite.config.ts` para comunicar-se com o backend.

### Build de Produção
```bash
bun run build
```

## 🐳 Docker

O frontend pode ser facilmente containerizado utilizando o Docker.

### 1. Criar Imagem Docker
Certifique-se de estar na raiz da pasta `frontend/`:
```bash
docker build -t valemix-frontend .
```

### 2. Executar Container
```bash
docker run -p 80:80 --name valemix-frontend-app valemix-frontend
```

### 3. Configuração com Docker Compose
Para integrar com o backend em uma rede comum, utilize um arquivo `docker-compose.yml` (geralmente na raiz do projeto).

Exemplo de configuração para o frontend:

```yaml
services:
  frontend:
    build:
      context: ./frontend
    container_name: ativos-frontend
    ports:
      - "80:80"
    environment:
      # Variáveis de ambiente da empresa
      - VITE_COMPANY_PHONE=+55 (31) 3847.2200
      - VITE_COMPANY_EMAIL=contato@pedreiraumvalemix.com.br
      - VITE_COMPANY_ADDRESS=Área Rural, KM 270 | Cel. Fabriciano, MG
      - VITE_COMPANY_WEBSITE=https://pedreiraumvalemix.com.br/
      - VITE_COMPANY_CONSULTOR_CONTACT=5531998850557
      - VITE_ENV_MODE=production
    depends_on:
      - ativos-backend # Nome do serviço definido no compose do backend
    networks:
      - ativos-network

networks:
  ativos-network:
    driver: bridge
```

> [!IMPORTANT]
> Como o frontend é uma Single Page Application (SPA), as variáveis de ambiente prefixadas com `VITE_` são injetadas no código **durante o build**. Ao usar Docker Compose com `build:`, o Docker irá utilizar os valores definidos no momento da construção da imagem.

## ✨ Funcionalidades Principais

1. **Catálogo Público:** Filtros avançados por categoria, ano e status.
2. **Dashboard Administrativo:**
   - **ADMIN:** Visão global de todo o inventário e gestão de usuários.
   - **REGULAR:** Gestão restrita aos seus próprios ativos.
3. **Gestão de Ativos:** CRUD completo com upload múltiplo de imagens e definição de imagem principal.
4. **Segurança:** Autenticação baseada em cookies HTTP-only e proteção de rotas (CSRF ready).
5. **Integração WhatsApp:** Geração automática de mensagens personalizadas para leads.

## 📄 Documentação Relacionada
- `DESIGN.md`: Detalhes do sistema de design e tokens.
- `API.md`: Documentação das interfaces de backend.
- `FRONTEND_GUIDE.md`: Guia de integração técnica.

---
Desenvolvido com foco em precisão industrial e excelência técnica.
