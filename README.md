# 🎮 Momentum - Frontend

**Momentum** es una aplicación web gamificada de productividad que convierte las tareas diarias en misiones épicas. Los usuarios pueden crear tareas con diferentes niveles de dificultad, ganar puntos al completarlas, y usar esos puntos para cuidar a su mascota virtual (dragón).

## ✨ Características Principales

### 🎯 Sistema de Misiones
- **Creación de tareas** con 3 niveles de prioridad (Fácil, Medio, Difícil)
- **Sistema de recompensas** basado en dificultad:
  - 🟢 Fácil: 10 puntos + 5 XP
  - 🟡 Medio: 15 puntos + 10 XP  
  - 🔴 Difícil: 20 puntos + 20 XP
- **Gestión de estados**: Pendiente → Completado → Archivado
- **Dashboard interactivo** con estadísticas en tiempo real

### 🐉 Mascota Virtual
- **Dragón animado** con sprite personalizado
- **Sistema de estadísticas**: Salud, Energía, Hambre
- **Estados de ánimo** dinámicos (Feliz, Neutral, Triste)
- **Cuidado interactivo**:
  - Alimentar (10 pts)
  - Curar (20 pts)
  - Aumentar energía (15 pts)
- **Sistema de niveles** y experiencia

### 🔐 Autenticación y Seguridad
- Registro e inicio de sesión con validación
- Autenticación JWT con refresh tokens
- Rutas protegidas
- Gestión automática de sesiones

### 🎨 Interfaz de Usuario
- **Diseño gaming** con efectos visuales
- **Tema dark** con gradientes futuristas
- **Components reutilizables** con efectos de brillo
- **Responsive design** para móviles y desktop
- **Animaciones fluidas** y transiciones

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento SPA

### Styling & UI
- **TailwindCSS 4.1** - Framework de CSS utility-first
- **Lucide React** - Iconos SVG optimizados
- **CSS Animations** - Animaciones personalizadas

### Formularios y Validación
- **React Hook Form** - Gestión de formularios performante
- **Zod** - Validación de esquemas TypeScript-first
- **@hookform/resolvers** - Integración Zod + RHF

### Estado y Datos
- **Context API** - Gestión de estado global (Auth)
- **Custom Hooks** - Lógica reutilizable
- **LocalStorage** - Persistencia de tokens

## 📁 Estructura del Proyecto

```
src/
├── assets/               # Recursos estáticos
│   ├── dragon-sprite.png # Sprite animado del dragón
│   └── react.svg
├── components/           # Componentes reutilizables
│   ├── GameComponents.tsx    # Botones y cards temáticos
│   ├── PetComponent.tsx      # Componente mascota virtual
│   ├── ProtectedRoute.tsx    # HOC para rutas protegidas
│   ├── TaskCard.tsx          # Card individual de tarea
│   └── TaskForm.tsx          # Formulario crear/editar tarea
├── contexts/             # Contexts de React
│   └── AuthContext.tsx       # Estado global autenticación
├── hooks/                # Custom hooks
│   └── useAuth.ts            # Hook para autenticación
├── pages/                # Páginas principales
│   ├── CreatePet.tsx         # Crear mascota inicial
│   ├── Dashboard.tsx         # Panel principal usuario
│   ├── Home.tsx              # Landing page
│   ├── Login.tsx             # Inicio de sesión
│   └── Register.tsx          # Registro usuario
├── schemas/              # Esquemas validación
│   └── auth.ts               # Validaciones auth con Zod
├── services/             # Servicios externos
│   └── api.ts                # Cliente API REST
├── types/                # Definiciones TypeScript
│   └── api.ts                # Tipos para API responses
├── App.tsx               # Componente raíz
├── main.tsx              # Entry point
└── index.css             # Estilos globales
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** >= 18.0.0
- **npm** o **bun** (recomendado)
- Backend de Momentum ejecutándose en `http://localhost:8080`

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ProtoSG/momentum-front.git
   cd momentum-front
   ```

2. **Instalar dependencias**
   ```bash
   # Con bun (recomendado)
   bun install
   
   # O con npm
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # El API_BASE_URL está configurado en src/services/api.ts
   # Por defecto apunta a http://localhost:8080/api
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   # Con bun
   bun dev
   
   # O con npm
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts Disponibles

```bash
# Desarrollo
bun dev          # Inicia servidor desarrollo

# Producción  
bun run build    # Construye para producción
bun run preview  # Vista previa build producción

# Calidad de código
bun run lint     # Ejecuta ESLint
```

## 🎮 Uso de la Aplicación

### Primer Uso
1. **Registro**: Crea una cuenta con email y contraseña
2. **Crear Mascota**: Elige nombre para tu dragón virtual
3. **Dashboard**: Accede al panel principal

### Workflow Principal
1. **Crear Misión**: Define tarea con descripción y prioridad
2. **Completar Tarea**: Marca como completada para ganar puntos
3. **Cuidar Mascota**: Usa puntos para alimentar, curar y energizar
4. **Subir Nivel**: Acumula XP para evolucionar tu dragón

### Sistema de Puntos
- **Puntos**: Gastables para cuidar mascota
- **Experiencia**: Permanente para subir nivel
- **Niveles**: Desbloquean nuevas formas del dragón

## 🎨 Personalización del Tema

La aplicación utiliza un sistema de diseño gaming consistente:

### Colores Principales
```css
/* Gradientes de fondo */
from-gray-900 via-blue-900 to-purple-900

/* Acentos */
--cyan-300: #67e8f9      /* Títulos principales */
--purple-400: #c084fc    /* Niveles mascota */
--yellow-400: #facc15    /* Puntos/recompensas */
--green-400: #4ade80     /* XP/completado */
```

### Efectos Visuales
- **Glow effects** en componentes importantes
- **Hover animations** en botones interactivos  
- **Sprite animations** para mascota virtual
- **Progress bars** animadas para estadísticas

## 🔗 Integración con Backend

### Endpoints Principales
```typescript
// Autenticación
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

// Tareas
GET    /api/task
POST   /api/task
PUT    /api/task/:id
PUT    /api/task/state/:id
DELETE /api/task/:id

// Mascota
GET  /api/pet
POST /api/pet
POST /api/pet/feed
POST /api/pet/heal
POST /api/pet/boost-energy
POST /api/pet/points
POST /api/pet/experience

// Niveles
GET /api/pet-levels
```

### Gestión de Estados
- **Loading states** para todas las operaciones async
- **Error handling** con feedback visual
- **Optimistic updates** para mejor UX
- **Token refresh** automático

## 🚀 Deployment

### Build de Producción
```bash
bun run build
```

### Variables de Entorno Producción
Actualizar `API_BASE_URL` en `src/services/api.ts` con la URL del backend en producción.

### Plataformas Recomendadas
- **Vercel** (recomendado para proyectos React)
- **Netlify**
- **GitHub Pages**

## 🤝 Contribución

1. Fork el proyecto
2. Crea feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push branch (`git push origin feature/nueva-funcionalidad`)
5. Abre Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔗 Enlaces

- **Repositorio Backend**: [momentum-back](https://github.com/ProtoSG/momentum-back)
- **Demo Live**: _Próximamente_
- **Documentación API**: _En desarrollo_
