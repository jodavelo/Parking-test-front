# Control de Accesos - Frontend

Sistema de gestión vehicular para control de entrada y salida de vehículos.

## Tecnologías

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: Radix UI + shadcn/ui
- **Iconos**: Lucide React

## Requisitos Previos

- Node.js 18.17 o superior
- npm, yarn o pnpm
- Backend API corriendo en el puerto configurado

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

Variables de entorno:
- `NEXT_PUBLIC_API_URL`: URL base de la API backend (ejemplo: `http://localhost:5206`)

## Ejecución

### Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Producción

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css      # Estilos globales y tema
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página principal
├── components/
│   ├── parking/         # Componentes del sistema
│   │   ├── access-form.tsx      # Formulario de registro
│   │   ├── access-history.tsx   # Historial de accesos
│   │   ├── header.tsx           # Encabezado
│   │   ├── vehicle-status.tsx   # Estado de vehículos
│   │   └── index.ts             # Exports
│   └── ui/              # Componentes base UI
└── lib/
    └── utils.ts         # Utilidades
```

## Funcionalidades

### Registro de Accesos
- Formulario para registrar entrada y salida de vehículos
- Validación de campos requeridos
- Mensajes de éxito y error claros

### Estado de Vehículos
- Visualización de vehículos actualmente dentro del parking
- Búsqueda por placa o nombre de usuario
- Indicadores de estado (Dentro/Fuera)

### Historial de Accesos
- Registro de auditoría de todos los intentos de acceso
- Diferenciación visual entre accesos exitosos y denegados
- Información detallada de cada evento

## Decisiones Técnicas

1. **Next.js App Router**: Aprovecha las últimas características de React 19 y Server Components para mejor rendimiento.

2. **Tailwind CSS v4**: Configuración moderna con variables CSS nativas para temas dinámicos.

3. **Componentes desacoplados**: Cada componente maneja su propio estado y llamadas a la API, facilitando el testing y mantenimiento.

4. **Patrón de refresh coordinado**: El componente padre coordina las actualizaciones entre componentes mediante un trigger de refresh.

5. **Manejo de errores centralizado**: Cada componente gestiona sus propios estados de error y loading.

## API Endpoints Consumidos

- `POST /api/access` - Registrar entrada/salida
- `GET /api/vehicles/status` - Obtener estado de vehículos
- `GET /api/access/history` - Obtener historial de accesos

## Mejoras Futuras

- Implementar WebSockets para actualizaciones en tiempo real
- Agregar paginación en el historial de accesos
- Implementar caché con React Query o SWR
- Agregar tests unitarios y de integración
- Implementar autenticación de usuarios
