# Plantilla CRUD (Next.js)

Este documento explica como usar la plantilla para crear un nuevo CRUD con otro recurso.

## Estructura recomendada

- app/[lang]/(admin)/admin/<recurso>/page.tsx
- app/[lang]/(admin)/admin/<recurso>/create/page.tsx
- app/[lang]/(admin)/admin/<recurso>/[id]/page.tsx
- components/features/<recurso>/table.tsx
- components/features/<recurso>/form.tsx
- hooks/use-<recurso>-mutations.ts
- lib/actions/<recurso>/index.ts
- dictionaries/en.json y dictionaries/es.json

## Componentes base de la plantilla

- components/templates/crud/crud-page-header.tsx
- components/templates/crud/crud-table-actions.tsx

## Pasos rapidos

1. Crear acciones del recurso (server actions)

- lib/actions/<recurso>/index.ts
- Define getAll, getOne, create, update, delete
- Usa los tipos del paquete shared cuando sea posible

2. Crear hooks de mutacion

- hooks/use-<recurso>-mutations.ts
- Incluye useCreate, useUpdate, useDelete
- Centraliza toasts y errores

3. Crear el formulario

- components/features/<recurso>/form.tsx
- Usa react-hook-form + zodResolver
- Recibe dict y lang por props
- Usa ImageUploader si el recurso maneja imagenes

4. Crear la tabla

- components/features/<recurso>/table.tsx
- Usa CrudTableActions para editar/eliminar
- Muestra columnas relevantes

5. Crear paginas

- page.tsx (listado)
- create/page.tsx (crear)
- [id]/page.tsx (editar)
- Usa CrudPageHeader en el listado
- Asegura preservar lang en links y redirects

6. Agregar textos i18n

- dictionaries/en.json y dictionaries/es.json
- Agrega labels, placeholders, estados, errores y confirmaciones

## Ejemplo minimo (listado)

- app/[lang]/(admin)/admin/<recurso>/page.tsx

```tsx
import { CrudPageHeader } from '@/components/templates/crud/crud-page-header';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { get<RecursoPlural> } from '@/lib/actions/<recurso>';
import <Recurso>Table from '@/components/features/<recurso>/table';

const Page = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');
  const data = await get<RecursoPlural>({ limit: 20, offset: 0 });

  return (
    <div className="px-4 space-y-4">
      <CrudPageHeader
        title={`${dict.<recursoTitleKey>} (${data.total})`}
        actionHref={`/${lang}/admin/<recurso>/create`}
        actionLabel={dict.<recursoCreateKey>}
      />
      <<Recurso>Table services={data} dict={dict} lang={lang} />
    </div>
  );
};

export default Page;
```

## Imagenes (opcional)

Si el recurso maneja imagenes:

- Usa ImageUploader en el formulario
- Envia imageUrl con el helper prepareImageUrlForServer
- Para eliminar imagen, envia imageUrl como cadena vacia

## Ejemplo completo (recurso: categorias)

La siguiente guia muestra un CRUD completo para un recurso llamado categorias.

### 1) Acciones (server actions)

- lib/actions/categories/index.ts

```ts
'use server';

import { api } from '@/lib/api/api';
import { authHeaders } from '@/lib/api/withAuth';
import type {
  PaginatedResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Category,
} from '@ascencio/shared';

export interface Pagination {
  limit?: number;
  offset?: number;
}

export async function getCategories(
  params: Pagination = {},
): Promise<PaginatedResponse<Category>> {
  const headers = await authHeaders();
  const res = await api.get<PaginatedResponse<Category>>('/categories', {
    params,
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function getCategory(id: string): Promise<Category> {
  const headers = await authHeaders();
  const res = await api.get(`/categories/${id}`, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function createCategory(dto: CreateCategoryRequest) {
  const headers = await authHeaders();
  const res = await api.post('/categories', dto, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function updateCategory(id: string, dto: UpdateCategoryRequest) {
  const headers = await authHeaders();
  const res = await api.patch(`/categories/${id}`, dto, {
    headers,
    withCredentials: true,
  });
  return res.data;
}

export async function deleteCategory(id: string) {
  const headers = await authHeaders();
  const res = await api.delete(`/categories/${id}`, {
    headers,
    withCredentials: true,
  });
  return res.data;
}
```

### 2) Hooks de mutacion

- hooks/use-category-mutations.ts

```ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@ascencio/shared';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/actions/categories';

export function useCreateCategory(dict: Dictionary, lang: string) {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: () => {
      toast.success(dict.categoryCreatedSuccess);
      router.push(`/${lang}/admin/categories`);
      router.refresh();
    },
  });
}

export function useUpdateCategory(dict: Dictionary, lang: string, id: string) {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => updateCategory(id, data),
    onSuccess: () => {
      toast.success(dict.categoryUpdatedSuccess);
      router.push(`/${lang}/admin/categories`);
      router.refresh();
    },
  });
}

export function useDeleteCategory(dict: Dictionary, onSuccess?: () => void) {
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success(dict.categoryDeletedSuccess);
      onSuccess?.();
    },
  });
}
```

### 3) Formulario

- components/features/categories/form.tsx

```tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { categorySchema, type CreateCategoryRequest } from '@ascencio/shared';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { FormFieldError } from '@/components/ui/form-field-error';
import { Input } from '@/components/ui/input';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/hooks/use-category-mutations';

interface CategoryFormProps {
  categoryId?: string;
  initialValues?: Partial<CreateCategoryRequest>;
  dict: Dictionary;
  lang: string;
}

export function CategoryForm({
  categoryId,
  initialValues,
  dict,
  lang,
}: CategoryFormProps) {
  const isEditing = Boolean(categoryId);
  const createMutation = useCreateCategory(dict, lang);
  const updateMutation = useUpdateCategory(dict, lang, categoryId || '');
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm<CreateCategoryRequest>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
    },
  });

  const onSubmit = (data: CreateCategoryRequest) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">{dict.categoryNameLabel}</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder={dict.categoryNamePlaceholder}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">
                {dict.categoryDescriptionLabel}
              </FieldLabel>
              <Input
                {...field}
                id="description"
                placeholder={dict.categoryDescriptionPlaceholder}
              />
              <FormFieldError dict={dict} error={fieldState.error} />
            </Field>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? dict.categoryUpdateButton : dict.categoryCreateButton}
        </Button>
      </FieldGroup>
    </form>
  );
}
```

### 4) Tabla

- components/features/categories/table.tsx

```tsx
'use client';

import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { PaginatedResponse, Category } from '@ascencio/shared';
import { useRouter } from 'next/navigation';
import { useDeleteCategory } from '@/hooks/use-category-mutations';
import { CrudTableActions } from '@/components/templates/crud/crud-table-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CategoryTableProps {
  data: PaginatedResponse<Category>;
  dict: Dictionary;
  lang: string;
}

export function CategoryTable({ data, dict, lang }: CategoryTableProps) {
  const router = useRouter();
  const deleteMutation = useDeleteCategory(dict, () => router.refresh());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.categoryTableName}</TableHead>
          <TableHead className="text-center">{dict.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell className="text-center">
              <CrudTableActions
                editHref={`/${lang}/admin/categories/${item.id}`}
                onDelete={() => deleteMutation.mutate(item.id)}
                isDeleting={deleteMutation.isPending}
                confirmTitle={dict.categoryDeleteConfirmTitle}
                confirmDescription={`${dict.categoryDeleteConfirmDesc} "${item.name}".`}
                cancelLabel={dict.cancel}
                deleteLabel={dict.delete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 5) Paginas

- app/[lang]/(admin)/admin/categories/page.tsx

```tsx
import { CrudPageHeader } from '@/components/templates/crud/crud-page-header';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getCategories } from '@/lib/actions/categories';
import { CategoryTable } from '@/components/features/categories/table';

const Page = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'es');
  const data = await getCategories({ limit: 20, offset: 0 });

  return (
    <div className="px-4 space-y-4">
      <CrudPageHeader
        title={`${dict.categoriesTitle} (${data.total})`}
        actionHref={`/${lang}/admin/categories/create`}
        actionLabel={dict.categoryNew}
      />
      <CategoryTable data={data} dict={dict} lang={lang} />
    </div>
  );
};

export default Page;
```

- app/[lang]/(admin)/admin/categories/create/page.tsx

```tsx
import { CategoryForm } from '@/components/features/categories/form';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth/me';

export default async function CreatePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}/signin`);
  const dict = await getDictionary(lang as 'en' | 'es');

  return (
    <div className="container mx-auto py-4 md:py-8">
      <CategoryForm dict={dict} lang={lang} />
    </div>
  );
}
```

- app/[lang]/(admin)/admin/categories/[id]/page.tsx

```tsx
import { CategoryForm } from '@/components/features/categories/form';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getCategory } from '@/lib/actions/categories';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth/me';

export default async function EditPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}/signin`);
  const dict = await getDictionary(lang as 'en' | 'es');

  try {
    const category = await getCategory(id);
    return (
      <div className="container mx-auto py-4 md:py-8">
        <CategoryForm
          categoryId={id}
          initialValues={{
            name: category.name,
            description: category.description,
          }}
          dict={dict}
          lang={lang}
        />
      </div>
    );
  } catch {
    notFound();
  }
}
```

### 6) i18n (llaves necesarias)

- dictionaries/en.json
- dictionaries/es.json

```json
{
  "categoriesTitle": "Categories",
  "categoryNew": "New Category",
  "categoryCreateButton": "Create Category",
  "categoryUpdateButton": "Update Category",
  "categoryCreatedSuccess": "Category created successfully.",
  "categoryUpdatedSuccess": "Category updated successfully.",
  "categoryDeletedSuccess": "Category deleted successfully.",
  "categoryNameLabel": "Name",
  "categoryNamePlaceholder": "General",
  "categoryDescriptionLabel": "Description",
  "categoryDescriptionPlaceholder": "General category",
  "categoryTableName": "Name",
  "categoryDeleteConfirmTitle": "Are you absolutely sure?",
  "categoryDeleteConfirmDesc": "This action cannot be undone. This will permanently delete the category"
}
```

## Checklist

- [ ] Links y redirects con `lang`
- [ ] i18n completo (sin strings hardcodeados)
- [ ] Hooks de mutacion con toasts
- [ ] Zod schema y tipos desde shared
- [ ] Reutiliza CrudPageHeader y CrudTableActions
- [ ] Build sin errores
