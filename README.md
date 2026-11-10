# TP Integrador · Segundo Parcial — Python para Ciencia de Datos (UADE)

Trabajo práctico integrador de la materia **Python para Ciencia de Datos** (Licenciatura en Ciencias de Datos e IA, UADE). Modalidad grupal. Se entrega el notebook `.ipynb` junto con el dataset.

Consigna completa: [TP Integrador · Segundo parcial.docx](<TP Integrador · Segundo parcial.docx>).

## Integrantes

- Tananta Tananta Katherine
- Carrizo Juan Pablo
- Pasta Francisco Agustín
- Cirillo Matías Alejandro

## Pregunta

¿Podemos predecir el **rendimiento académico (`cgpa`)** de un/a estudiante a partir de sus hábitos de sueño, su uso de pantallas y otras variables de estilo de vida (estudio semanal, asistencia, cafeína, ejercicio, etc.)?

Es un problema de **regresión**: `cgpa` es numérica continua, en escala de 0 a 4.

## Dataset

[Student Sleep, Screen Time & Academic Performance](https://www.kaggle.com/datasets/aamir28/student-sleep-screen-time-and-academic-performance) (Kaggle).

- 500 estudiantes y 25 columnas, con variables numéricas (horas de sueño, uso de pantallas, asistencia, horas de estudio, `cgpa`, etc.) y categóricas (género, carrera, tipo de residencia, cronotipo, dispositivo principal, etc.).
- Son **datos sintéticos**: según la descripción del autor en Kaggle, los registros fueron generados y no corresponden a estudiantes reales. Licencia CC0 (dominio público).
- No tiene columnas de fecha, así que no corresponde una serie de tiempo.
- Archivo: [data/student_sleep_screen_time_academic_performance.csv](data/student_sleep_screen_time_academic_performance.csv).

## Cómo obtener el dataset

**El CSV ya viene incluido en el repositorio**, en la carpeta `data/`. Si clonaste el repositorio (ver [Cómo correrlo](#cómo-correrlo)), no hace falta descargar nada.

Si necesitás descargarlo de nuevo desde Kaggle, hay dos opciones. En las dos, el archivo tiene que quedar en `data/` con el nombre exacto `student_sleep_screen_time_academic_performance.csv`, porque el notebook lo busca así.

### Opción A: descarga manual

1. Entrar a la [página del dataset en Kaggle](https://www.kaggle.com/datasets/aamir28/student-sleep-screen-time-and-academic-performance) y apretar **Download** (puede pedir iniciar sesión).
2. Se descarga un `.zip`: descomprimirlo.
3. Copiar `student_sleep_screen_time_academic_performance.csv` a la carpeta `data/` del repositorio.

### Opción B: con Python (`kagglehub`)

No hace falta cuenta de Kaggle, porque el dataset es público. Con el entorno virtual activo, desde la carpeta del repositorio:

```bash
pip install kagglehub
```

Guardar este script como un archivo `.py` en la carpeta del repositorio (o pegarlo en una celda) y ejecutarlo:

```python
import shutil
from pathlib import Path

import kagglehub

# Solo si aparece el error CERTIFICATE_VERIFY_FAILED (ver "Problemas comunes"):
# import truststore; truststore.inject_into_ssl()

DATASET = "aamir28/student-sleep-screen-time-and-academic-performance"
ARCHIVO = "student_sleep_screen_time_academic_performance.csv"

# Descarga el dataset a la caché de kagglehub y devuelve la carpeta
carpeta = kagglehub.dataset_download(DATASET)

# Copia el CSV a data/, donde lo busca el notebook
Path("data").mkdir(exist_ok=True)
shutil.copy(Path(carpeta) / ARCHIVO, Path("data") / ARCHIVO)
print(f"CSV copiado en data/{ARCHIVO}")
```

> **Ojo con el script que muestra Kaggle en el botón *Code*:** trae `file_path = ""` y así falla. Si se quiere usar ese script, hay que completar `file_path = "student_sleep_screen_time_academic_performance.csv"` (y para esa variante se instala `pip install "kagglehub[pandas-datasets]"`).

### Problemas comunes

| Error | Causa | Solución |
|---|---|---|
| `ValueError: Unsupported file extension: ''` | Se usó el script de Kaggle con `file_path` vacío | Completar `file_path` con el nombre del CSV (ver arriba) |
| `SSLError ... CERTIFICATE_VERIFY_FAILED` | Red corporativa con un proxy que intercepta HTTPS: Python no confía en su certificado | `pip install truststore` y descomentar la línea `import truststore; truststore.inject_into_ssl()` al principio del script, para que Python use los certificados de Windows |
| `FileNotFoundError` al ejecutar el notebook | El CSV no está en `data/` o tiene otro nombre | Revisar que exista `data/student_sleep_screen_time_academic_performance.csv` |

## Contenido del notebook

Todo el trabajo está en [TP_Integrador.ipynb](TP_Integrador.ipynb):

| Sección | Contenido |
|---|---|
| 1. Carga y calidad | Diccionario de columnas, tipos de datos, nulos, duplicados, valores imposibles y outliers, con la decisión tomada en cada caso y su justificación: unificación de `gender`, acotado de `weekly_study_hours`, hora de acostarse tratada como variable circular y caso extremo de 19.5 h de pantalla documentado. Cierra con una tabla resumen (1.7). |
| 2. EDA univariado | Estadística descriptiva, histogramas, boxplots y countplots. |
| 3. EDA bivariado | Mapa de calor de correlación, scatterplots contra `cgpa`, `cgpa` según variables categóricas y agregación por cronotipo. |
| 4. Agregaciones | `groupby` + `agg` con barplots: `cgpa` según horas de sueño y según carrera. |
| 5. Modelo | Variables elegidas con una regla explícita (\|r\| ≥ 0.20 con `cgpa`, más hora de acostarse en seno/coseno y cronotipo) y una comparación por validación cruzada sobre train entre la lista con pantalla, la lista sin pantalla y la lista usada antes de aplicar la regla. Regresión lineal y KNN regressor dentro de un `Pipeline` (imputación + escalado); en el KNN, `GridSearchCV` con validación cruzada de 5 partes elige la cantidad de vecinos (`n_neighbors`), la ponderación (`weights`) y la distancia (`p`). Ambos se comparan contra un baseline (la media) con RMSE, MAE, MAPE y R², más un gráfico real vs predicho y el error medio según el nivel de `cgpa`. Incluye la función `predecir_cgpa` para estimar el `cgpa` de estudiantes nuevos. |
| 6. Conclusiones | Respuesta a la pregunta, hallazgos, desempeño del modelo, errores, limitaciones y mejoras posibles. |

## Resultados principales

**Respuesta a la pregunta: parcialmente.** Los hábitos contienen información real sobre el rendimiento, pero no alcanzan para predecirlo con precisión a nivel individual.

- **El sueño es lo que más se asocia con el rendimiento.** La calidad del sueño tiene r=0.47 y las horas de sueño r=0.44. Quienes duermen 8 h o más promedian un `cgpa` de 3.06, contra 2.62 de quienes duermen menos de 5 h.
- **Estudio y asistencia suman, pero menos:** horas de estudio semanales r=0.32 y asistencia r=0.25.
- **El cronotipo marca diferencias, mezcladas con el sueño.** El `cgpa` promedio baja de `Early Bird` (2.96) a `Intermediate` (2.83) y a `Night Owl` (2.70), pero los `Night Owl` también duermen menos y usan más pantalla antes de dormir, así que no se puede separar cuál de los factores pesa más.
- **El tiempo total de pantalla casi no se relaciona con el `cgpa`** (r=-0.05). La pantalla justo antes de dormir tiene r=-0.22; la probamos en el modelo y **no mejora** el error de validación cruzada (RMSE 0.2832 con ella contra 0.2820 sin ella, promedio de regresión lineal y KNN), así que el modelo final no usa ninguna variable de pantalla.
- **La regresión lineal es el mejor modelo** (en el conjunto de prueba):

| Modelo | RMSE | MAE | MAPE | R² |
|---|---|---|---|---|
| Regresión lineal | 0.26 | 0.21 | 7.67 % | 0.34 |
| KNN (k=20) | 0.27 | 0.22 | 8.15 % | 0.30 |
| Baseline (media) | 0.33 | 0.27 | 10.02 % | -0.05 |

El modelo explica alrededor de un tercio de la variabilidad del `cgpa`. Tiende a predecir valores cercanos a la media: sobreestima a los estudiantes de rendimiento bajo y subestima a los de rendimiento alto. Por eso **no sirve para detectar estudiantes en riesgo**: a los de `cgpa` más bajo es justamente a quienes más sobreestima.

**Alcance de los resultados:** como los datos son sintéticos, las relaciones que encontramos son las que tienen los datos generados. Sirven para aplicar y evaluar las técnicas del análisis, pero no permiten sacar conclusiones sobre estudiantes reales.

## Cómo correrlo

### 1. Verificar la versión de Python

Se necesita **Python 3.10, 3.11 o 3.12**: la versión de NumPy fijada en `requirements.txt` no funciona con Python 3.13 o más nuevo.

```bash
# Windows
python --version

# macOS / Linux
python3 --version
```

Si la versión es 3.13 o más nueva, hay que instalar Python 3.12 desde [python.org](https://www.python.org/downloads/). En Windows se pueden tener varias versiones a la vez y elegir cuál usar con `py -3.12` (ver paso 3).

### 2. Clonar el repositorio

```bash
git clone https://github.com/jucarriz/TP-Integrador-Segundo-Parcial.git
cd TP-Integrador-Segundo-Parcial
```

### 3. Crear el entorno virtual

```bash
# Windows
python -m venv venv
# o, si hay varias versiones de Python instaladas:
py -3.12 -m venv venv

# macOS / Linux
python3 -m venv venv
```

### 4. Activar el entorno virtual

```bash
# Windows (PowerShell)
venv\Scripts\Activate.ps1

# Windows (cmd)
venv\Scripts\activate.bat

# macOS / Linux
source venv/bin/activate
```

**Si PowerShell muestra el error *"la ejecución de scripts está deshabilitada en este sistema"*** (es habitual en PCs corporativas), ejecutar primero este comando y volver a activar el entorno. Solo afecta a esa terminal y no cambia la configuración de la PC:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
venv\Scripts\Activate.ps1
```

El entorno está activo cuando aparece `(venv)` al principio de la línea de la terminal. Para salir del entorno: `deactivate`.

### 5. Instalar las dependencias

Con el entorno activo:

```bash
pip install -r requirements.txt
```

### 6. Abrir y ejecutar el notebook

Para ver todos los resultados, hay que ejecutar el notebook completo desde el principio. Hay dos opciones:

**Opción A: Jupyter**

```bash
jupyter notebook TP_Integrador.ipynb
```

En el navegador: *Kernel → Restart Kernel and Run All Cells…*

**Opción B: VS Code**

1. Abrir la carpeta del repositorio (*File → Open Folder…*) y después `TP_Integrador.ipynb`.
2. Elegir el kernel del entorno virtual: *Select Kernel* (arriba a la derecha) → *Python Environments* → `venv`. **Este paso es importante:** si no se elige, VS Code usa el Python global de la PC, sin las versiones fijadas en `requirements.txt`.
3. En la barra del notebook: *Restart* y después *Run All*.

El notebook se ejecutó de punta a punta, sin errores, con Python 3.10.11, pandas 2.2.3, NumPy 1.26.4, scikit-learn 1.6.0, matplotlib 3.10.0 y seaborn 0.13.2, que son las versiones fijadas en `requirements.txt`. Con otras versiones de las librerías, las métricas del modelo pueden variar en algunas centésimas.

Limitación conocida: la imputación de nulos y el acotado de `weekly_study_hours` se calcularon con todo el dataset, antes de separar train y test (detalle en la sección 6.5 del notebook).

## Estructura del repositorio

```
.
├── data/
│   └── student_sleep_screen_time_academic_performance.csv
├── TP_Integrador.ipynb
├── requirements.txt
├── TP Integrador · Segundo parcial.docx   # consigna
└── README.md
```
