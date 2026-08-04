<div align="center">
  <img src="https://raw.githubusercontent.com/devoguzz/resolveops-support-engineering-lab/main/public/favicon.svg" alt="ResolveOps Logo" width="120" />

  # ResolveOps Support Engineering Lab

  **An enterprise-grade frontend architecture for next-generation customer support operations.**
  
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
</div>

<br />

## 📖 Overview

**ResolveOps** is a mock-driven, state-of-the-art frontend engineering laboratory designed to simulate complex Support Engineering workflows. It demonstrates how to handle multi-tenant B2B architectures, Role-Based Access Control (RBAC), and high-fidelity observability pipelines—all entirely within the browser using sophisticated local state mock services.

The project is split into two primary domains:
1. **Customer Portal:** A white-label experience where organizations can manage webhooks, API keys, team members, and file support tickets.
2. **Support Console:** An advanced dashboard for Support Engineers to triage incidents, inspect webhook deliveries, analyze system logs, and execute runbooks.

---

## ✨ Core Features

### 🛡️ Enterprise Security & Multi-Tenancy
- **Strict Tenant Isolation:** Service layers are designed with context-aware validation. Cross-tenant data leaks are actively blocked at the data access level by passing user session context to all state queries.
- **Role-Based Access Control (RBAC):** Distinct permissions between `customer_owner` and `customer_member` ensure secure team management. Owners cannot lock themselves out, and members cannot elevate privileges.

### 👥 Customer Experience (CX) Portal
- **Dashboard Analytics:** Live summaries of active users, open tickets, and recent activity logs.
- **Team Management:** Invite, suspend, or promote team members securely.
- **Webhook Management & Delivery Logs:** Add endpoints and inspect HTTP status codes and payloads for individual webhook deliveries.

### 🛠️ Support Engineering Console
- **Unified Ticket Queue:** Intelligent ticket queue featuring SLAs, Priority sorting, and direct links to affected organizations.
- **Observability Hub:** 
  - **Trace Explorer:** Drill down into interconnected request IDs to find root causes (`WEBHOOK_SIGNATURE_INVALID` etc.).
  - **Log Explorer:** Filter structured logs by severity and service.
  - **Incident Management:** Map failing services to specific support tickets and execute relevant runbooks.

---

## 🏗️ Architecture & Technology Stack

The application relies entirely on modern Frontend paradigms, intentionally decoupled from a real backend to allow instant spin-up and sandbox testing.

- **Core Framework:** React 18, bootstrapped with Vite for instant HMR.
- **Type Safety:** Strict TypeScript across domain models, UI props, and service contracts.
- **Styling:** Tailwind CSS for rapid, scalable, and beautifully consistent utility-first styling.
- **Routing:** React Router v6 implementing protected routes and layout-based nesting.
- **Persistence:** High-performance wrapper around `localStorage` acting as the mock database, seeded deterministically on first load.

### Directory Structure

```text
src/
├── app/                  # Router configuration and global App entry
├── components/           # Reusable UI components (Badges, Loaders, Toasts)
├── domain/               # Domain models (Types/Interfaces for the entire app)
├── layouts/              # Structural layouts (Customer vs. Support navigation)
├── mocks/                # Deterministic seed data mimicking a production database
├── pages/                # Page-level components organized by domain
│   ├── auth/
│   ├── customer/         # B2B Customer Portal Pages
│   ├── support/          # Internal Support Console Pages
│   └── system/           # 404, 403 error boundaries
├── services/             # Mock service layer enforcing tenant isolation & RBAC
├── store/                # Global state management (Auth session, Data persistence)
└── styles/               # Global CSS and Tailwind directives
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devoguzz/resolveops-support-engineering-lab.git
   cd resolveops-support-engineering-lab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

### 🔐 Demo Credentials

Use the following credentials to explore different roles within the application:

| Role | Email | Password | Organization | Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Customer Owner** | `admin@northstar.test` | `password` | NorthStar Labs | Customer |
| **Customer Member** | `dev@northstar.test` | `password` | NorthStar Labs | Customer |
| **Support Agent** | `agent@resolveops.test` | `password` | ResolveOps (Internal) | Support |
| **Support Lead** | `lead@resolveops.test` | `password` | ResolveOps (Internal) | Support |

*(Note: In this mock environment, the password field accepts any value, but the email must match exactly).*

---

## 🧪 Testing

The lab includes built-in configurations for End-to-End testing to ensure core workflows remain intact.

```bash
# Run all Playwright E2E tests
npm run test:e2e

# Run tests in UI mode for debugging
npm run test:e2e:ui
```

---

## 🤝 Contributing

We welcome contributions from the community. If you are interested in enhancing the lab—whether it's adding a new observability feature, refining the UI, or expanding the E2E test coverage—please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ by the ResolveOps Engineering Team.</p>
</div>
