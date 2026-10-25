# TP Integrador · Segundo Parcial — Python para Ciencia de Datos (UADE)

Trabajo práctico integrador de la materia **Python para Ciencia de Datos** (Licenciatura en Ciencias de Datos e IA, UADE). Modalidad grupal, entrega como notebook `.ipynb` + dataset (o link).

Consigna completa: [TP Integrador · Segundo parcial.docx](<TP Integrador · Segundo parcial.docx>).

## Dataset

[Student Sleep, Screen Time & Academic Performance](https://www.kaggle.com/datasets/aamir28/student-sleep-screen-time-and-academic-performance) (Kaggle) — 500 estudiantes, 25 columnas con variables numéricas (horas de sueño, uso de pantallas, asistencia, horas de estudio, CGPA, etc.) y categóricas (género, carrera, tipo de residencia, cronotipo, dispositivo principal, etc.). No tiene columnas de fecha.

El CSV está en [data/student_sleep_screen_time_academic_performance.csv](data/student_sleep_screen_time_academic_performance.csv).

## Pregunta a responder con el modelo

¿Se puede predecir el **rendimiento académico (`cgpa`)** de un/a estudiante a partir de sus hábitos de sueño, su uso de pantallas y otras variables de estilo de vida? Es un problema de **regresión** (`cgpa` es numérica continua, entre 0 y 4).

## Notebook

Todo el trabajo está en [TP_Integrador.ipynb](TP_Integrador.ipynb):

1. **Carga y calidad** — tipos de datos, nulos, duplicados, valores imposibles/outliers y las decisiones de limpieza tomadas sobre cada uno. ✅
2. **EDA univariado** — estadística descriptiva, histogramas y boxplots de las variables principales. ✅
3. **EDA bivariado** — scatterplots, mapa de calor de correlación y relación de las variables con `cgpa`. ✅
4. **Agregaciones y visualizaciones adicionales** — pendiente.
5. **Modelo (regresión lineal o k-NN)** — pendiente.
6. **Conclusiones** — pendiente.

## Cómo correrlo

```bash
pip install -r requirements.txt
jupyter notebook TP_Integrador.ipynb
```

El notebook corre de principio a fin sin errores (fue verificado con `nbclient`).
