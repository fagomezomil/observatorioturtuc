# Observatorio Turístico Tucumán

Plataforma web para la carga y visualización de datos del Observatorio Turístico del Ente Tucumán Turismo. Permite gestionar indicadores turísticos por destino y periodo, y publicar balances estadísticos de acceso público.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS v4 + shadcn/ui (Base UI)
- **Base de datos**: PostgreSQL (Supabase) con Prisma 5
- **Autenticación**: Auth.js v5 (credentials provider, bcryptjs)
- **Gráficos**: Chart.js + react-chartjs-2 + Recharts
- **Deploy**: Vercel

## Colores institucionales

| Uso        | Color   |
| ---------- | ------- |
| Primario   | #006e66 |
| Secundario | #e9721f |
| Acento     | #223468 |

## Roles

| Rol    | Permisos                         |
| ------ | -------------------------------- |
| ADMIN  | CRUD datos + gestión de usuarios |
| EDITOR | CRUD datos                       |
| VIEWER | Solo lectura pública             |

## Estructura principal

```
src/
├── app/
│   ├── (public)/                        # Sitio público
│   │   ├── page.tsx                     # Home
│   │   ├── balance/[periodo]/page.tsx    # Balance por periodo
│   │   └── quienes-somos/page.tsx       # Quiénes somos
│   ├── admin/                           # Panel de gestión (protegido)
│   │   ├── destinos/                    # ABM destinos
│   │   ├── periodos/                    # ABM periodos
│   │   ├── usuarios/                    # ABM usuarios (ADMIN)
│   │   ├── ocupacion/                   # Ocupación hotelera
│   │   ├── perfil/                      # Perfil del turista
│   │   ├── procedencia/                 # Procedencia
│   │   ├── motivos/                     # Motivos de viaje
│   │   ├── rangos-edad/                # Rangos etarios
│   │   ├── info-previa/                # Información previa
│   │   ├── sitios/                      # Sitios consultados
│   │   ├── compania/                    # Compañía de viaje
│   │   ├── anticipacion/               # Anticipación de viaje
│   │   ├── estadia/                     # Estadía promedio
│   │   ├── gasto/                       # Gasto promedio
│   │   ├── actividades/                 # Actividades realizadas
│   │   ├── movimiento/                 # Movimiento de turistas
│   │   ├── pernoctes/                  # Pernoctes extrahoteleros
│   │   ├── impacto/                     # Impacto económico
│   │   └── notas/                       # Notas metodológicas
│   ├── login/page.tsx
│   └── register/page.tsx
├── components/
│   └── public/                          # Componentes del sitio público
├── lib/
│   ├── auth.ts                          # Configuración Auth.js
│   ├── prisma.ts                        # Cliente Prisma
│   ├── charts.ts                        # Configuración de Chart.js
│   ├── evolution-data.ts               # Datos de evolución temporal
│   └── actions/                         # Server actions
│       ├── auth.ts
│       ├── datos.ts
│       ├── destinos.ts
│       ├── periodos.ts
│       └── usuarios.ts
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

## Modelo de datos

16 entidades de dominio organizadas por **Destino** + **Periodo**:

OcupaciónHotelera, PerfilTurista, Procedencia, MotivoViaje, RangoEdad, InfoPrevia, SitioConsultado, CompaniaViaje, AnticipacionViaje, EstadiaPromedio, GastoPromedio, Actividad, MovimientoTurista, PernocteExtraHotelero, ImpactoEconomico, NotaMetodologica

La mayoría de los campos son nullable, ya que no todos los balances contienen todos los datos.

## Setup

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Seed de datos iniciales
npx prisma db seed

# Iniciar desarrollo
npm run dev
```

## Variables de entorno

```env
DATABASE_URL=             # PostgreSQL connection string
AUTH_SECRET=              # Secret para Auth.js
NEXTAUTH_URL=             # URL base de la app
```

## Notas técnicas

- shadcn/ui v4 usa `@base-ui/react` (no Radix). Los componentes no soportan `asChild`; usan prop `render` en su lugar.
- `Select` usa `onValueChange` con tipo `(value: string | null, eventDetails) => void`.