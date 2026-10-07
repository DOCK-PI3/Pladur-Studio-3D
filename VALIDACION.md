# Verificación de Pladur Studio 0.2

Fecha: 7 de octubre de 2026.

## Comprobaciones automáticas

`npm test`: 9 pruebas aprobadas, 0 fallos.

- Conversión de cm² a m² usando las seis caras de cada pieza.
- Geometría positiva y validación de módulos en tamaños límite de 10, 100 y 1000 cm, con distintas cantidades de baldas.
- Ausencia de solapes de volumen entre paneles del mismo módulo; incluye medidas asimétricas con 10 y 1000 cm en distintos ejes.
- Los 33 módulos tienen identificadores únicos y generan geometría contenida en sus medidas por defecto; seis categorías y alturas iniciales verificadas.
- Los nueve tipos originales conservan el formato de proyecto y se verifica el guardado/reapertura del catálogo completo.
- Aplicación de merma y estimación de proyecto vacío.
- Envolvente con rotación, elevación y traslación.
- Importación: tipos, límites, ids duplicados, versión, NaN, acabados y número de módulos.
- CSV: escapado, unidades, decimales españoles y neutralización de nombres que podrían interpretarse como fórmulas.

`npm run build`: TypeScript y Vite completados; archivos estáticos en `dist/`. Referencias a JS, CSS y favicon relativas. Paquetes de Three.js y React separados.

## Navegador

Recorridos base de la versión 0.1 ejecutados con Playwright en Chrome sobre la compilación de producción local:

- Edición de ancho, selección en lista, acabado, duplicado, deshacer y rehacer.
- Selección directa de una estantería por clic en su geometría 3D; desplazamiento con arrastre en vista frontal.
- Merma, vista frontal y persistencia al recargar.
- Descargas reales de JSON, CSV y PNG.
- Proyecto vacío y reapertura del archivo JSON con igualdad de datos.
- Archivo incompatible rechazado, conservando el proyecto activo.
- Añadir los nueve módulos y exportarlos/importarlos, incluido el panel libre de 8 cm de fondo.
- Entrada decimal con coma; restauración del campo ante texto inválido.
- Supr para eliminar y Ctrl+Z para recuperar.
- Cargar la composición de ejemplo.
- Tamaño móvil 390 × 844: navegación entre paneles, filtro de dormitorio, añadir armario, dimensiones, giro, mediciones, planta y 3D. Sin desbordamiento horizontal.
- Botón Exportar visible y con nombre accesible también cuando se muestra solo su icono en móvil.
- Revisión visual de capturas de escritorio 1440 × 960 y tamaño móvil.
- Consola al terminar los recorridos: 0 errores y 0 advertencias.

Capturas y archivos de prueba en `output/playwright/` (excluidos de Git).

## Recorridos de la ampliación 0.2

- Catálogo con 33 entradas, categorías por zona, búsqueda por nombre/descripción/categoría y búsqueda «bano» sin tilde.
- Filtro vacío y Ver todos; cabecera de búsqueda y lista del proyecto visibles al recorrer las miniaturas.
- Añadir los 33 tipos de módulo desde la interfaz, exportarlos a JSON e importarlos conservando los datos.
- Abrir un archivo real exportado por la versión 0.1, con sus cuatro módulos.
- Composición nueva con estantería en L, escritorio con estantes, balda flotante y expositor escalonado; editar posición, baldas y medidas; consultar los m².
- Balda flotante de 4 cm de altura y encimera de 6 cm: límites específicos de las piezas horizontales y propiedades sin grosor estructural redundante.
- Escritorio y estantería en L con controles de baldas específicos.
- Chrome 390 × 844: filtrar cocina, buscar encimera, añadir mueble alto con Y=145 cm, editar baldas/acabado, consultar mediciones y persistir los cambios al recargar. Sin desbordamiento horizontal.
- Al añadir desde la vista Mediciones, el módulo nuevo activa Propiedades, tanto en escritorio como en móvil.
- Revisión visual de catálogo de escritorio, catálogo móvil y composición de nuevos muebles. Capturas `catalog-v2-desktop.png`, `catalog-v2-mobile.png` y `catalog-v2-composition.png`.
- Compilación de producción correcta. Consola: 0 errores y 0 advertencias al terminar los recorridos.

## Límites de esta verificación

No se ha ejecutado la publicación remota en GitHub: todavía no hay repositorio ni acceso indicado por el usuario. Workflow e instrucciones están preparados. La adaptación móvil se comprobó en un viewport de Chrome; no en dispositivos físicos, Safari ni Firefox.

Las superficies son brutas y no descuentan caras de contacto. El editor permite superponer módulos diferentes. No hay planos constructivos, arrastre/encaje de módulos, optimización de placas, presupuesto ni cálculo estructural en esta versión.
