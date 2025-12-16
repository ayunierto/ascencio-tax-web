# Guía Rápida de Referencia - Next.js 16

## 🚀 Comandos Diarios

```bash
# Desarrollo
npm run dev

# Build (ejecutar ANTES de commits)
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📁 Dónde Crear Cada Archivo

### Nuevas Páginas

```bash
# Landing / Públicas
app/[lang]/(public)/about/page.tsx
app/[lang]/(public)/services/page.tsx

# Autenticación
app/[lang]/(auth)/signin/page.tsx
app/[lang]/(auth)/signup/page.tsx

# Admin (protegidas)
app/[lang]/(admin)/reports/page.tsx
app/[lang]/(admin)/users/[id]/page.tsx
```

### Componentes

```bash
# UI primitivos (botones, inputs, etc)
components/ui/button.tsx

# Componentes de auth
components/auth/signin-form.tsx

# Componentes de admin
components/admin/user-table.tsx

# Componentes de landing
components/landing/hero.tsx
```

### Lógica de Negocio

```bash
# Server Actions
lib/actions/auth/signin.ts
lib/actions/users/create.ts
lib/actions/appointments/update.ts

# API Client
lib/api/api.ts

# Stores (Zustand)
lib/stores/auth-store.ts
lib/stores/ui-store.ts

# Utilidades
lib/utils/date.ts
lib/utils/format.ts

# Validaciones (Zod)
lib/validations/auth.ts
lib/validations/user.ts
```

### Tipos TypeScript

```bash
types/auth.ts
types/user.ts
types/appointment.ts
```

---

## 🔐 Patrón de Autenticación

### 1. Server Action (lib/actions/auth/signin.ts)

```typescript
'use server';
import { SigninSchema } from '@/lib/validations/auth';
import { createSession } from '@/lib/auth/session';

export async function signIn(formData: FormData) {
  // 1. Validar
  const validated = SigninSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // 2. Llamar al backend
  const response = await api.post('/auth/signin', validated.data);

  // 3. Crear sesión (cookie)
  await createSession(response.data.user.id);

  // 4. Redirigir
  redirect('/admin/dashboard');
}
```

### 2. Formulario Cliente (components/auth/signin-form.tsx)

```typescript
'use client';
import { useActionState } from 'react';
import { signIn } from '@/lib/actions/auth/signin';

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <input name="password" type="password" />
      {state?.errors?.password && <p>{state.errors.password}</p>}

      <button disabled={pending}>
        {pending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### 3. Proteger Página (app/[lang]/(admin)/dashboard/page.tsx)

```typescript
import { getUser } from '@/lib/actions/auth/get-session';
import { notFound } from 'next/navigation';

export default async function DashboardPage() {
  // ✅ Verificar auth
  const user = await getUser();
  if (!user) notFound();

  return <div>Welcome {user.name}</div>;
}
```

---

## 🌍 Patrón de i18n

### 1. Cargar Traducciones

```typescript
import { getDictionary } from '@/lib/i18n/dictionaries';

export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <h1>{dict.landing.title}</h1>;
}
```

### 2. Agregar Nuevas Traducciones

**dictionaries/en.json**:

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Description here"
  }
}
```

**dictionaries/es.json**:

```json
{
  "myFeature": {
    "title": "Mi Función",
    "description": "Descripción aquí"
  }
}
```

### 3. Links con i18n

```typescript
// ✅ Correcto - incluir locale
<Link href={`/${lang}/admin/users`}>Users</Link>

// ❌ Incorrecto - falta locale
<Link href="/admin/users">Users</Link>
```

---

## 📦 Patrón de Server Components vs Client

### Server Component (por defecto)

```typescript
// ✅ NO agregar 'use client'
import { getUsers } from '@/lib/actions/users/get';

export default async function UsersPage() {
  const users = await getUsers(); // ✅ Fetch en el servidor

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Client Component (cuando sea necesario)

```typescript
'use client'; // ✅ Agregar cuando uses hooks o eventos
import { useState } from 'react';

export function UserCard({ user }) {
  const [expanded, setExpanded] = useState(false);

  return <div onClick={() => setExpanded(!expanded)}>{user.name}</div>;
}
```

---

## 🔄 Patrón de Server Actions

### 1. Crear Action

```typescript
// lib/actions/users/create.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  // 1. Validar
  // 2. Verificar auth
  // 3. Llamar al backend
  // 4. Revalidar cache
  revalidatePath('/admin/users');
}
```

### 2. Usar en Formulario

```typescript
'use client';
import { createUser } from '@/lib/actions/users/create';

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## 🎨 Patrón de Componentes UI (shadcn)

### Usar Componentes Existentes

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

<Button variant="default">Click me</Button>
<Input type="email" placeholder="Email" />
```

### Agregar Nuevos Componentes

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

---

## ✅ Checklist Antes de Commit

- [ ] `npm run build` exitoso
- [ ] `npx tsc --noEmit` sin errores
- [ ] `npm run lint` sin errores
- [ ] Imports usando `@/` no relativos
- [ ] Server Components sin `'use client'` innecesario
- [ ] Client Components con `'use client'`
- [ ] Páginas admin verifican sesión
- [ ] i18n implementado correctamente
- [ ] Tipos TypeScript definidos
- [ ] No hay `any` en el código

---

## 🐛 Troubleshooting Común

### Error: "Cannot use hooks in Server Component"

**Solución**: Agregar `'use client'` al componente

### Error: "cookies() called outside Server Component"

**Solución**: Mover la lógica a un Server Action o Server Component

### Error: Redirect not working

**Solución**: Usar `redirect()` de `next/navigation`, no `NextResponse.redirect()`

### Error: i18n no detecta idioma

**Solución**: Verificar que `proxy.ts` tenga la lógica de locale

### Error: Sesión no persiste

**Solución**: Verificar que API tenga `withCredentials: true` y backend acepte cookies

---

## 📚 Documentos de Referencia

- [AGENT.md](./AGENT.md) - Guía completa de arquitectura
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Internationalization](https://nextjs.org/docs/app/guides/internationalization)

---

## 🆘 Comandos de Emergencia

```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules
npm install

# Verificar errores TypeScript
npx tsc --noEmit

# Ver árbol de dependencias
npm list

# Actualizar Next.js
npm install next@latest react@latest react-dom@latest
```
