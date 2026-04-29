# Bloco Sambará — App de gestión de escuela de batucada

## Contexto

Necesito construir una app móvil (web app responsive / PWA) para gestionar una escuela de batucada. Reemplaza una app actual que es funcional pero anticuada visualmente. La escuela se llama **Bloco Sambará**, es una agrupación de samba/batucada con sede en Barcelona.

El color de marca oficial es **fucsia (#a82876 / #c2398c)** y la estética debe ser cálida, moderna y con personalidad — alejada del look genérico de SaaS corporativo. Tipografías sugeridas: **Fraunces** (serif con personalidad para títulos) + **Plus Jakarta Sans** (sans para UI).

---

## Roles

La app tiene **dos roles** con permisos y vistas distintas:

### 1. Profesor
Gestiona toda la operativa de la escuela: alumnos, clases, asistencia, recuperaciones, eventos, contenido multimedia, tienda y finanzas.

### 2. Alumno
Consume contenido y gestiona su propia participación: ve sus clases, confirma asistencia, gestiona recuperaciones, accede a multimedia según su nivel, ve eventos y compra merchandising.

Una persona puede tener uno o ambos roles. Si tiene ambos, debe poder cambiar entre ellos desde el menú.

---

## Niveles de la escuela

La escuela tiene **3 niveles jerárquicos**:

1. **Iniciación** (nivel base)
2. **Intermedio**
3. **Bloco** (nivel avanzado)

**Regla crítica de visibilidad de contenido multimedia:**
- Iniciación → solo ve contenido de Iniciación
- Intermedio → ve contenido de Intermedio **+ Iniciación**
- Bloco → ve contenido de Bloco **+ Intermedio + Iniciación**

Esta cascada se aplica automáticamente al subir contenido: el profesor selecciona el nivel mínimo y los superiores lo heredan.

---

## Modelo de datos (entidades principales)

### User
- `id`, `name`, `email`, `phone`, `avatarUrl`
- `role`: `'teacher' | 'student' | 'both'`
- `level`: `'iniciacion' | 'intermedio' | 'bloco'` (solo para alumnos)
- `regularClassId`: clase a la que asiste habitualmente
- `status`: `'active' | 'pending' | 'inactive'`
- `joinDate`

### ClassSchedule (clase recurrente)
- `id`, `name` (ej: "Lunes Intermedio")
- `level`: `'iniciacion' | 'intermedio' | 'bloco'`
- `dayOfWeek`, `startTime`, `endTime`, `location`
- `capacity`, `enrolledStudents[]`

### ClassSession (instancia concreta de una clase)
- `id`, `classScheduleId`, `date`
- `status`: `'scheduled' | 'in-progress' | 'completed' | 'cancelled'`
- `teacherNotes` (qué se va a trabajar)
- `attendance[]`: lista de `{ userId, status: 'present' | 'absent' | 'recovering', isRecovery }`

### RecoveryClass (clase a recuperar)
- `id`, `userId`, `originalSessionId`
- `status`: `'pending' | 'recovered' | 'expired'`
- `expiresAt` (típicamente fin del mes siguiente a la falta)
- `recoveredInSessionId` (si ya se recuperó)

### Event (evento/show)
- `id`, `title`, `description`, `coverImageUrl`
- `date`, `time`, `location`
- `levelsInvited[]`: niveles que pueden asistir
- `requiresConfirmation`: bool
- `capacity` (opcional)
- `confirmations[]`: `{ userId, status: 'going' | 'maybe' | 'declined' }`
- `status`: `'draft' | 'published' | 'past'`

### MediaContent (video/audio/PDF)
- `id`, `title`, `type`: `'video' | 'audio' | 'pdf' | 'image'`
- `folderId` (Avenida, Forrodum, Michael Jackson, Reggae, Partituras, etc.)
- `fileUrl`, `thumbnailUrl`, `durationSeconds`, `fileSize`
- `minimumLevel`: `'iniciacion' | 'intermedio' | 'bloco'`
- `teacherNotes`
- `uploadedBy`, `uploadedAt`

### Product (merchandising)
- `id`, `name`, `description`, `imageUrl`
- `price`, `stock`, `variants[]` (talles, colores)
- `status`: `'available' | 'pre-sale' | 'discontinued'`
- `availableUntil` (para pre-ventas)

### Order
- `id`, `userId`, `items[]`: `{ productId, variant, quantity, price }`
- `total`, `paymentMethod`: `'balance' | 'cash' | 'transfer'`
- `status`: `'pending' | 'paid' | 'delivered' | 'cancelled'`

### Transaction (movimiento de saldo)
- `id`, `userId`, `amount` (positivo = ingreso, negativo = cargo)
- `type`: `'monthly_fee' | 'fee_payment' | 'product_purchase' | 'adjustment'`
- `description`, `relatedClassScheduleId`, `relatedOrderId`
- `date`

---

## Reglas de negocio críticas

### Recuperación de clases
1. Cuando un alumno falta a una clase (marcado como `'absent'` por el profe en attendance), se genera automáticamente un `RecoveryClass` pendiente.
2. El alumno puede recuperar viniendo a otra clase **del mismo nivel o un nivel inferior** dentro del período de validez (típicamente hasta fin del mes siguiente).
3. Para recuperar, el alumno **confirma asistencia** a una clase disponible. Esa clase la cuenta como recuperación.
4. Cuando el profe pasa lista en esa clase, ve al alumno marcado como "Recuperando" — al confirmarlo presente, la `RecoveryClass` pasa a `'recovered'`.
5. Si la fecha de expiración pasa sin recuperar, queda como `'expired'`.

### Cuotas
1. Se cobra una cuota mensual por nivel (configurable, por defecto €40).
2. El día 1 de cada mes se genera una `Transaction` negativa por la cuota.
3. El alumno paga (en clase, Bizum, transferencia) y el profe registra el ingreso → `Transaction` positiva.
4. Saldo del alumno = suma de todas sus transacciones.
5. Si saldo < 0, aparece como "atrasado" en la vista del profe.

### Visibilidad de multimedia
- Al hacer query, filtrar `MediaContent` donde `minimumLevel` sea ≤ que el nivel del usuario en el orden Iniciación(0) < Intermedio(1) < Bloco(2).
- Mostrar contenido bloqueado de niveles superiores con icono de candado y CTA opcional "subí de nivel para acceder".

### Inscripciones nuevas
- Un alumno se puede pre-inscribir desde la app (formulario simple).
- El profe ve solicitudes pendientes en el home (badge "3 solicitudes de inscripción").
- Aprueba/rechaza, asigna nivel y clase regular.

---

## Pantallas necesarias

### Onboarding
- **Login** (email + password, branding fucsia, decoración con círculos)
- **Selector de rol** (si la persona tiene ambos)
- **Olvido de contraseña** (flujo básico)

### Profesor
- **Home**: KPIs (alumnos totales, clases/sem, ingresos del mes), clase de hoy con CTA "pasar lista", pendientes (solicitudes, cuotas atrasadas, drafts), acciones rápidas
- **Lista de alumnos**: filtros por nivel y estado, búsqueda, chips de estado de pago, tarjeta destacada para "inscripciones pendientes"
- **Ficha de alumno**: avatar, datos, KPIs (asistencias, recuperaciones, saldo), tabs (historial, pagos, notas), acciones (mensaje, subir nivel, cobrar)
- **Calendario de clases**: mini calendario mensual con puntos en días con clase, lista de próximas clases
- **Pasar lista**: lista de alumnos con botones presente/falta en vivo, contador en vivo de presentes/faltas/recuperando, indicador especial cuando alguien viene de otro nivel a recuperar
- **Eventos**: tabs (próximos / pasados / borradores), tarjetas con cover image, CTAs de editar/lista/compartir
- **Crear evento**: form con cover, título, descripción, fecha/hora, lugar, niveles invitados (multi-select), toggles (confirmación, cupo)
- **Tienda (gestión)**: resumen ventas del mes, lista de productos con stock, CTA añadir producto
- **Multimedia**: carpetas, listado de archivos recientes con filtros por nivel, CTA subir
- **Subir contenido**: dropzone, título, carpeta, **selector de nivel mínimo con explicación de la cascada**, notas, publicar
- **Finanzas**: cobrado del mes, gráfico de barras últimos 6 meses, lista de cuotas atrasadas con CTA "recordar", movimientos recientes

### Alumno
- **Home**: próxima clase con CTAs confirmar/no voy, banner de recuperaciones pendientes si las hay, carousel horizontal de multimedia nueva, tarjeta de próximo evento
- **Mis clases**: banner de recuperaciones, lista de próximas, sección "a recuperar" con marcas visuales
- **Detalle de clase**: info, notas del profe, material recomendado para repasar, CTAs voy/no voy
- **Recuperar**: header con contador de recuperaciones y fecha límite, lista de clases disponibles **filtradas por nivel** (las de nivel superior aparecen bloqueadas), explicación de cómo funciona
- **Multimedia**: chips por nivel (con candado en niveles no accesibles), grid de carpetas, lista de recientes, indicador de "nuevo"
- **Reproductor de video**: tema oscuro, frame de video con play, barra de progreso, notas del profe debajo, material relacionado
- **Eventos**: tarjetas con cover, status (voy/por confirmar), avatar stack de quienes confirmaron
- **Tienda**: grid de productos
- **Detalle de producto**: imagen grande, descripción, selector de talle/color, CTA añadir al carrito
- **Mi cuenta**: avatar, datos, **saldo y próxima cuota**, lista de movimientos, accesos rápidos (tienda, pedidos, mensajes, notificaciones), cerrar sesión

### Compartido
- **Drawer lateral**: navegación completa, perfil, ajustes, cambio de rol, cerrar sesión
- **Tab bar inferior**: 5 tabs distintos según rol

---

## Stack técnico sugerido

**Quiero algo simple, mantenible y desplegable rápido. Preferentemente:**

- **Frontend**: React + Vite, o Next.js si vamos a SSR
- **Styling**: Tailwind CSS (con config de colores custom para el fucsia y tipografías Fraunces/Jakarta)
- **Routing**: React Router (o Next routing)
- **State**: Zustand o React Context (no hace falta Redux)
- **Forms**: React Hook Form + Zod para validación
- **Iconos**: lucide-react
- **Backend**: Supabase (auth + Postgres + storage para multimedia + RLS para los permisos por nivel) — o Firebase si preferís
- **Deploy**: Vercel para el front

**Si Supabase:** aprovechar Row Level Security para implementar la regla de visibilidad de multimedia directamente en la base de datos, no solo en el cliente.

---

## Requerimientos de UX/UI

- **Mobile-first**, todo pensado para 375–430px de ancho. Que escale bien a tablet/desktop pero el caso de uso principal es móvil.
- **Cálido y con personalidad**: no es una app corporativa. Usar Fraunces para títulos y números importantes (KPIs), Jakarta Sans para texto general.
- **Color principal fucsia**: gradientes de #c2398c a #8a1f60 para headers, #a82876 para CTAs primarios. Fondos cream (#fdf6f0) para evitar el blanco frío. Acentos en otros colores solo cuando comunican estado (verde = al día/presente, ámbar = pendiente/recuperar, rosa = atrasado/falta).
- **Microinteracciones**: animaciones sutiles al cambiar de pantalla (fade + translate), hover states en cards, feedback visual al tocar botones.
- **Headers con gradiente** que se conectan al body con border-radius bottom.
- **Cards con sombras suaves** (`box-shadow: 0 6px 20px -10px rgba(112,26,77,.1)`), bordes redondeados de 18px.
- **Pills y chips** consistentes para estados (al día / pendiente / atrasado / recuperando).
- **Empty states** cuidados: dibujito + mensaje + CTA cuando una lista está vacía.

---

## Estado inicial / mock data

Para arrancar, sembrar la base con:

- 1 profesor (Jess)
- ~6 alumnos repartidos en los 3 niveles, con historias diversas (al día, atrasado, con recuperaciones pendientes)
- 3 clases regulares (Lunes Intermedio 20:10, Miércoles Iniciación 19:30, Viernes Bloco 19:00)
- ~20 sesiones de clase (algunas pasadas con asistencia registrada, algunas futuras)
- 2-3 recuperaciones pendientes
- 3 eventos (1 confirmado, 1 borrador, 1 confirmado futuro lejano)
- ~15 ítems multimedia distribuidos entre niveles, en carpetas (Avenida, Forrodum, Michael Jackson, Reggae, Partituras)
- 4 productos (camiseta, sudadera en pre-venta, baquetas, tote bag)
- Movimientos financieros de los últimos 3 meses

---

## Criterios de aceptación

1. **Login funcional** con auth real (Supabase Auth o equivalente).
2. **Roles** funcionan: cada uno ve solo sus pantallas y datos.
3. **Pasar lista funciona end-to-end**: profe marca falta → se genera RecoveryClass → alumno la ve en "a recuperar" → puede elegir clase disponible → al confirmar y ser marcado presente, la recuperación pasa a `'recovered'`.
4. **Visibilidad de multimedia respeta la cascada de niveles**, idealmente desde la base de datos (RLS).
5. **Subir multimedia** muestra al profe explícitamente el efecto de la cascada al elegir nivel mínimo.
6. **Eventos**: profe puede crear/publicar/editar; alumno puede confirmar asistencia.
7. **Saldo** se actualiza correctamente con cada transacción y se ve coherente desde profe (finanzas) y alumno (mi cuenta).
8. **Mobile-first y responsive**: probado en mobile real, no solo dev tools.
9. **Branding consistente**: fucsia + Fraunces + Jakarta + cream en todas las pantallas.
10. **Sin dependencias rotas en producción**: si usás CDN, asegurarte que funcione en navegadores in-app (Instagram, WhatsApp). Lo mejor es que todo el CSS/JS sea local (bundleado) y no depender de scripts externos en runtime.

---

## Notas adicionales

- Hay un prototipo visual previo en HTML que muestra el flujo y la estética. Cuando arranques, puedo pasártelo como referencia.
- Las copias y textos están en **español rioplatense / castellano de España** (la escuela está en Barcelona, alumnado mayormente español/latino). Mantener "vos" / "tú" coherente — preferentemente "tú" para no marcar tanto el regionalismo.
- El logo "BS" puede ser un placeholder cuadrado fucsia con las iniciales en serif. Hay un logo real que se incorporará después.

---

## Lo que NO hace falta en esta primera versión

- Chat en tiempo real entre alumnos
- Encuestas (puede venir después)
- Sistema de notificaciones push (basta con badges en la UI)
- Pasarela de pago real (los pagos se registran manualmente, son transferencia/efectivo/Bizum)
- App nativa (PWA está OK)
- Multi-tenant (es para una sola escuela, esta)

---

## Cómo quiero que arranques

1. Hacé preguntas si algo no está claro antes de tirar código.
2. Proponé la estructura de carpetas y el esquema de base de datos antes de empezar a implementar.
3. Implementá primero el setup (auth, layout base, routing, design tokens) y después los módulos por orden de prioridad: **Alumnos → Clases/Asistencia → Recuperaciones → Multimedia → Eventos → Finanzas → Tienda**.
4. Mantené componentes pequeños y reutilizables. Hacé un design system mínimo (Button, Card, Pill, Avatar, ListItem, Header, TabBar) antes de construir las pantallas.
5. Para cada pantalla, primero el layout estático con datos mock, después la integración con la base de datos.
