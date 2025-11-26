# Guía de Migración Rápida — Proyecto Unificado

## ✅ Qué se implementó

### Estructura nueva
- `index.html` — Interfaz unificada con toggle MAP/PC
- `src/app.js` — Configuración y bootstrap (APP_CONFIG)
- `src/lib/parser.js` — Parsing CSV compartido
- `src/lib/business.js` — Reglas de negocio MAP vs PC
- `src/lib/render.js` — Generación de vouchers
- `src/styles.css` — Estilos unificados con soporte print
- `assets/` — Imágenes organizadas (MapDay.png, JubPc2.png, logos)

### Archivos legacy preservados
- `Voucher_ppj.html` — Versión standalone PC (original)
- `jubis.js` — Script PC original
- `index_map.html` + `map_scripts_new.js` — Versión standalone MAP (desde vouchermap)

## 🚀 Cómo probar ahora

1. **Abrir interfaz unificada:**
   ```bash
   # En tu navegador, abre:
   file:///mnt/c/Users/xpabl/OneDrive/Escritorio/ppj2025/index.html
   ```

2. **Probar modo PC (Pensión Completa):**
   - Click en botón "PC (Almuerzo + Cena)"
   - Cargar `pruebas_ppj.csv`
   - Verificar que muestra vouchers con 2 comidas/día

3. **Probar modo MAP (Media Pensión):**
   - Click en botón "MAP (Cena)"
   - Cargar CSV con registros que tengan "MEDIA PENSION" en servicios
   - Verificar que muestra vouchers con 1 comida/día

4. **Verificar impresión:**
   - Click en "🖨️ Imprimir"
   - Revisar print preview: debe ocultar header y mostrar casillas de tildado grandes

## ⚙️ Configuración personalizada

Editar `src/app.js` líneas 3-18:

```javascript
const APP_CONFIG = {
  mode: 'PC',                    // Cambiar a 'MAP' si quieres default MAP
  renderMode: 'boxes',           // 'boxes' o 'image'
  imageForTildes: {
    MAP: 'assets/MapDay.png',    // Cambiar ruta si mueves imágenes
    PC: 'assets/JubPc2.png'
  },
  mealMultiplier: {
    MAP: 1,
    PC: 2
  },
  serviceLookup: {
    MAP: 'MEDIA PENSION',        // Cambiar texto si tu CSV usa otro
    PC: 'PENSION COMPLETA'
  }
};
```

## 🧪 Tests pendientes

1. **Validar con CSVs reales:**
   - Probar con `pruebas_ppj.csv` (PC)
   - Conseguir CSV con "MEDIA PENSION" para probar MAP
   - Verificar edge cases (nombres sin apellido, fechas, etc.)

2. **Ejecutar tests existentes:**
   ```bash
   # Python
   python3 test_processData.py
   
   # Node.js
   node test_processData.js
   ```

3. **Actualizar tests para modo unificado:**
   - Los tests actuales solo cubren un modo cada uno
   - Crear `test_unified.js` que pruebe ambos modos

## 📋 Próximos pasos sugeridos

1. **Testing visual:**
   - [ ] Abrir `index.html` y probar toggle MAP/PC
   - [ ] Cargar CSVs y verificar output
   - [ ] Print preview con ambos modos

2. **Ajustes finos:**
   - [ ] Revisar estilos de casillas HTML (tamaño, color)
   - [ ] Validar CSS de impresión en Chrome y Firefox
   - [ ] Añadir validaciones de CSV (campos faltantes, formatos)

3. **Documentación:**
   - [ ] Actualizar `test_processData.js/py` con ejemplos MAP
   - [ ] Crear screencast/GIF mostrando toggle funcionando
   - [ ] Documentar migración para usuarios de repos legacy

4. **Git:**
   - [ ] Revisar `git status`
   - [ ] Stage y commit cambios
   - [ ] Opcional: crear branch `unify-vouchers` para testing

## 🔧 Troubleshooting

**Problema:** No se cargan los scripts
- **Solución:** Verificar rutas en `index.html` (deben ser relativas: `src/app.js`)

**Problema:** Imágenes no se ven
- **Solución:** Verificar que `assets/` tiene MapDay.png y JubPc2.png

**Problema:** Toggle no funciona
- **Solución:** Abrir consola del navegador (F12) y revisar errores JavaScript

**Problema:** No filtra correctamente según modo
- **Solución:** Revisar campo "Servicios" en CSV (debe contener "MEDIA PENSION" o "PENSION COMPLETA")

## 📞 Soporte

Si encuentras errores o necesitas ajustes, revisa:
1. Consola del navegador (F12 → Console)
2. `UNIFY_PROPOSAL.md` — Plan de implementación completo
3. `README.md` — Documentación actualizada
