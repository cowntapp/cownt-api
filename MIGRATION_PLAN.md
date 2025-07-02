# 🐄 Plan de Migración - Feature Cow a Arquitectura AppError

## 📋 Resumen

Migrar la feature Cow desde `CustomError` hacia la arquitectura estandarizada usando `AppError`, `appAssert`, `catchErrors` y manejo centralizado de errores.

---

## 🎯 Fase 1: Preparación - AppErrorCode

### ☑️ Expandir códigos de error

- [x] Agregar códigos de error específicos para Cow en `src/lib/constants/appErrorCode.ts`:

  ```typescript
  const enum AppErrorCode {
    // Auth errors
    InvalidAccessToken = 'InvalidAccessToken',
    InvalidRefreshToken = 'InvalidRefreshToken',

    // Cow errors
    CowAlreadyExists = 'CowAlreadyExists',
    CowNotFound = 'CowNotFound',

    // Breed errors
    BreedAlreadyExists = 'BreedAlreadyExists',
    BreedNotFound = 'BreedNotFound',

    // Characteristic errors
    CharacteristicAlreadyExists = 'CharacteristicAlreadyExists',
    CharacteristicNotFound = 'CharacteristicNotFound',

    // Business logic errors
    MotherNotFound = 'MotherNotFound',
    InvalidCowOrigin = 'InvalidCowOrigin',
    InvalidBreedOrCharacteristic = 'InvalidBreedOrCharacteristic',
  }
  ```

---

## 🔧 Fase 2: Migración de Services

### ☑️ Cow Methods

- [x] **createCow.ts** - Migrar CustomError → AppError/appAssert

  ```typescript
  // Reemplazar:
  throw new CustomError({
    message: 'Cow already exists',
    statusCode: 409,
    status: 'Conflict',
  });

  // Por:
  appAssert(
    !cowExists,
    CONFLICT,
    'Cow already exists',
    AppErrorCode.CowAlreadyExists
  );
  ```

- [ ] **getAllCows.ts** - Migrar validaciones y errores
- [ ] **getCowById.ts** - Cambiar CustomError por AppError
- [ ] **updateCow.ts** - Migrar validaciones de existencia
- [ ] **deleteCow.ts** - Cambiar manejo de errores
- [ ] **getCowsWithStatistics.ts** - Migrar si tiene CustomError

### ☑️ Breed Methods

- [ ] **createBreed.ts** - Migrar CustomError → AppError
- [ ] **getAllBreeds.ts** - Revisar manejo de errores
- [ ] **updateBreed.ts** - Cambiar validaciones
- [ ] **deleteBreed.ts** - Migrar CustomError

### ☑️ Characteristic Methods

- [ ] **createCharacteristic.ts** - Migrar CustomError → AppError
- [ ] **getAllCharacteristics.ts** - Revisar manejo de errores
- [ ] **updateCharacteristic.ts** - Cambiar validaciones
- [ ] **deleteCharacteristic.ts** - Migrar CustomError

### ☑️ Imports en Services

- [ ] Agregar import de `appAssert` en todos los services:
  ```typescript
  import appAssert from '../../../../../lib/utils/appAssert';
  ```
- [ ] Agregar import de constantes HTTP:
  ```typescript
  import {
    CONFLICT,
    NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
  } from '../../../../../lib/constants/http';
  ```
- [ ] Agregar import de AppErrorCode:
  ```typescript
  import AppErrorCode from '../../../../../lib/constants/appErrorCode';
  ```
- [ ] Remover imports de CustomError de todos los services

---

## 🎮 Fase 3: Migración de Controllers

### ☑️ Cow Controller Methods

- [ ] **createCow.ts** - Wrappear con catchErrors + limpiar try/catch

  ```typescript
  // Cambiar de:
  export async function createCow(req: Request, res: Response) {
    try {
      // validación y lógica
    } catch (error) {
      // manejo manual
    }
  }

  // A:
  export const createCow = catchErrors(async (req: Request, res: Response) => {
    const cowData = createCowSchema.parse(req.body);
    const newCow = await cowService.createCow(cowData);
    res.status(CREATED).json(newCow);
    return;
  });
  ```

- [ ] **getAllCows.ts** - Aplicar patrón catchErrors
- [ ] **getCowById.ts** - Simplificar con catchErrors
- [ ] **updateCow.ts** - Migrar a nueva arquitectura
- [ ] **deleteCow.ts** - Aplicar catchErrors
- [ ] **getCowsWithStatistics.ts** - Migrar si es necesario

### ☑️ Breed Controller Methods

- [ ] **createBreed.ts** - Wrappear con catchErrors
- [ ] **getAllBreeds.ts** - Aplicar patrón
- [ ] **updateBreed.ts** - Migrar a catchErrors
- [ ] **deleteBreed.ts** - Simplificar con catchErrors

### ☑️ Characteristic Controller Methods

