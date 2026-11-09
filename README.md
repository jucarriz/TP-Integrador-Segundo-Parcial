# TP Integrador · Segundo Parcial — Python para Ciencia de Datos (UADE)

Trabajo práctico integrador de la materia **Python para Ciencia de Datos** (Licenciatura en Ciencias de Datos e IA, UADE). Modalidad grupal. Se entrega el notebook `.ipynb` junto con el dataset.

Consigna completa: [TP Integrador · Segundo parcial.docx](<TP Integrador · Segundo parcial.docx>).

## Integrantes

- Tananta Tananta Katherine
- Carrizo Juan Pablo
- Pasta Francisco Agustín
- Cirillo Matías Alejandro

## Pregunta

¿Se puede predecir el **rendimiento académico (`cgpa`)** de un/a estudiante a partir de sus hábitos de sueño, su uso de pantallas y otras variables de estilo de vida?

Es un problema de **regresión**: `cgpa` es numérica continua, en escala de 0 a 4.

## Dataset

[Student Sleep, Screen Time & Academic Performance](https://www.kaggle.com/datasets/aamir28/student-sleep-screen-time-and-academic-performance) (Kaggle).

- 500 estudiantes y 25 columnas, con variables numéricas (horas de sueño, uso de pantallas, asistencia, horas de estudio, `cgpa`, etc.) y categóricas (género, carrera, tipo de residencia, cronotipo, dispositivo principal, etc.).
- No tiene columnas de fecha, así que no corresponde una serie de tiempo.
- Archivo: [data/student_sleep_screen_time_academic_performance.csv](data/student_sleep_screen_time_academic_performance.csv).

## Contenido del notebook

Todo el trabajo está en [TP_Integrador.ipynb](TP_Integrador.ipynb):

| Sección | Contenido |
|---|---|
| 1. Carga y calidad | Tipos de datos, nulos, duplicados, valores imposibles y outliers, con la decisión tomada en cada caso y su justificación. |
| 2. EDA univariado | Estadística descriptiva, histogramas, boxplots y countplots. |
| 3. EDA bivariado | Mapa de calor de correlación, scatterplots contra `cgpa`, `cgpa` según variables categóricas y agregación por cronotipo. |
| 4. Agregaciones | `groupby` + `agg` con barplots: `cgpa` según horas de sueño y según carrera. |
| 5. Modelo | Regresión lineal y KNN regressor dentro de un `Pipeline` (imputación + escalado). El valor de k del KNN se elige con `GridSearchCV` y validación cruzada de 5 partes. Ambos se comparan contra un baseline (la media) con RMSE, MAE, MAPE y R², más un gráfico real vs predicho. |
| 6. Conclusiones | Respuesta a la pregunta, hallazgos, desempeño del modelo, errores, limitaciones y mejoras posibles. |

## Resultados principales

- **El sueño es lo que más se asocia con el rendimiento.** La calidad del sueño tiene r=0.47 y las horas de sueño r=0.44. Quienes duermen 8 h o más promedian un `cgpa` de 3.06, contra 2.62 de quienes duermen menos de 5 h.
- **El tiempo total de pantalla casi no se relaciona con el `cgpa`** (r=-0.05).
- **La regresión lineal es el mejor modelo** (en el conjunto de prueba):

| Modelo | RMSE | MAE | R² |
|---|---|---|---|
| Regresión lineal | 0.26 | 0.21 | 0.34 |
| KNN (k=20) | 0.27 | 0.22 | 0.29 |
| Baseline (media) | 0.33 | 0.27 | -0.05 |

El modelo explica alrededor de un tercio de la variabilidad del `cgpa`. Tiende a predecir valores cercanos a la media: sobreestima a los estudiantes de rendimiento bajo y subestima a los de rendimiento alto.

## Cómo correrlo

Crear y activar un entorno virtual:

```bash
# Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

Instalar las dependencias y abrir el notebook:

```bash
pip install -r requirements.txt
jupyter notebook TP_Integrador.ipynb
```

Para ver todos los resultados, ejecutar el notebook completo desde el principio (en Jupyter: *Kernel → Restart & Run All*).

El notebook se probó de punta a punta, sin errores, con Python 3.14, pandas 3.1.1, NumPy 2.5.4, scikit-learn 1.9.1, matplotlib 3.11.2 y seaborn 0.13.2. Con otras versiones de las librerías, las métricas del modelo pueden variar en algunas centésimas.

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
