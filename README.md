# colppy-e2e

Suite de tests E2E para [Colppy](https://app.colppy.com/) usando Playwright y TypeScript.

## Requisitos

- Node.js 18+
- [Playwright browsers](https://playwright.dev/docs/browsers) instalados

```bash
npm install
npx playwright install chromium
```

## Configuración

Copiá el archivo de ejemplo y completá con tus credenciales:

```bash
cp .env.example .env
```

```
COLPPY_EMAIL=tu@email.com
COLPPY_PASSWORD=tucontrasena
COLPPY_URL=https://app.colppy.com/
```

## Cómo correr los tests

```bash
# Todos los tests (recomendado — corre login y clientes en paralelo)
npm test

# Solo módulo login
npm run test:login

# Solo módulo clientes
npm run test:clientes

# Con browser visible
npm run test:headed

# Con Playwright inspector (debug paso a paso)
npm run test:debug

# Un test específico por nombre
npx playwright test --grep "puede buscar un cliente"

# Ver reporte HTML del último run
npm run report
```

## Casos de prueba

### Login (`tests/login.spec.ts`)

| Test | Descripción |
|------|-------------|
| muestra la pantalla de login | Verifica que el formulario de login es visible al ingresar a la app |
| rechaza credenciales incorrectas | Verifica que se muestra un mensaje de error con credenciales inválidas |
| login exitoso con credenciales válidas | Verifica que el usuario ingresa correctamente y sale de la pantalla de login |

### Clientes (`tests/clientes.spec.ts`)

| Test | Descripción |
|------|-------------|
| puede navegar a la sección de clientes | Verifica que el botón "Clientes" del sidebar carga la sección correctamente |
| lista de clientes se carga correctamente | Verifica que la tabla de clientes muestra al menos un registro |
| puede buscar un cliente | Verifica que el campo de búsqueda responde y la lista permanece visible |
| puede crear un nuevo cliente | Verifica que el botón "Nuevo cliente" abre el formulario de alta |
| puede ver el detalle de un cliente | Verifica que al seleccionar un cliente de la lista se carga su información |

## Notas

- Los tests de clientes hacen login una sola vez por ejecución y reutilizan el contexto de sesión entre casos.
- `login.spec.ts` y `clientes.spec.ts` corren en paralelo (2 workers).
- Se captura screenshot y video automáticamente ante cualquier fallo.
