# Pladur Studio

Aplicación web en español para diseñar muebles de pladur en 3D. Biblioteca de 33 módulos paramétricos en seis categorías, combinables con medidas, posición, giro y acabado ajustables.

## Biblioteca de módulos

| Zona | Módulos |
| --- | --- |
| Salón | Estantería, mueble TV, nicho, mueble TV bajo, librería de cubos, estantería en L, puente superior y mesa de centro |
| Dormitorio | Armario abierto, cabecero, columna de armario, mesita de noche, cabecero con nichos y base de cama |
| Cocina | Barra, mueble bajo, mueble alto, isla y despensa |
| Baño | Mueble de lavabo, columna de baño y nicho doble |
| Trabajo | Escritorio con estantes y mesa de trabajo |
| Complementos | Banco, separador, panel libre, consola de entrada, balda flotante, encimera, pilar, zócalo y expositor escalonado |

Los muebles abiertos representan cuerpos de pladur sin puertas, cajones móviles, aparatos ni sanitarios. Las encimeras y bases de cama son volúmenes conceptuales. El catálogo incluye piezas de apoyo para componer muebles propios.

## Ejecutar

Necesitas Node.js 22.12 o superior y npm.

```sh
npm install
npm run dev
```

Abre la URL que muestra Vite. Para verificar y compilar:

```sh
npm test
npm run build
npm run preview
```

## Uso

- Pulsa un módulo de la biblioteca para añadirlo. Selecciónalo en la escena o en la lista.
- Filtra por zona o busca por nombre, descripción o categoría; la búsqueda admite palabras sin tildes. El contador indica las opciones disponibles y Ver todos limpia ambos filtros.
- Los módulos marcados como Elevado empiezan a una altura predefinida; cambia Y para colocarlos sobre otras piezas. La biblioteca se desplaza sin ocultar la búsqueda ni los elementos del proyecto.
- Ajusta medidas y posición en centímetros. Enter o salir del campo aplica el cambio.
- X = horizontal, Y = altura desde el suelo, Z = profundidad; giro alrededor de Y.
- Arrastra para orbitar, botón derecho para desplazar y rueda para zoom. En frontal/planta, arrastra para desplazar.
- Usa los controles de cotas, cuadrícula, decoración y encuadre.
- Ctrl/Cmd+Z deshace, Ctrl/Cmd+Shift+Z rehace y Supr elimina.
- Guardado automático en este navegador. Exporta JSON para tener una copia transferible; Abrir proyecto permite importarla. Importar conserva el anterior en el historial.
- Exporta CSV con el despiece geométrico y PNG con la vista actual.
- En móvil, cambia entre Catálogo, Editor 3D y Propiedades.

## Cómo se estiman los m²

Cada pieza es un volumen rectangular terminado. Su superficie bruta es `2 × (ancho×alto + ancho×fondo + alto×fondo) / 10000`, con longitudes en cm. Se suman caras y cantos de todas las piezas y se aplica la merma configurable (10 % inicialmente).

Las caras de contacto no se descuentan y los módulos no se fusionan. La decoración no se cuenta. El grosor del conjunto no es el espesor de la placa comercial. El resultado sirve para una estimación conceptual; no calcula placas, cortes optimizados, perfiles, tornillos, cargas ni estructura. El CSV contiene tamaños de volúmenes terminados, no planos de corte de placas.

## Publicar en GitHub Pages

1. Crea un repositorio en tu cuenta y sube estos archivos, incluyendo `package-lock.json` y `.github/workflows/deploy.yml`. No subas `node_modules`, `dist`, caches ni capturas de pruebas.
2. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como Source.
3. El workflow comprueba las pruebas y el build y publica al hacer push a `main`, o manualmente desde Actions. Si tu rama principal tiene otro nombre, ajusta `branches` en el workflow.
4. La URL publicada aparece en el job de despliegue y en Settings → Pages.

Vite usa base relativa `./`, compatible con el subdirectorio del repositorio. No necesita backend, claves ni servicios externos. Los datos de proyectos se guardan en el navegador de cada usuario, no en GitHub. La publicación remota requiere tu repositorio y acceso a tu cuenta; el proyecto local queda listo para ese paso.

Referencias: [despliegue estático de Vite](https://vite.dev/guide/static-deploy.html) y [configurar publicación en GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Documentación

- [PLAN.md](PLAN.md): fases, decisiones confirmadas y criterios.
- [SPECDEV.md](SPECDEV.md): arquitectura, datos, cálculo, validación y alcance.
- [VALIDACION.md](VALIDACION.md): comprobaciones realizadas y límites.

React, TypeScript, Vite, Three.js y Lucide. Assets geométricos propios generados por código. Versión 0.2; conserva el formato JSON v1 de los proyectos originales.
