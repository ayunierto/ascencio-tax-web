# Landing Page - Ascencio Tax Inc.

Una landing page moderna y profesional para Ascencio Tax Inc., inspirada en el diseño de [payroll.ascenciotax.com](https://payroll.ascenciotax.com/).

## Características

### Secciones de la Landing Page

1. **Hero Section** - Sección principal con título, subtítulo y CTAs
2. **Features Section** - Características y servicios ofrecidos
3. **Booking Section** - Sección para reservar citas
4. **Security Section** - Seguridad y cumplimiento
5. **Pricing Section** - Planes de precios
6. **CTA Section** - Llamada a la acción final
7. **Footer Section** - Pie de página con información de contacto

### Páginas Adicionales

- **About** (`/about`) - Información sobre la empresa
- **Booking** (`/booking`) - Página de reserva de citas con calendario
- **Contact** (`/contact`) - Formulario de contacto

### Panel de Administración

Accede a `/admin/landing-settings` para gestionar:

- Contenido del Hero Section
- Visibilidad de secciones
- Información de la empresa
- Configuraciones avanzadas

## Componentes

Todos los componentes están en `/components/landing/`:

- `hero-section.tsx` - Sección hero con animaciones
- `features-section.tsx` - Grid de características con iconos
- `security-section.tsx` - Características de seguridad
- `booking-section.tsx` - Sección de reserva de citas
- `pricing-section.tsx` - Planes de precios
- `cta-section.tsx` - Llamada a la acción
- `footer-section.tsx` - Pie de página
- `landing-navbar.tsx` - Barra de navegación responsive

## Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Iconos

## Internacionalización

La landing page soporta múltiples idiomas (EN/ES). Las traducciones están en:

- `/dictionaries/en.json`
- `/dictionaries/es.json`

Claves de traducción con prefijo `landing*`, `nav*`, `booking*`, `contact*`, `about*`.

## Personalización

### Modificar contenido del Hero

```tsx
<HeroSection
  title="Tu título"
  subtitle="Tu subtítulo"
  ctaPrimary="Botón primario"
  ctaSecondary="Botón secundario"
  ctaPrimaryHref="/signup"
  ctaSecondaryHref="/booking"
/>
```

### Agregar características

```tsx
const features = [
  {
    icon: IconComponent,
    title: 'Título',
    description: 'Descripción',
  },
  // ... más características
];

<FeaturesSection
  title="Título de sección"
  subtitle="Subtítulo opcional"
  features={features}
/>;
```

### Personalizar colores

Los colores se gestionan a través de las variables CSS de Tailwind en `/globals.css`. Las variables principales son:

- `--primary` - Color primario
- `--secondary` - Color secundario
- `--background` - Color de fondo
- `--foreground` - Color de texto

## Estructura de Rutas

```
app/[lang]/(home)/
├── layout.tsx          # Layout con navbar
├── page.tsx            # Página principal
├── about/
│   └── page.tsx        # Acerca de
├── booking/
│   └── page.tsx        # Reservar cita
└── contact/
    └── page.tsx        # Contacto
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar en producción
npm run start
```

## Panel de Administración

El panel de administración permite ajustar:

1. **Hero Section**: Títulos, subtítulos, textos de botones
2. **Visibilidad de Secciones**: Mostrar/ocultar secciones
3. **Información de Empresa**: Nombre, email, teléfono, dirección
4. **Configuraciones Avanzadas**: (próximamente)

Acceso: `/admin/landing-settings` (requiere autenticación)

## Próximas Mejoras

- [ ] Integración con sistema de citas real
- [ ] Formularios de contacto funcionales
- [ ] Analytics y tracking
- [ ] SEO mejorado
- [ ] Más opciones de personalización en admin
- [ ] Tests unitarios y e2e
- [ ] Optimización de imágenes
- [ ] Blog integrado

## Licencia

© 2026 Ascencio Tax Inc. Todos los derechos reservados.
