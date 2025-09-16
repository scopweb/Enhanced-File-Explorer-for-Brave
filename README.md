# Enhanced File Explorer for Brave

Una versión adaptada y mejorada de la extensión original para mejorar la visualización de archivos locales en el navegador Brave. Versión actual: **0.1-beta**

## Características

- **Apertura automática de enlaces file://**: Al hacer clic en enlaces file://, se abren automáticamente en nuevas ventanas
- **Soporte para contenido dinámico**: Detecta enlaces file:// añadidos por JavaScript después de cargar la página
- **Rutas UNC compatibles**: Funciona con rutas de servidor como file:////servidor/carpeta/
- **Detección inteligente**: Distingue entre archivos individuales y carpetas para mostrar avisos apropiados
- **Estilos mejorados**: Interfaz visual optimizada para listados de directorios
- **Manifest V3**: Compatible con las últimas especificaciones de extensiones

## Basado en el Trabajo Original

Esta extensión es una adaptación del proyecto [Enhanced File Explorer for Chrome](https://github.com/federicobrancasi/Enhanced-File-Explorer-for-Chrome) de [federicobrancasi](https://github.com/federicobrancasi). Se han realizado modificaciones significativas para mejorar la funcionalidad y compatibilidad con Brave.

## Manual de Instalación en Brave

1.  **Descarga los archivos:**
    *   Asegúrate de tener todos los archivos de la extensión en una carpeta en tu ordenador.

2.  **Abre la página de Extensiones en Brave:**
    *   Escribe `brave://extensions` en la barra de direcciones y presiona Enter.

3.  **Activa el Modo de Desarrollador:**
    *   En la esquina superior derecha, activa el interruptor de "Modo de Desarrollador".

4.  **Carga la Extensión:**
    *   Haz clic en el botón **"Cargar descomprimida"**.
    *   Selecciona la carpeta donde guardaste los archivos de la extensión.

5.  **Habilita el Acceso a URLs de Archivo:**
    *   Una vez cargada, busca la extensión en la lista y haz clic en **"Detalles"**.
    *   Activa la opción **"Permitir acceso a URL de archivo"**. Este paso es fundamental para que la extensión pueda funcionar.

## Uso

Una vez instalada, la extensión funcionará automáticamente:

- **Enlaces dinámicos**: Detecta enlaces file:// en páginas web (como fab.jotajotape.com) y los abre en nuevas ventanas
- **Navegación local**: Mejora la visualización cuando navegas directamente a carpetas file://
- **Compatibilidad**: Funciona con rutas locales y de red (UNC)

## Resolución de Problemas

- **Los enlaces no se abren**: Verifica que "Permitir acceso a URL de archivo" esté activado
- **Para debugging**: Abre las DevTools (F12) y revisa la consola para ver mensajes de la extensión
- **Recarga requerida**: Si instalas la extensión con páginas ya abiertas, recárgalas para que funcione

¡Listo! Ahora, cuando hagas clic en enlaces file:// o navegues a carpetas locales, la extensión mejorará automáticamente la experiencia.
