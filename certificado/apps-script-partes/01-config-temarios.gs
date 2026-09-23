/**
 * GENERADOR DE CERTIFICADOS — Excel con Jhony
 * =============================================
 * Vive DENTRO de un Google Sheet (Extensiones > Apps Script), no en el repo.
 * Este archivo es la copia de referencia versionada en GitHub.
 *
 * CÓMO INSTALARLO (una sola vez):
 * 1. Crea un Google Sheet nuevo, llámalo "Certificados — Excel con Jhony".
 * 2. En la primera pestaña, pon esta cabecera exacta en la fila 1:
 *    ID | Nombre | Programa | Horas | Fecha | Estado | Enlace PDF
 * 3. En "Programa" usa EXACTAMENTE uno de estos 3 textos (deben coincidir
 *    letra por letra con las claves de TEMARIOS más abajo):
 *    - Preparación Express (Entrevista de trabajo)
 *    - Excel Básico-Intermedio
 *    - Excel Avanzado (Business)
 * 4. Menú Extensiones > Apps Script. Borra el código de ejemplo y pega TODO
 *    este archivo.
 * 5. Ejecuta la función `onOpen` una vez desde el editor (▶) para autorizar
 *    los permisos (Sheets + Drive + acceso externo a internet para el QR).
 * 6. Vuelve al Sheet y recarga la página — aparecerá un menú "Certificados".
 * 7. Rellena una fila (Nombre, Programa, Horas, Fecha) SIN tocar ID/Estado/
 *    Enlace PDF, selecciona esa fila y usa Certificados > Generar
 *    certificado de la fila seleccionada.
 * 8. Para la verificación pública (QR): Implementar > Nueva implementación >
 *    Tipo "Aplicación web" > Ejecutar como "Yo" > Quién tiene acceso
 *    "Cualquier usuario". Copia la URL que te da — esa URL hay que pegarla
 *    en /verificar-certificado/index.html del repo (dímela y la actualizo).
 *
 * Nada de este archivo se ejecuta en el sitio web — es 100% Google Sheets +
 * Apps Script, tal como pediste.
 */

// ============ CONFIG ============
const SHEET_NAME = 'Hoja 1'; // cambia si tu pestaña se llama distinto
const DRIVE_FOLDER_NAME = 'Certificados emitidos — Excel con Jhony';
const COLS = { ID: 1, NOMBRE: 2, PROGRAMA: 3, HORAS: 4, FECHA: 5, ESTADO: 6, PDF: 7 };

