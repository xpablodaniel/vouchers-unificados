# Generador de Vouchers Unificado — MAP & PC

Aplicación ligera en HTML/CSS/JavaScript para procesar un CSV de reservas y generar vouchers configurables listos para imprimir.

**Soporta dos modos:**
- **MAP** (Media Pensión) → Cena únicamente (1 comida/día)
- **PC** (Pensión Completa) → Almuerzo + Cena (2 comidas/día)

Este proyecto está pensado para uso local (en el navegador) sin backend — cargas un archivo CSV y la app muestra los vouchers filtrando y formateando los datos relevantes según el modo seleccionado.

## Contenido / objetivo

• Procesar un CSV de reservas.
• **Modo configurable** — Alternar entre MAP (Media Pensión: solo cena) y PC (Pensión Completa: almuerzo + cena).
• Normalizar el nombre del pasajero (combina nombre + apellido si aplica y convierte a MAYÚSCULAS).
• Calcular la cantidad de días (duración de estancia) y la cantidad de comidas a entregar según el modo seleccionado.
• Generar vouchers por afiliado con la información necesaria para imprimir.
• Sección de tildado configurable: imagen (legacy) o casillas HTML imprimibles.

## Estructura del proyecto

### Estructura unificada (nueva)
```
/ppj2025/
├── index.html              — Interfaz principal con toggle MAP/PC
├── src/
│   ├── app.js             — Bootstrap y APP_CONFIG
│   ├── styles.css         — Estilos unificados
│   └── lib/
│       ├── parser.js      — Parsing y normalización CSV
│       ├── business.js    — Reglas de negocio MAP vs PC
│       └── render.js      — Generación de templates HTML
├── assets/
│   ├── MapDay.png         — Imagen tildado para MAP
│   ├── JubPc2.png         — Imagen tildado para PC
│   └── suteba_logo_3.jpg  — Logo
├── pruebas_ppj.csv        — CSV ejemplo PC
├── test_processData.py    — Tests Python
└── test_processData.js    — Tests JavaScript
```

### Archivos legacy (compatibilidad)
- `Voucher_ppj.html` — Versión original PC standalone
- `jubis.js` — Script original PC
- `map_scripts_new.js` — Script original MAP
- `index_map.html` — Interfaz original MAP

> **Nota:** Este repo unifica los proyectos `vouchermap` (MAP) y `ppj2025` (PC) en una sola aplicación configurable. Los archivos legacy se mantienen por compatibilidad pero se recomienda usar `index.html` (versión unificada).

## CSV esperado (ejemplo)

La app espera un CSV con al menos las columnas (orden basado en `pruebas_ppj.csv`):

0. ID
1. Hotel
2. Habitación
3. Tipo
4. Observación
5. Plazas (cantp)
6. Voucher
7. Estado
8. Check In (formato dd/mm/YYYY)
9. Check Out (formato dd/mm/YYYY)
10. Tarifa
11. Categoría
12. DNI
13. Nombre (nombre de pila)
14. Apellido
15. Email
16. Servicios (cadena con "PENSIÓN COMPLETA", "MEDIA PENSION", "DESAYUNO", etc.)

Notas importantes sobre parsing:

- La lógica intenta combinar `fields[13]` y `fields[14]` (nombre + apellido) si el campo 14 parece un apellido válido (no contiene dígitos ni '@').
- La fecha debe venir en formato `dd/mm/YYYY` para calcular correctamente la duración de la estadía.
- El CSV actualmente se procesa con `split(',')` — esto funciona para CSVs simples. Si tu CSV contiene comas dentro de campos o comillas, usa un parser robusto (p. ej. PapaParse en el navegador).

## Lógica y comportamiento clave

- El campo `passengerName` se normaliza a MAYÚSCULAS y se combina nombre+apellido cuando corresponde.
- **Filtrado por modo:**
  - MAP: incluye registros con "MEDIA PENSION" (ignora si solo tiene "DESAYUNO")
  - PC: incluye registros con "PENSION COMPLETA"
- Se calcula `stayDuration` desde `Check In` y `Check Out` para obtener la cantidad de noches.
- **Cantidad de comidas según modo:**
  - MAP: `mealCount = plazas × duration × 1` (solo cena)
  - PC: `mealCount = plazas × duration × 2` (almuerzo + cena)
- **Sección de tildado configurable:**
  - `renderMode: 'boxes'` → Casillas HTML imprimibles (recomendado)
  - `renderMode: 'image'` → Imagen hardcodeada (legacy: MapDay.png o JubPc2.png)

## Cómo probar / ejecutar

**Uso en el navegador (versión unificada — RECOMENDADO):**

1. Abre `index.html` en tu navegador (doble click o arrastra el archivo al navegador).
2. Selecciona el modo deseado usando los botones:
   - **MAP (Cena)** — Para vouchers de Media Pensión
   - **PC (Almuerzo + Cena)** — Para vouchers de Pensión Completa
3. Haz click en "📁 Cargar Archivo CSV" y selecciona tu CSV.
4. La app mostrará los vouchers filtrados según el modo; usa el botón "🖨️ Imprimir" para obtener la versión imprimible.

**Configuración avanzada:**

Puedes editar `src/app.js` para cambiar valores por defecto:
```javascript
const APP_CONFIG = {
  mode: 'PC',              // Modo inicial: 'PC' o 'MAP'
  renderMode: 'boxes',     // 'boxes' (casillas HTML) o 'image' (PNG)
  // ... más opciones
}
```

**Versiones legacy (compatibilidad):**
- Para solo PC: abre `Voucher_ppj.html`
- Para solo MAP: abre `index_map.html`

Ejecutar pruebas locales (Python):

```bash
# Con Python del sistema
python3 test_processData.py
```

Ejecutar pruebas locales (Node.js — opcional):

```bash
node test_processData.js
```

## Limitaciones conocidas y sugerencias de mejora

1. Mejorar el parser CSV: `split(',')` puede fallar con comas y comillas en campos — usar PapaParse.
2. Validaciones más robustas (fechas, DNI, cantidad de plazas, formatos inesperados).
3. Añadir tests automatizados y CI (pytest o Mocha/Jest según el caso).
4. Interfaz: validar y mostrar mensajes de error al usuario cuando el CSV no tenga el formato esperado.

## Licencia / Contacto

A decidir por el autor del repo. Para preguntas o cambios, abre un issue o contáctame vía GitHub.
