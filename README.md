# Ascencio Tax Web Application

Aplicación web profesional para gestión de servicios fiscales construida con Next.js 16, siguiendo las mejores prácticas y documentación oficial.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16.0.3 (App Router)
- **UI**: React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Forms**: React Hook Form + Zod
- **State**: Zustand 5.0.2
- **HTTP**: Axios
- **i18n**: Next.js integrado (en, es)

## 📁 Estructura del Proyecto

```
ascencio-tax-web/
├── app/[lang]/              # App Router con i18n
│   ├── (public)/           # Páginas públicas
│   ├── (auth)/             # Autenticación
│   └── (admin)/            # Área protegida
├── components/             # Componentes React
├── lib/                   # Lógica de negocio
├── types/                # TypeScript types
├── dictionaries/         # Traducciones
└── proxy.ts             # Middleware
```

## 🔐 Autenticación

Implementación según [guía oficial de Next.js 16](https://nextjs.org/docs/app/guides/authentication):

- Session Management con cookies httpOnly
- Server Actions para signin/signup/signout
- Data Access Layer centralizada
- Proxy para protección de rutas

## 🌍 Internacionalización

- Idiomas: Inglés (en), Español (es)
- URLs: `/en/admin`, `/es/admin`
- Detección automática de idioma

## 📋 Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## 🚀 Getting Started

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env.local
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

4. Abrir http://localhost:4000

## 📚 Documentación

- **[AGENT.md](./AGENT.md)** - Guía completa de arquitectura
- **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** - Referencia rápida
- **[Next.js Docs](https://nextjs.org/docs)** - Documentación oficial

## ✅ Checklist Antes de Commit

- [ ] `npm run build` exitoso
- [ ] `npx tsc --noEmit` sin errores
- [ ] Server Components sin `'use client'` innecesario
- [ ] Páginas admin verifican sesión
- [ ] i18n implementado

---

**Última actualización**: 15 de diciembre de 2025  
**Next.js**: 16.0.3

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