// ============ TEMARIOS (fuente única — de los PDFs oficiales) ============
const TEMARIOS = {
  'Preparación Express (Entrevista de trabajo)': [
    { n: '01', titulo: 'Interfaz y navegación', items: ['Cinta de opciones, filas/columnas, hojas, guardar archivos', 'Nombrar rangos (cuadro de nombres)', 'Imprimir archivos'] },
    { n: '02', titulo: 'Atajos de teclado esenciales', items: ['Acciones básicas sobre celdas, filas y columnas', 'Navegación sobre los datos', 'Relleno mágico (Ctrl+E)'] },
    { n: '03', titulo: 'Formatos y tablas', items: ['Formatos de celda: número, porcentajes, decimales, bordes', 'Formatos de tabla (Ctrl+T)', 'Filtros básicos, ordenar mayor/menor', 'Formato condicional', 'Extracción de ficheros CSV (texto en columnas)'] },
    { n: '04', titulo: 'Fórmulas básicas', items: ['Suma, resta, multiplicación, división', 'Promedio, máximo, mínimo, recuento, redondear', 'Mayúsculas / minúsculas, concatenar', 'Referencias absolutas / relativas (F4)'] },
    { n: '05', titulo: 'Fórmulas clave', items: ['SI, Y / O (funciones lógicas), SI.ERROR', 'BUSCARV · BUSCARX', 'SUMAR.SI, CONTAR.SI · TEXTO · Fechas · FILTRAR'] },
    { n: '06', titulo: 'Tablas dinámicas', items: ['Creación de tablas dinámicas', 'Analizar datos con tablas dinámicas', 'Actualizar datos dinámicos'] },
    { n: '07', titulo: 'Gráficos', items: ['Tipos de gráficos y usos', 'Gráficos de 2 ejes', 'Gráficos dinámicos'] },
    { n: '08', titulo: 'Simulacros', items: ['Simulacro de entrevista de trabajo 1', 'Simulacro de entrevista de trabajo 2'] }
  ],
  'Excel Básico-Intermedio': [
    { n: '01', titulo: 'Interfaz y navegación', items: ['Cinta de opciones, filas/columnas, hojas, guardar archivos', 'Nombrar rangos (cuadro de nombres)', 'Imprimir archivos'] },
    { n: '02', titulo: 'Atajos de teclado esenciales', items: ['Acciones básicas sobre celdas, filas y columnas', 'Navegación sobre los datos', 'Relleno mágico (Ctrl+E)'] },
    { n: '03', titulo: 'Formatos y tablas', items: ['Formatos de celda: número, porcentajes, decimales, bordes', 'Filtros básicos, ordenar mayor/menor', 'Validación de datos', 'Extracción de ficheros CSV (texto en columnas)', 'Identificar y eliminar duplicados', 'Filtros de datos avanzados'] },
    { n: '04', titulo: 'Fórmulas básicas', items: ['Suma, resta, multiplicación, división', 'Promedio, máximo, mínimo, recuento, redondear', 'Mayúsculas / minúsculas, concatenar', 'Referencias absolutas / relativas (F4)'] },
    { n: '05', titulo: 'Fórmulas clave', items: ['SI, Y / O (funciones lógicas), SI.ERROR', 'BUSCARV · BUSCARX · BUSCARV avanzado', 'SUMAR.SI, CONTAR.SI · TEXTO · INDIRECTO', 'Fechas · FILTRAR'] },
    { n: '06', titulo: 'Tablas dinámicas avanzadas', items: ['Formatos de tabla (Ctrl+T) · creación de tablas dinámicas', 'Análisis con formatos condicionales y segmentaciones', 'Campos calculados · análisis comparativo', 'Actualización de datos dinámicos'] },
    { n: '07', titulo: 'Gráficos', items: ['Tipos de gráficos y usos · gráficos de 2 ejes', 'Gráficos dinámicos'] },
    { n: '08', titulo: 'Dashboard y seguridad en Excel', items: ['Metodología y construcción de un dashboard', 'Hacer que Excel parezca una app', 'Protección de hojas, rangos y libro'] }
  ],
  'Excel Avanzado (Business)': [
    { n: '01', titulo: 'Interfaz y navegación', items: ['Cinta de opciones, filas/columnas, hojas, guardar archivos', 'Nombrar rangos (cuadro de nombres)', 'Imprimir archivos'] },
    { n: '02', titulo: 'Atajos de teclado esenciales', items: ['Acciones básicas sobre celdas, filas y columnas', 'Navegación sobre los datos', 'Relleno mágico (Ctrl+E)'] },
    { n: '03', titulo: 'Formatos y tablas', items: ['Formatos de celda, validación de datos', 'Extracción de ficheros CSV (texto en columnas)', 'Filtros de datos avanzados'] },
    { n: '04', titulo: 'Fórmulas básicas', items: ['Suma, resta, multiplicación, división, potencia', 'Promedio, máximo, mínimo, k-ésimo, jerarquía', 'Recuento, redondear, concatenar', 'Referencias absolutas / relativas (F4)'] },
    { n: '05', titulo: 'Fórmulas clave', items: ['SI, Y / O, SI.ERROR', 'IZQUIERDA / DERECHA, EXTRAE, ENCONTRAR, SUSTITUIR', 'BUSCARV · BUSCARX · SUMAR.SI · CONTAR.SI', 'TEXTO · Fechas · ÚNICOS · FILTRAR'] },
    { n: '06', titulo: 'Controles y tablas dinámicas avanzadas', items: ['Controles de formulario y ActiveX', 'Creación y análisis con tablas dinámicas (formatos condicionales, segmentaciones)', 'Campos calculados · análisis comparativo'] },
    { n: '07', titulo: 'Gráficos avanzados', items: ['Gráficos de 2 ejes · cascada (Waterfall)', 'Gráfico Real vs. Objetivo', 'Cronogramas (Gantt y Timeline)', 'Gráficos interactivos con control ActiveX · gráficos dinámicos'] },
    { n: '08', titulo: 'Power Query', items: ['Concepto de ETL · importación de datos', 'Limpieza (data clean) · combinar y apilar datos', 'Extraer datos estructurados desde una página web'] },
    { n: '09', titulo: 'Business Analytics', items: ['Análisis de Pareto (80/20)', 'Punto de equilibrio (BreakEven) · CAGR', 'Plantilla de administración de sprints (Agile)'] },
    { n: '10', titulo: 'Dashboard y seguridad', items: ['Metodología y construcción de un dashboard', 'Hacer que Excel parezca una app', 'Protección de hojas, rangos y libro'] },
    { n: '11', titulo: 'IA en Excel', items: ['Integración de ChatGPT y IA en la nube con Excel', 'Framework "Create" para tareas en Excel', 'Automatizaciones con IA'] },
    { n: '12', titulo: 'Power BI', items: ['Construcción de un dashboard en Power BI'] }
  ]
};