- [ ] **createCharacteristic.ts** - Wrappear con catchErrors
- [ ] **getAllCharacteristics.ts** - Aplicar patrón
- [ ] **updateCharacteristic.ts** - Migrar a catchErrors
- [ ] **deleteCharacteristic.ts** - Simplificar con catchErrors

### ☑️ Imports en Controllers

- [ ] Agregar import de `catchErrors` en todos los controllers:
  ```typescript
  import catchErrors from '../../../../../lib/utils/catchErrors';
  ```
- [ ] Agregar import de constantes HTTP:
  ```typescript
  import { OK, CREATED, NO_CONTENT } from '../../../../../lib/constants/http';
  ```
- [ ] Remover imports no utilizados (ZodError, manejo manual de errores)

---

## 🧹 Fase 4: Limpieza y Validación

### ☑️ Eliminar CustomError

- [ ] Eliminar archivo `src/errors/customError.ts`
- [ ] Buscar y remover todos los imports de CustomError restantes:
  ```bash
  grep -r "CustomError" src/
  ```

### ☑️ Actualizar Controller Principal

- [ ] Verificar que `src/features/animals/cow/controller/cow.controller.ts` exporte correctamente todos los métodos migrados

### ☑️ Actualizar Service Principal

- [ ] Verificar que `src/features/animals/cow/service/cow.service.ts` exporte correctamente todos los métodos migrados

### ☑️ Validación de Schemas

- [ ] Revisar que todos los schemas de Zod estén completos en `src/features/animals/cow/validation/cow.schemas.ts`
- [ ] Asegurar que cubran todos los casos de validación necesarios

---

## 🧪 Fase 5: Testing y Verificación

### ☑️ Pruebas Funcionales

- [ ] **Cow Endpoints:**

  - [ ] `POST /cows` - Crear vaca
  - [ ] `GET /cows` - Listar vacas
  - [ ] `GET /cows/:id` - Obtener vaca por ID
  - [ ] `PUT /cows/:id` - Actualizar vaca
  - [ ] `DELETE /cows/:id` - Eliminar vaca
  - [ ] `GET /cows/statistics` - Estadísticas de vacas

- [ ] **Breed Endpoints:**

  - [ ] `POST /cows/breeds` - Crear raza
  - [ ] `GET /cows/breeds` - Listar razas
  - [ ] `PUT /cows/breeds/:id` - Actualizar raza
  - [ ] `DELETE /cows/breeds/:id` - Eliminar raza

- [ ] **Characteristic Endpoints:**
  - [ ] `POST /cows/characteristics` - Crear característica
  - [ ] `GET /cows/characteristics` - Listar características
  - [ ] `PUT /cows/characteristics/:id` - Actualizar característica
  - [ ] `DELETE /cows/characteristics/:id` - Eliminar característica

### ☑️ Pruebas de Errores

- [ ] Verificar que errores de validación (Zod) se manejen correctamente
- [ ] Verificar que errores de negocio (AppError) se manejen correctamente
- [ ] Confirmar que las respuestas HTTP sean consistentes
- [ ] Validar que los códigos de error específicos se retornen correctamente

### ☑️ Verificación de Logs

- [ ] Confirmar que los errores se logueen correctamente en el errorHandler
- [ ] Verificar que no haya errores no manejados en consola

---

## 📚 Fase 6: Documentación

### ☑️ Actualizar Documentación

- [ ] Actualizar Postman collection si existe con nuevos códigos de error
- [ ] Documentar nuevos AppErrorCode en README o docs
- [ ] Actualizar cualquier documentación de API que referencie códigos de error

### ☑️ Code Review

- [ ] Revisar que todos los archivos sigan el mismo patrón
- [ ] Confirmar que no queden restos de CustomError
- [ ] Validar que imports estén organizados correctamente

---

## 🎉 Finalización

### ☑️ Cleanup Final

- [ ] Remover comentarios TODO relacionados con migración
- [ ] Verificar que no haya console.log temporales
- [ ] Confirmar que todos los tests pasen

### ☑️ Deploy Preparation

- [ ] Crear PR con todos los cambios
- [ ] Validar en ambiente de desarrollo
- [ ] Preparar notas de release si es necesario

---

## 📝 Notas Importantes

### 🔄 Patrón de Migración Consistente:

**Controllers:**

```typescript
export const methodName = catchErrors(async (req: Request, res: Response) => {
  const data = schema.parse(req.body); // o req.params
  const result = await service.methodName(data);
  res.status(HTTP_CODE).json(result);
  return;
});
```

**Services:**

```typescript
// Validaciones con appAssert
appAssert(condition, HTTP_CODE, 'message', AppErrorCode.SPECIFIC_ERROR);

// O directamente AppError si no es validación
throw new AppError(HTTP_CODE, 'message', AppErrorCode.SPECIFIC_ERROR);
```

### ⚠️ Consideraciones:

- Mantener compatibilidad durante migración
- Probar cada endpoint después de migrar
- Verificar que frontend no se rompa con cambios de respuesta
- Mantener consistencia en mensajes de error
