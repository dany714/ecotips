# Eco Tips - Marco Normativo y Documentación Técnica Integral

El presente documento expone de forma detallada las directrices técnicas, jurisdiccionales y metodológicas que fundamentan el desarrollo, estructuración e investigación aplicada de la plataforma "Eco Tips".

---

## ÍNDICE

1. [Estándares de Calidad de Software (Familia ISO/IEC)](#1-estándares-de-calidad-de-software-familia-isoiec)
2. [Accesibilidad y Desarrollo Web (W3C)](#2-accesibilidad-y-desarrollo-web-w3c)
3. [Marco Jurisdiccional de Privacidad (Ley del Edo. de Puebla)](#3-marco-jurisdiccional-de-privacidad-ley-del-edo-de-puebla)
4. [Metodología de Investigación (Tecnológica y Cuantitativa)](#4-metodología-de-investigación-tecnológica-y-cuantitativa)

---

## 1. Estándares de Calidad de Software (Familia ISO/IEC)

La ingeniería detrás de **Eco Tips** adopta las mejores prácticas estandarizadas a nivel global para asegurar un ciclo de vida óptimo, fiabilidad de sistemas y blindaje de la información.

### ISO/IEC 25010: Modelos de Calidad de Software
Evalúa las propiedades que determinan el rendimiento de un de software. Eco Tips cumple específicamente con:
- **Adecuación Funcional:** El sistema satisface necesidades explícitas (Publicación, Eliminación, Reporte de malos usos) con un alto grado de rigor.
- **Usabilidad:** La interfaz emuladora de "Post-Its" provee una arquitectura estética atractiva que acelera la curva de aprendizaje del usuario (Learnability) previniendo a su vez errores humanos en la inserción de datos.
- **Eficiencia de Desempeño:** Su comportamiento en ambientes *Single Page Application* (SPA-React) permite respuestas menores a 100 milisegundos por carga, con carga progresiva de servidor de base de datos dinámica.

### ISO/IEC 12207: Ciclo de Vida del Software
La plataforma ha sido ejecutada en etapas sistémicas transparentes:
- **Procesos Primarios:** Diseño modular por componentes reutilizables (*TipCard*, *Modals*, *Context*) permitiendo fácil mantenimiento y refactorización futura.
- **Procesos Relacionados con el Proyecto:** Planificación iterativa centrada en refinamiento escalonado (integración progresiva desde CSS hasta Firebase Firestore y Authentication).

### ISO/IEC 27001: Gestión de la Seguridad de la Información (SGSI)
Salvaguarda un modelo elemental de confidencialidad aplicando la Triada CIA:
- **Confidencialidad:** Restricción absoluta a la edición o eliminación de registros ajenos y datos ocultos en perfiles aislados.
- **Integridad:** Las iteraciones en Firestore restringen inyecciones dañinas mediante reglas nativas, asegurando que solo el dueño del documento o administradores puedan incidir.
- **Disponibilidad:** Dependencia en infraestructura tolerante a fallos (Google Cloud Platform) para disponibilidad asíncrona continua de interacciones 24/7.

--- 

## 2. Accesibilidad y Desarrollo Web (W3C)

La plataforma opera bajo el protocolo estandarizado de la **World Wide Web Consortium (W3C)**, rigiéndose específicamente bajo las WCAG (Web Content Accessibility Guidelines).

### Semántica y Estructura
- Uso estricto de elementos HTML5 puros (`<nav>`, `<main>`, `<section>`, `<footer>`) para asistir sin margen a error a los motores de búsqueda (SEO) y lectores de pantalla.
- Implementación de Etiquetas `aria-label` en botones gráficos (*Fabric Action Buttons*, íconos de cerrado y "Likes") posibilitando descripciones claras de acciones interactivas para usuarios con diversidad funcional.

### Contraste Visual y Operatividad
- Esquema cromático con legibilidad balanceada en sus fuentes (Familias *Inter*) y fondos suavizados que garantizan relaciones de contraste sobre 4.5:1 exigido para textos estándar.
- Controles de UI completamente adaptables (Responsive Design) gestionando dinámicamente comportamientos entre un dispositivo táctil y comandos de teclado o click en ordenador portátil.

---

## 3. Marco Jurisdiccional de Privacidad (Ley del Edo. de Puebla)

Eco Tips detenta un cumplimiento ético y cívico para el amparo legal de los usuarios bajo el esquema delineado en la **Ley de Protección de Datos Personales en Posesión de Sujetos Obligados del Estado de Puebla**, con observancia de preceptos técnicos aplicables en implementaciones privadas/académicas.

### Disposiciones de Tratamiento (Capítulo II)
La recopilación de información en plataformas conectadas está acotada restrictivamente a la **concientización, tabulación de interés ambiental colectivo y uso recreativo-académico**, invalidando enajenaciones o venta a consocios externos al ser una red enfocada en la sustentabilidad. 

### Principios Básicos de Almacenamiento
Al estar gestionado en los clústers certificados del sistema de base de datos Firebase, se otorgan garantías técnicas de cifrado perimetral (Encryption at Rest) salvaguardando perfiles anónimos o identificables frente a fugas masivas, cumpliendo la obligación de integridad del Título Segundo.

### Garantía de Derechos ARCO
A través del Panel Analítico e Interfaz del Usuario, la plataforma automatiza un acceso libre y perpetuo a las prerrogativas jurisdiccionales:
1. **(A)cceso:** El usuario goza de tableros de lectura transparentes sobre todo el rastro dejado en la aplicación.
2. **(R)ectificación:** Toda aportación al foro ostenta capacidades modificables íntegras ("Editar Tip") de tiempo libre.
3. **(C)ancelación:** El usuario tiene total autonomía para borrar sus registros, anulando toda instancia del documento de la memoria.
4. **(O)posición:** La red cuenta con reglas que restringen visualizaciones mediante filtros severos frente a reportes anónimos (10 incidencias provocan suspensión cautelar preventiva), protegiendo la paz mental y reputacional del ambiente comunitario.

---

## 4. Metodología de Investigación (Tecnológica y Cuantitativa)

Eco Tips no es solamente un repositorio de notas; es una herramienta analítica activa. El modelado sistémico para su análisis es una Investigación Aplicada con Enfoque Cuantitativo.

### 4.1. Investigación Aplicada / Tecnológica
La premisa rectora del ciclo no fue únicamente la observación antropológica sino la resolución específica de un problema mediante la tecnología (Facilitar un tejido social ambientalista local y rastreable).
Sus fases de investigación fueron:
1. **Aprehensión Cognoscitiva (Diagnóstico):** Identificación de la brecha comunicativa y motivación reducida en ámbitos de ecología práctica comunitaria y local.
2. **Fase Creativa / Diseño:** Esbozo de una solución proactiva que adoptara una interfaz amigable ("Post-It") que incentivara el aporte relajado pero centralizado y tabulable (Desarrollo Frontend React).
3. **Fase Constructiva (Implementación):** Producción y empaquetamiento estricto del circuito codificado (Vite/Firebase) garantizando disponibilidad real.
4. **Fase Evaluativa (Validación):** Etapa operativa donde el proyecto corre en simuladores vivos y produce los registros requeridos para la optimización final.

### 4.2. Enfoque Metodológico Cuantitativo
El sistema constituye una terminal de recolección algorítmica y determinista de datos conductuales pro-ecológicos, lo cual reemplaza las evaluaciones especulativas (como encuestas manuales limitadas) por métricas infalibles de una cohorte en tiempo real. 

**Operacionalización y Uso de Variables:**
- **Variables Independientes (Controlables):** Subdivisión categórica sectorizada del interés ecológico (Naturaleza, Reciclaje, Residuos, Energía).
- **Variables Dependientes (De Satisfacción y Frecuencia):**
  - **Uso Comunitario:** Ratio de conteo de publicaciones por usuario frente al tiempo invertido (Time-series).
  - **Nivel de Satisfacción / Popularidad:** Tabulación rígida del sistema de votaciones positivas absolutas ("Likes" y doble toque) otorgando el sesgo tendencial del foro (Qué categoría atrae más aprecio del ciudadano).
  - **Calificación por Penalidad:** Medición de incidencias normativas según la densidad en reportes presentados a los moderadores ("ReportsCount") para depurar correlaciones y ruido en los resultados finales.
