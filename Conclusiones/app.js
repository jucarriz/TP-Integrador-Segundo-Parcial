const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const questLabel = document.getElementById("questLabel");
const worldLabel = document.getElementById("worldLabel");
const coinLabel = document.getElementById("coinLabel");
const lifeLabel = document.getElementById("lifeLabel");
const railCaption = document.getElementById("railCaption");
const storyRail = document.getElementById("storyRail");
const endCopy = document.getElementById("endCopy");
const endConfetti = document.getElementById("endConfetti");
const endSteps = Array.from(document.querySelectorAll(".end-step"));
const endItems = Array.from(document.querySelectorAll(".end-item"));

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const overlayStartButton = document.getElementById("overlayStartButton");
const continueButton = document.getElementById("continueButton");
const playAgainButton = document.getElementById("playAgainButton");
const bossContinueButton = document.getElementById("bossContinueButton");

const introOverlay = document.getElementById("introOverlay");
const storyOverlay = document.getElementById("storyOverlay");
const bossOverlay = document.getElementById("bossOverlay");
const endOverlay = document.getElementById("endOverlay");
const overlayKicker = document.getElementById("overlayKicker");
const overlayTitle = document.getElementById("overlayTitle");
const overlayBody = document.getElementById("overlayBody");
const overlayTags = document.getElementById("overlayTags");
const bossKicker = document.getElementById("bossKicker");
const bossBubble = document.querySelector(".boss-bubble");
const bossLine = document.getElementById("bossLine");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const GROUND_Y = 588;
const LEVEL_END = 9460;
const GRAVITY = 1800;
const PLAYER_SPEED = 320;
const JUMP_FORCE = 760;
const MAX_FALL = 1100;

const worlds = [
  {
    id: "curiosa",
    scene: "tutorial",
    order: 0,
    title: "Pregunta de investigación",
    era: "Objetivo",
    quest: "Definir qué queremos predecir",
    start: 0,
    end: 1500,
    checkpointX: 430,
    overview:
      "¿Se puede predecir el CGPA a partir del sueño, el uso de pantallas y el estilo de vida? Parcialmente: la regresión lineal logra R² = 0.34 y reduce el RMSE cerca de 21% frente al baseline.",
    tags: ["Pregunta", "CGPA", "Predicción parcial"],
    speech:
      "Los hábitos contienen información sobre el rendimiento, pero no alcanzan para predecir con precisión el resultado de cada estudiante. Ninguna variable de pantalla quedó en el modelo final.",
    bossDialogue: [
      { speaker: "Pregunta de investigación", line: "¿Podemos anticipar el rendimiento académico con estos hábitos?" },
      { speaker: "Katty", line: "Parcialmente. El modelo explica parte de las diferencias, pero no predice con precisión a cada persona." },
      { speaker: "Pregunta de investigación", line: "¿Una predicción sirve para decidir el futuro de alguien?" },
      { speaker: "Katty", line: "No. Es una herramienta exploratoria, no un veredicto individual." },
    ],
    bossTitle: "Reto 1 | Pregunta y alcance",
    achievement: "Conclusión | Predicción parcial",
    powerup: { x: 1460, y: 512, kind: "Pregunta de investigación", color: "#ffbe3b" },
  },
  {
    id: "adaptabilidad",
    scene: "adaptabilidad",
    order: 1,
    title: "Hallazgos de los datos",
    era: "Patrones observados",
    quest: "Identificar qué variables se asocian al CGPA",
    start: 1500,
    end: 3000,
    checkpointX: 1720,
    overview:
      "El sueño muestra las asociaciones más fuertes con el CGPA: calidad del sueño r = 0.47 y horas entre semana r = 0.44. Quienes duermen 8 horas o más promedian 3.06; quienes duermen menos de 5, 2.62.",
    tags: ["Calidad del sueño r=0.47", "Horas de sueño r=0.44", "Diferencia: 0.44 puntos"],
    speech:
      "El tiempo total de pantalla casi no se relaciona con el CGPA (r = -0.05). La pantalla antes de dormir tiene una asociación negativa débil (r = -0.22).",
    bossDialogue: [
      { speaker: "Reto de los datos", line: "Esperábamos que más tiempo de pantalla se asociara con menor CGPA. ¿Se confirmó?" },
      { speaker: "Katty", line: "No. La asociación del tiempo total fue casi nula. La pantalla antes de dormir fue débil y no mejoró la validación cruzada." },
      { speaker: "Reto de los datos", line: "¿Entonces el sueño causa un mejor rendimiento?" },
      { speaker: "Katty", line: "No podemos afirmar causalidad: observamos asociaciones en un corte transversal." },
    ],
    bossTitle: "Reto 2 | Leer la evidencia",
    achievement: "Hallazgo | El sueño destaca",
    powerup: null,
  },
  {
    id: "equipo",
    scene: "equipo",
    order: 2,
    title: "Comparación de modelos",
    era: "Evaluación",
    quest: "Comparar modelos con el baseline",
    start: 3000,
    end: 4500,
    checkpointX: 3220,
    overview:
      "Regresión lineal: RMSE 0.26, MAE 0.21, R² 0.34. KNN: RMSE 0.27, MAE 0.22, R² 0.30. Baseline: RMSE 0.33, MAE 0.27, R² -0.05.",
    tags: ["Regresión lineal", "KNN k=20", "Baseline"],
    speech:
      "La regresión lineal obtuvo el mejor resultado. Ambos modelos superaron al baseline; KNN no aportó una mejora frente al modelo lineal.",
    bossDialogue: [
      { speaker: "Reto de evaluación", line: "¿Un MAE de 0.21 significa que el modelo es preciso?" },
      { speaker: "Katty", line: "No por sí solo. El CGPA tiene un desvío de 0.33; por eso comparamos también con el baseline, cuyo MAE es 0.27." },
      { speaker: "Reto de evaluación", line: "¿Cómo evitamos evaluar sobre los mismos datos usados para entrenar?" },
      { speaker: "Katty", line: "Separamos train y test, ajustamos el escalado dentro del pipeline y usamos el test una sola vez para la evaluación final." },

    ],
    bossTitle: "Reto 3 | Comparar con criterio",
    achievement: "Resultado | Regresión lineal",
    powerup: null,
  },
  {
    id: "prueba",
    scene: "prueba",
    order: 3,
    title: "Errores y límites",
    era: "Uso responsable",
    quest: "Entender dónde falla el modelo",
    start: 4500,
    end: 6000,
    checkpointX: 4740,
    overview:
      "Las predicciones tienden hacia la media: el modelo sobreestima en 0.29 al 25% con CGPA más bajo y subestima en 0.17 al 25% más alto. No es apropiado para detectar estudiantes en riesgo.",
    tags: ["Sesgo hacia la media", "No diagnosticar riesgo", "Asociación no es causalidad"],
    speech:
      "Dos tercios de la variabilidad quedan sin explicar. Influyen factores ausentes del conjunto de datos, y varias variables predictoras están relacionadas entre sí.",
    bossDialogue: [
      { speaker: "Reto de uso responsable", line: "¿Podemos usar este modelo para identificar estudiantes en riesgo?" },
      { speaker: "Katty", line: "No. Sobreestima justamente los CGPA más bajos; podría ocultar dificultades reales." },
      { speaker: "Reto de uso responsable", line: "¿Se pueden generalizar estos resultados a estudiantes reales?" },
      { speaker: "Katty", line: "No directamente: los 500 registros son sintéticos y no representan estudiantes reales." },
    ],
    bossTitle: "Reto 4 | Límites y responsabilidad",
    achievement: "Advertencia | Datos sintéticos",
    powerup: { x: 5960, y: 512, kind: "Límites identificados", color: "#ff7e36" },
  },
  {
    id: "codigo",
    scene: "codigo",
    order: 4,
    title: "Mejoras futuras",
    era: "Siguiente iteración",
    quest: "Proponer cómo fortalecer el análisis",
    start: 6000,
    end: 9000,
    checkpointX: 7770,
    overview:
      "Para fortalecer el análisis: hacer selección de variables dentro de la validación cruzada, probar Ridge y repetir la validación. Sumar datos reales, historial académico y mediciones a lo largo del tiempo.",
    tags: ["Validación repetida", "Ridge", "Datos reales y longitudinales"],
    speech:
      "También podemos explorar variables adicionales y modelos no lineales, comparándolos con el mismo protocolo y sin mirar el conjunto de prueba durante el ajuste.",
    bossDialogue: [
      { speaker: "Reto final", line: "¿Qué cambio metodológico priorizaríamos?" },
      { speaker: "Katty", line: "Evitar filtraciones: imputación, acotado y selección de variables deben ajustarse solo con train, dentro del pipeline." },
      { speaker: "Reto final", line: "¿Qué podría aportar más información al modelo?" },
      { speaker: "Katty", line: "Datos reales y longitudinales, historial académico, dificultad de las materias y contexto socioeconómico." },
    ],
    bossTitle: "Reto 5 | La próxima versión",
    achievement: "Próximo paso | Mejor evidencia",
    powerup: { x: 8970, y: 512, kind: "Mejoras futuras", color: "#9fd3ff" },
  },
];

const state = {
  started: false,
  running: false,
  paused: true,
  completed: false,
  cameraX: 0,
  coins: 0,
  lives: Infinity,
  checkpointIndex: -1,
  messageTimer: 0,
  floatingMessage: "",
  shownBossDialogs: new Set(),
  bossDialogueQueue: [],
  bossDialogueIndex: 0,
  currentBossWorldId: null,
  bossTypingTimer: null,
  bossTypingComplete: true,
  bossTypingTarget: "",
  celebrations: [],
  audioContext: null,
  endStep: 0,
  endSequenceTimers: [],
  endConfettiCleanupTimer: null,
};

const keys = { left: false, right: false, jump: false };

const player = {
  x: 120,
  y: 400,
  w: 44,
  h: 70,
  vx: 0,
  vy: 0,
  onGround: false,
  facing: 1,
  invulnerable: 0,
};

const spawnPoint = { x: 120, y: 400 };

const clouds = [
  { x: 90, y: 70, size: 18 }, { x: 520, y: 130, size: 14 }, { x: 1040, y: 85, size: 16 },
  { x: 1560, y: 100, size: 18 }, { x: 2180, y: 72, size: 15 }, { x: 2860, y: 118, size: 16 },
  { x: 3480, y: 90, size: 15 }, { x: 4180, y: 70, size: 18 }, { x: 4780, y: 122, size: 14 },
  { x: 5460, y: 82, size: 16 }, { x: 6180, y: 120, size: 16 }, { x: 6900, y: 74, size: 18 },
  { x: 7600, y: 110, size: 15 }, { x: 8280, y: 88, size: 17 }, { x: 8960, y: 118, size: 16 },
];

const hills = [
  { x: 0, h: 140, w: 260, color: "#77c656" }, { x: 240, h: 104, w: 220, color: "#5da84a" },
  { x: 580, h: 152, w: 300, color: "#77c656" }, { x: 980, h: 116, w: 240, color: "#5da84a" },
  { x: 1340, h: 148, w: 300, color: "#77c656" }, { x: 1760, h: 124, w: 250, color: "#5da84a" },
  { x: 2120, h: 164, w: 320, color: "#77c656" }, { x: 2570, h: 108, w: 220, color: "#5da84a" },
  { x: 2890, h: 152, w: 300, color: "#77c656" }, { x: 3320, h: 118, w: 230, color: "#5da84a" },
  { x: 3670, h: 150, w: 300, color: "#77c656" }, { x: 4090, h: 112, w: 230, color: "#5da84a" },
  { x: 4440, h: 170, w: 340, color: "#77c656" }, { x: 4900, h: 126, w: 240, color: "#5da84a" },
  { x: 5260, h: 164, w: 320, color: "#77c656" }, { x: 5710, h: 114, w: 230, color: "#5da84a" },
  { x: 6060, h: 160, w: 310, color: "#77c656" }, { x: 6500, h: 120, w: 240, color: "#5da84a" },
  { x: 6850, h: 176, w: 340, color: "#77c656" }, { x: 7330, h: 128, w: 250, color: "#5da84a" },
  { x: 7690, h: 166, w: 330, color: "#77c656" }, { x: 8150, h: 120, w: 240, color: "#5da84a" },
  { x: 8490, h: 178, w: 340, color: "#77c656" }, { x: 8930, h: 130, w: 260, color: "#5da84a" },
];

const platforms = [
  { x: -320, y: GROUND_Y, w: LEVEL_END + 640, h: 140, type: "ground" },
  { x: 420, y: 520, w: 180, h: 24, type: "brick" }, { x: 760, y: 470, w: 160, h: 24, type: "brick" },
  { x: 1080, y: 430, w: 130, h: 24, type: "brick" }, { x: 1510, y: 540, w: 180, h: 24, type: "brick" },
  { x: 1910, y: 480, w: 180, h: 24, type: "brick" }, { x: 2240, y: 420, w: 140, h: 24, type: "brick" },
  { x: 2640, y: 540, w: 180, h: 24, type: "brick" }, { x: 2910, y: 470, w: 160, h: 24, type: "brick" },
  { x: 3260, y: 410, w: 150, h: 24, type: "brick" }, { x: 3660, y: 520, w: 200, h: 24, type: "brick" },
  { x: 4050, y: 450, w: 160, h: 24, type: "brick" }, { x: 4440, y: 390, w: 140, h: 24, type: "brick" },
  { x: 4870, y: 525, w: 180, h: 24, type: "brick" }, { x: 5230, y: 470, w: 160, h: 24, type: "brick" },
  { x: 5660, y: 420, w: 150, h: 24, type: "brick" }, { x: 6030, y: 520, w: 180, h: 24, type: "brick" },
  { x: 6450, y: 460, w: 180, h: 24, type: "brick" }, { x: 6860, y: 390, w: 160, h: 24, type: "brick" },
  { x: 7250, y: 330, w: 160, h: 24, type: "brick" }, { x: 7580, y: 500, w: 170, h: 24, type: "brick" },
  { x: 7960, y: 430, w: 150, h: 24, type: "brick" }, { x: 8350, y: 360, w: 150, h: 24, type: "brick" },
  { x: 8740, y: 300, w: 180, h: 24, type: "brick" },
];

const checkpoints = worlds.map((world, index) => ({
  x: world.checkpointX,
  y: GROUND_Y - 78,
  w: 30,
  h: 78,
  index,
  active: false,
}));

const coins = createCoins();
const powerups = worlds
  .filter((world) => world.powerup)
  .map((world) => ({ ...world.powerup, worldId: world.id, collected: false, unlocked: false }));

const enemyBlueprints = [
  { x: 860, y: GROUND_Y - 34, w: 38, h: 34, minX: 720, maxX: 1090, vx: 70, label: "Dato faltante" },
  { x: 1270, y: GROUND_Y - 42, w: 46, h: 42, minX: 1160, maxX: 1440, vx: 84, label: "Pregunta clave" },
  { x: 2140, y: GROUND_Y - 34, w: 38, h: 34, minX: 2010, maxX: 2360, vx: 76, label: "Pantalla" },
  { x: 2760, y: GROUND_Y - 42, w: 46, h: 42, minX: 2620, maxX: 2920, vx: 88, label: "Correlación" },
  { x: 3820, y: GROUND_Y - 34, w: 38, h: 34, minX: 3690, maxX: 4050, vx: 80, label: "Baseline" },
  { x: 4300, y: GROUND_Y - 42, w: 46, h: 42, minX: 4170, maxX: 4440, vx: 92, label: "Sobreajuste" },
  { x: 5210, y: GROUND_Y - 34, w: 38, h: 34, minX: 5050, maxX: 5480, vx: 80, label: "Sesgo" },
  { x: 5790, y: GROUND_Y - 42, w: 46, h: 42, minX: 5650, maxX: 5940, vx: 96, label: "Datos sintéticos" },
  { x: 6680, y: GROUND_Y - 34, w: 38, h: 34, minX: 6540, maxX: 6930, vx: 84, label: "Colinealidad" },
  { x: 8160, y: GROUND_Y - 34, w: 38, h: 34, minX: 8010, maxX: 8440, vx: 90, label: "Filtración de datos" },
  { x: 8780, y: GROUND_Y - 42, w: 46, h: 42, minX: 8630, maxX: 8940, vx: 106, label: "Reto final", bossId: "codigo" },
];

const enemies = enemyBlueprints.map((enemy) => ({ ...enemy, alive: true }));
const flag = { x: 9150, y: GROUND_Y - 220, w: 22, h: 220 };
const achievements = [
  "Rendimiento academico",
  "El sueño es importante",
  "Comparación de modelos",
  "Evaluación responsable",
  "Limitaciones identificadas",
  "Propuestas de mejora",
];

function createCoins() {
  const layouts = [
    { start: 260, count: 7, gap: 120, y: 520 }, { start: 740, count: 4, gap: 110, y: 420 },
    { start: 1640, count: 6, gap: 130, y: 520 }, { start: 2200, count: 4, gap: 110, y: 420 },
    { start: 3140, count: 6, gap: 130, y: 520 }, { start: 3680, count: 4, gap: 110, y: 420 },
    { start: 4660, count: 6, gap: 130, y: 520 }, { start: 5180, count: 4, gap: 110, y: 420 },
    { start: 6180, count: 6, gap: 130, y: 520 }, { start: 6700, count: 4, gap: 110, y: 420 },
    { start: 7700, count: 6, gap: 130, y: 520 }, { start: 8240, count: 5, gap: 110, y: 420 },
  ];

  return layouts.flatMap((layout, layoutIndex) =>
    Array.from({ length: layout.count }, (_, index) => ({
      x: layout.start + index * layout.gap,
      y: layout.y - (index % 2) * 80 + (layoutIndex % 2) * 10,
      collected: false,
    }))
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function intersectRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function getWorldById(worldId) {
  return worlds.find((world) => world.id === worldId) || worlds[0];
}

function getWorldIndexByX(x) {
  const index = worlds.findIndex((world) => x >= world.start && x < world.end);
  return index >= 0 ? index : worlds.length - 1;
}
function buildStoryRail() {
  if (!storyRail) {
    return;
  }

  storyRail.innerHTML = "";

  worlds.forEach((world) => {
    const stop = document.createElement("article");
    stop.className = "rail-stop";
    stop.dataset.worldId = world.id;
    stop.innerHTML = `
      <span class="rail-world">World ${world.order}</span>
      <strong>${world.title}</strong>
      <span class="rail-era">${world.era}</span>
      <span class="rail-status">Locked</span>
    `;
    storyRail.appendChild(stop);
  });
}

function updateStoryRail() {
  if (!storyRail || !railCaption) {
    return;
  }

  const currentWorldIndex = state.completed ? worlds.length - 1 : getWorldIndexByX(player.x);

  storyRail.querySelectorAll(".rail-stop").forEach((stop, index) => {
    stop.classList.toggle("done", index <= state.checkpointIndex);
    stop.classList.toggle("active", !state.completed && index === currentWorldIndex);
    const status = stop.querySelector(".rail-status");
    if (index <= state.checkpointIndex) {
      status.textContent = "Cleared";
    } else if (!state.completed && index === currentWorldIndex) {
      status.textContent = "Now playing";
    } else {
      status.textContent = "Locked";
    }
  });

  if (state.completed) {
    railCaption.textContent = "Siguiente: AI & Data Innovation";
    return;
  }

  const nextWorld = worlds[Math.min(state.checkpointIndex + 1, worlds.length - 1)];
  railCaption.textContent = `Siguiente: World ${nextWorld.order} - ${nextWorld.title}`;
}

function resetPlayer() {
  player.x = spawnPoint.x;
  player.y = spawnPoint.y;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.invulnerable = 0;
}

function resetWorld() {
  state.running = false;
  state.paused = true;
  state.completed = false;
  state.started = false;
  state.cameraX = 0;
  state.coins = 0;
  state.lives = Infinity;
  state.checkpointIndex = -1;
  state.messageTimer = 0;
  state.floatingMessage = "";
  state.bossDialogueQueue = [];
  state.bossDialogueIndex = 0;
  state.currentBossWorldId = null;
  state.celebrations = [];
  state.endStep = 0;
  state.shownBossDialogs.clear();

  spawnPoint.x = 120;
  spawnPoint.y = 400;

  coins.forEach((coin) => {
    coin.collected = false;
  });

  powerups.forEach((powerup) => {
    powerup.collected = false;
    powerup.unlocked = false;
  });

  enemies.forEach((enemy, index) => {
    enemy.alive = true;
    enemy.x = enemyBlueprints[index].x;
    enemy.vx = enemyBlueprints[index].vx;
  });

  checkpoints.forEach((checkpoint) => {
    checkpoint.active = false;
  });

  updateHud();
  updateStoryRail();
  populateEndOverlay();
  resetPlayer();
}

function updateHud() {
  coinLabel.textContent = String(state.coins);
  lifeLabel.textContent = "INFINITAS";

  if (state.completed) {
    worldLabel.textContent = "Final";
    questLabel.textContent = "Conclusiones completadas";
    return;
  }

  const currentWorld = worlds[getWorldIndexByX(player.x)];
  worldLabel.textContent = `Nivel ${currentWorld.order + 1}`;
  questLabel.textContent = currentWorld.quest;
}

function showOverlayForCheckpoint(index) {
  const world = worlds[index];
  overlayKicker.textContent = `Nivel ${world.order + 1} | ${world.era}`;
  overlayTitle.textContent = world.title;
  overlayBody.textContent = `${world.overview} ${world.speech}`;
  overlayTags.innerHTML = "";

  [...world.tags, world.achievement].forEach((tag) => {
    const pill = document.createElement("span");
    pill.textContent = tag;
    overlayTags.appendChild(pill);
  });

  storyOverlay.classList.add("visible");
  state.paused = true;
  state.running = false;
}

function hideAllOverlays() {
  introOverlay.classList.remove("visible");
  storyOverlay.classList.remove("visible");
  bossOverlay.classList.remove("visible");
  endOverlay.classList.remove("visible");
  clearBossTyping();
  clearEndConfetti();
}

function clearBossTyping() {
  if (state.bossTypingTimer) {
    window.clearTimeout(state.bossTypingTimer);
    state.bossTypingTimer = null;
  }
}

function finishBossTyping() {
  clearBossTyping();
  bossLine.textContent = state.bossTypingTarget;
  state.bossTypingComplete = true;
  bossContinueButton.textContent = state.bossDialogueIndex === state.bossDialogueQueue.length - 1 ? "Continuar" : "Siguiente";
}

function typeBossDialogueLine(line) {
  clearBossTyping();
  state.bossTypingTarget = line;
  state.bossTypingComplete = false;
  bossLine.textContent = "";
  bossContinueButton.textContent = "Omitir";

  let index = 0;
  const tick = () => {
    index += 1;
    bossLine.textContent = line.slice(0, index);
    if (index < line.length) {
      const delay = /[.,:!?]/.test(line[index - 1]) ? 40 : 18;
      state.bossTypingTimer = window.setTimeout(tick, delay);
      return;
    }

    state.bossTypingTimer = null;
    state.bossTypingComplete = true;
    bossContinueButton.textContent = state.bossDialogueIndex === state.bossDialogueQueue.length - 1 ? "Continuar" : "Siguiente";
  };

  tick();
}

function setBossDialogueLine() {
  const activeLine = state.bossDialogueQueue[state.bossDialogueIndex];
  if (!activeLine) {
    return;
  }

  const world = getWorldById(state.currentBossWorldId);
  const isKattyReply = /katty/i.test(activeLine.speaker);
  bossKicker.textContent = world.bossTitle;
  if (bossBubble) {
    bossBubble.classList.toggle("boss-bubble-player", isKattyReply);
  }
  typeBossDialogueLine(activeLine.line);
}

function showBossDialogue(worldId) {
  const world = getWorldById(worldId);
  state.currentBossWorldId = world.id;
  state.bossDialogueQueue = world.bossDialogue;
  state.bossDialogueIndex = 0;
  setBossDialogueLine();
  bossOverlay.classList.add("visible");
  state.paused = true;
  state.running = false;
  state.shownBossDialogs.add(world.id);
}

function advanceBossDialogue() {
  if (!state.bossTypingComplete) {
    finishBossTyping();
    return;
  }

  if (state.bossDialogueIndex < state.bossDialogueQueue.length - 1) {
    state.bossDialogueIndex += 1;
    setBossDialogueLine();
    return;
  }

  const worldId = state.currentBossWorldId;
  clearBossTyping();
  bossOverlay.classList.remove("visible");
  state.paused = false;
  state.running = true;
  unlockWorldReward(worldId);
}

function startGame() {
  hideAllOverlays();
  state.started = true;
  state.running = true;
  state.paused = false;
  updateHud();
  updateStoryRail();
}

function respawnAfterHit() {
  resetPlayer();
  player.invulnerable = 2;
  state.floatingMessage = "Intentos infinitos";
  state.messageTimer = 1.1;
  updateHud();
}

function collectCoin(coin) {
  if (coin.collected) {
    return;
  }

  coin.collected = true;
  state.coins += 1;
  updateHud();
}

function collectPowerup(powerup) {
  if (powerup.collected || !powerup.unlocked) {
    return;
  }

  powerup.collected = true;
  state.coins += 5;
  state.floatingMessage = `Desbloqueado: ${powerup.kind}`;
  state.messageTimer = 1.8;
  spawnCelebration(powerup.x, powerup.y, powerup.color, 28);
  playCelebrationSound("collect");
  updateHud();
}

function handleCheckpoints() {
  checkpoints.forEach((checkpoint) => {
    if (!checkpoint.active && player.x + player.w > checkpoint.x) {
      checkpoint.active = true;
      state.checkpointIndex = Math.max(state.checkpointIndex, checkpoint.index);
      spawnPoint.x = checkpoint.x - 50;
      spawnPoint.y = 420;
      updateHud();
      updateStoryRail();
      if (checkpoint.index <= 3) {
        unlockWorldReward(worlds[checkpoint.index].id);
      }
      showOverlayForCheckpoint(checkpoint.index);
    }
  });
}

function handleBossDialogues() {
  enemies.forEach((enemy) => {
    if (!enemy.bossId || !enemy.alive || state.shownBossDialogs.has(enemy.bossId)) {
      return;
    }

    if (player.x + player.w + 160 >= enemy.x) {
      showBossDialogue(enemy.bossId);
    }
  });
}

function updateEnemies(delta) {
  enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }

    enemy.x += enemy.vx * delta;
    if (enemy.x <= enemy.minX || enemy.x + enemy.w >= enemy.maxX) {
      enemy.vx *= -1;
    }

    if (intersectRect(player, enemy)) {
      const stomp = player.vy > 140 && player.y + player.h - enemy.y < 24;
      if (stomp) {
        enemy.alive = false;
        player.vy = -340;
        state.coins += enemy.bossId ? 5 : 3;
        state.floatingMessage = `${enemy.label} superado`;
        state.messageTimer = 1.2;
        updateHud();
      } else if (player.invulnerable <= 0) {
        respawnAfterHit();
      }
    }
  });
}

function updatePlayer(delta) {
  const desired = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  player.vx = desired * PLAYER_SPEED;
  if (desired !== 0) {
    player.facing = desired;
  }

  player.vy = Math.min(player.vy + GRAVITY * delta, MAX_FALL);
  player.x += player.vx * delta;
  player.y += player.vy * delta;
  player.onGround = false;

  if (player.y + player.h >= GROUND_Y) {
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  platforms.forEach((platform) => {
    if (platform.type === "ground") {
      return;
    }

    const wasAbove = player.y + player.h - player.vy * delta <= platform.y;
    const overlapsX = player.x + player.w > platform.x && player.x < platform.x + platform.w;
    const hitsTop = player.y + player.h >= platform.y && player.y + player.h <= platform.y + platform.h + 16;

    if (overlapsX && wasAbove && hitsTop && player.vy >= 0) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  });

  player.x = clamp(player.x, 0, LEVEL_END - player.w - 10);

  if (player.invulnerable > 0) {
    player.invulnerable -= delta;
  }
}

function tryJump() {
  if (player.onGround && !state.paused) {
    player.vy = -JUMP_FORCE;
    player.onGround = false;
  }
}

function updateCamera() {
  state.cameraX = clamp(player.x - WIDTH * 0.34, 0, LEVEL_END - WIDTH + 120);
}

function updateCollectibles() {
  coins.forEach((coin) => {
    if (!coin.collected) {
      const dx = player.x + player.w / 2 - coin.x;
      const dy = player.y + player.h / 2 - coin.y;
      if (dx * dx + dy * dy < 26 * 26) {
        collectCoin(coin);
      }
    }
  });

  powerups.forEach((powerup) => {
    if (powerup.unlocked && !powerup.collected) {
      const itemRect = { x: powerup.x - 14, y: powerup.y - 14, w: 28, h: 28 };
      if (intersectRect(player, itemRect)) {
        collectPowerup(powerup);
      }
    }
  });
}

function populateEndOverlay() {
  clearEndSequenceTimers();
  resetEndItems();
  clearEndConfetti();
  setEndStep(0);
  if (endCopy) {
    endCopy.textContent = "Validación repetida, Ridge y datos reales longitudinales.";
  }
}

function setEndStep(step) {
  if (step !== 0) {
    clearEndSequenceTimers();
  }

  state.endStep = step;
  endSteps.forEach((section, index) => {
    section.classList.toggle("active", index === step);
  });

  if (step < endSteps.length - 2) {
    playAgainButton.textContent = "Siguiente";
  } else if (step === endSteps.length - 2) {
    playAgainButton.textContent = "Continuar";
  } else {
    playAgainButton.textContent = "Volver a jugar";
  }
}

function advanceEndSequence() {
  if (state.endStep < endSteps.length - 1) {
    const nextStep = state.endStep + 1;
    setEndStep(nextStep);
    blastEndConfetti(nextStep === endSteps.length - 1 ? 180 : 130);
    playCelebrationSound(nextStep === endSteps.length - 1 ? "finale" : "step");
    return;
  }

  resetWorld();
  startGame();
}

function getAudioContext() {
  if (!state.audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    state.audioContext = new AudioCtx();
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume().catch(() => {});
  }

  return state.audioContext;
}

function playCelebrationSound(kind = "unlock") {
  const audioContext = getAudioContext();
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const presets = {
    collect: {
      notes: [660, 880, 1100],
      duration: 0.24,
      spacing: 0.08,
      gain: 0.08,
      types: ["sine", "sine", "triangle"],
    },
    unlock: {
      notes: [523.25, 659.25, 783.99],
      duration: 0.26,
      spacing: 0.08,
      gain: 0.085,
      types: ["square", "triangle", "triangle"],
    },
    step: {
      notes: [587.33, 783.99, 1046.5],
      duration: 0.28,
      spacing: 0.09,
      gain: 0.09,
      types: ["triangle", "triangle", "sine"],
    },
    item: {
      notes: [783.99, 1046.5, 1318.51],
      duration: 0.3,
      spacing: 0.07,
      gain: 0.1,
      types: ["triangle", "sine", "triangle"],
    },
    finale: {
      notes: [659.25, 783.99, 987.77, 1318.51, 1567.98],
      duration: 0.38,
      spacing: 0.1,
      gain: 0.11,
      types: ["triangle", "triangle", "sine", "sine", "triangle"],
    },
  };
  const preset = presets[kind] || presets.unlock;

  preset.notes.forEach((frequency, index) => {
    const startAt = now + index * preset.spacing;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = preset.types[Math.min(index, preset.types.length - 1)];
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(preset.gain, startAt + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + preset.duration);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + preset.duration + 0.02);
  });

  if (kind === "finale") {
    [392, 523.25, 659.25].forEach((frequency, index) => {
      const startAt = now + 0.04 + index * 0.06;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gainNode.gain.setValueAtTime(0.0001, startAt);
      gainNode.gain.exponentialRampToValueAtTime(0.03, startAt + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.42);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.44);
    });
  }
}

function clearEndSequenceTimers() {
  state.endSequenceTimers.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  state.endSequenceTimers = [];
}

function scheduleEndConfettiCleanup(delay = 3600) {
  if (state.endConfettiCleanupTimer) {
    window.clearTimeout(state.endConfettiCleanupTimer);
  }

  state.endConfettiCleanupTimer = window.setTimeout(() => {
    clearEndConfetti();
  }, delay);
}

function resetEndItems() {
  endItems.forEach((item) => {
    item.classList.remove("active");
  });
}

function clearEndConfetti() {
  if (state.endConfettiCleanupTimer) {
    window.clearTimeout(state.endConfettiCleanupTimer);
    state.endConfettiCleanupTimer = null;
  }

  if (!endConfetti) {
    return;
  }

  endConfetti.innerHTML = "";
}

function launchEndConfetti(amount = 56) {
  if (!endConfetti) {
    return;
  }

  const palette = ["#ff5aa5", "#ffd84a", "#3de1ff", "#8eff7a", "#9b7cff", "#ff8f47", "#ffffff"];

  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    const delay = Math.random() * 0.22;
    const duration = 2 + Math.random() * 1.15;
    const drift = `${-260 + Math.random() * 520}px`;
    const spin = `${-780 + Math.random() * 1560}deg`;
    const left = `${Math.random() * 100}%`;
    const top = `${-8 + Math.random() * 42}%`;
    const width = 10 + Math.floor(Math.random() * 12);
    const height = 14 + Math.floor(Math.random() * 18);

    piece.className = "confetti-piece";
    piece.style.left = left;
    piece.style.top = top;
    piece.style.width = `${width}px`;
    piece.style.height = `${height}px`;
    piece.style.background = palette[index % palette.length];
    piece.style.borderRadius = `${2 + Math.floor(Math.random() * 7)}px`;
    piece.style.setProperty("--fall-delay", `${delay}s`);
    piece.style.setProperty("--fall-duration", `${duration}s`);
    piece.style.setProperty("--drift", drift);
    piece.style.setProperty("--spin", spin);
    endConfetti.appendChild(piece);

    const removeTimer = window.setTimeout(() => {
      piece.remove();
    }, Math.ceil((delay + duration + 0.2) * 1000));
    state.endSequenceTimers.push(removeTimer);
  }
}

function blastEndConfetti(amount = 170) {
  const waves = [amount, Math.max(90, Math.round(amount * 0.78)), Math.max(70, Math.round(amount * 0.62))];
  waves.forEach((waveAmount, index) => {
    const timerId = window.setTimeout(() => {
      launchEndConfetti(waveAmount);
    }, index * 240);
    state.endSequenceTimers.push(timerId);
  });

  scheduleEndConfettiCleanup(3200);
}

function playEndItemSequence() {
  resetEndItems();
  endItems.forEach((item, index) => {
    const timerId = window.setTimeout(() => {
      item.classList.add("active");
      playCelebrationSound("item");
      launchEndConfetti(42 + index * 14);
    }, 320 + index * 420);
    state.endSequenceTimers.push(timerId);
  });
}
function spawnCelebration(x, y, baseColor = "#ffd249", amount = 22) {
  const palette = [baseColor, "#fff4c2", "#39d1cb", "#9fd3ff", "#ffcf4d"];
  for (let index = 0; index < amount; index += 1) {
    const angle = (Math.PI * 2 * index) / amount;
    const speed = 80 + Math.random() * 180;
    state.celebrations.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 120,
      life: 0.9 + Math.random() * 0.45,
      maxLife: 0.9 + Math.random() * 0.45,
      size: 4 + Math.floor(Math.random() * 5),
      color: palette[index % palette.length],
    });
  }
}

function unlockWorldReward(worldId) {
  if (!worldId) {
    return;
  }

  const world = getWorldById(worldId);
  const reward = powerups.find((powerup) => powerup.worldId === worldId);
  if (reward && !reward.collected && !reward.unlocked) {
    reward.unlocked = true;
    state.floatingMessage = `Apareció: ${reward.kind}`;
    state.messageTimer = 1.8;
    spawnCelebration(reward.x, reward.y, reward.color, 24);
    playCelebrationSound("unlock");
    return;
  }

  state.floatingMessage = `Conclusión: ${world.achievement}`;
  state.messageTimer = 1.6;
  spawnCelebration(player.x + player.w / 2, player.y + 18, "#39d1cb", 20);
  playCelebrationSound("unlock");
}

function updateCelebrations(delta) {
  state.celebrations = state.celebrations.filter((spark) => {
    spark.life -= delta;
    spark.x += spark.vx * delta;
    spark.y += spark.vy * delta;
    spark.vy += 520 * delta;
    spark.vx *= 0.985;
    return spark.life > 0;
  });
}

function checkFlag() {
  if (player.x + player.w > flag.x && !state.completed) {
    state.completed = true;
    state.running = false;
    state.paused = true;
    updateHud();
    updateStoryRail();
    populateEndOverlay();
    endOverlay.classList.add("visible");
    blastEndConfetti(190);
    playCelebrationSound("finale");
    playEndItemSequence();
  }
}

function update(delta) {
  updateCelebrations(delta);

  if (!state.running || state.paused || state.completed) {
    return;
  }

  updatePlayer(delta);
  handleBossDialogues();
  if (state.paused) {
    return;
  }

  updateEnemies(delta);
  updateCollectibles();
  handleCheckpoints();
  checkFlag();
  updateCamera();
  updateHud();
  updateStoryRail();

  if (state.messageTimer > 0) {
    state.messageTimer -= delta;
    if (state.messageTimer <= 0) {
      state.floatingMessage = "";
    }
  }
}
function drawPixelCloud(screenX, y, unit) {
  ctx.fillStyle = "#ffffff";
  const blocks = [
    [1, 1], [2, 0], [2, 1], [3, 0], [3, 1],
    [4, 0], [4, 1], [5, 0], [5, 1], [6, 1],
  ];
  blocks.forEach(([bx, by]) => {
    ctx.fillRect(screenX + bx * unit, y + by * unit, unit, unit);
  });
}

function drawPixelHill(screenX, width, height, color) {
  ctx.fillStyle = color;
  const steps = Math.max(4, Math.floor(width / 28));
  const stepWidth = Math.ceil(width / steps);
  const stepHeight = Math.ceil(height / steps);

  for (let index = 0; index < steps; index += 1) {
    const left = screenX + index * stepWidth;
    const right = screenX + width - (index + 1) * stepWidth;
    const top = HEIGHT - 96 - height + index * stepHeight;
    ctx.fillRect(left, top, stepWidth, HEIGHT - 96 - top);
    ctx.fillRect(right, top, stepWidth, HEIGHT - 96 - top);
  }

  ctx.fillRect(screenX + width * 0.32, HEIGHT - 96 - height, width * 0.36, height);
}

function drawSky() {
  ctx.fillStyle = "#94d9ff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#82b2ff";
  ctx.fillRect(0, HEIGHT * 0.48, WIDTH, HEIGHT * 0.2);
  ctx.fillStyle = "#ffd86c";
  ctx.fillRect(WIDTH - 180, 72, 18, 18);
  ctx.fillRect(WIDTH - 198, 90, 54, 18);
  ctx.fillRect(WIDTH - 180, 108, 18, 18);

  clouds.forEach((cloud) => {
    const x = cloud.x - state.cameraX * 0.35;
    if (x < -120 || x > WIDTH + 80) {
      return;
    }
    drawPixelCloud(x, cloud.y, cloud.size);
  });

  hills.forEach((hill) => {
    const x = hill.x - state.cameraX * 0.6;
    if (x + hill.w < -120 || x > WIDTH + 120) {
      return;
    }
    drawPixelHill(x, hill.w, hill.h, hill.color);
  });
}

function drawSectionBanners() {
  worlds.forEach((world) => {
    const x = world.start - state.cameraX + 120;
    const label = `WORLD ${world.order + 1}`;
    const labelFont = "bold 18px Lucida Console";
    const titleFont = "bold 22px Lucida Console";

    // El ancho del recuadro se ajusta al texto más largo (más 16 px de margen a cada lado).
    ctx.font = labelFont;
    const labelWidth = ctx.measureText(label).width;
    ctx.font = titleFont;
    const titleWidth = ctx.measureText(world.title).width;
    const width = Math.ceil(Math.max(labelWidth, titleWidth)) + 32;

    if (x < -width - 40 || x > WIDTH + 120) {
      return;
    }

    ctx.fillStyle = "rgba(10, 21, 41, 0.78)";
    ctx.fillRect(x, 86, width, 68);
    ctx.fillStyle = "#fff0bf";
    ctx.fillRect(x, 86, width, 4);
    ctx.fillStyle = "#39d1cb";
    ctx.fillRect(x, 150, width, 4);
    ctx.fillStyle = "#ffe39c";
    ctx.font = labelFont;
    ctx.fillText(label, x + 16, 112);
    ctx.fillStyle = "#fff7df";
    ctx.font = titleFont;
    ctx.fillText(world.title, x + 16, 138);
  });
}

function drawGround() {
  ctx.fillStyle = "#67c14d";
  ctx.fillRect(0, GROUND_Y - 16, WIDTH, HEIGHT - GROUND_Y + 16);
  ctx.fillStyle = "#3f7e2a";
  ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

  for (let x = -Math.floor(state.cameraX % 48); x < WIDTH + 48; x += 48) {
    ctx.fillStyle = "#9b5a29";
    ctx.fillRect(x, GROUND_Y + 22, 40, 22);
    ctx.fillStyle = "#7c421a";
    ctx.fillRect(x + 6, GROUND_Y + 28, 10, 4);
    ctx.fillRect(x + 22, GROUND_Y + 34, 10, 4);
  }
}

function drawPlatforms() {
  platforms.forEach((platform) => {
    if (platform.type === "ground") {
      return;
    }

    const x = platform.x - state.cameraX;
    if (x + platform.w < -40 || x > WIDTH + 40) {
      return;
    }

    ctx.fillStyle = "#a85a28";
    ctx.fillRect(x, platform.y, platform.w, platform.h);
    ctx.fillStyle = "#8b471d";
    for (let brickX = 0; brickX < platform.w; brickX += 32) {
      ctx.fillRect(x + brickX + 2, platform.y + 2, 28, 8);
      ctx.fillRect(x + brickX + 2, platform.y + 14, 12, 8);
      ctx.fillRect(x + brickX + 18, platform.y + 14, 12, 8);
    }
  });
}

function drawCheckpoints() {
  checkpoints.forEach((checkpoint) => {
    const x = checkpoint.x - state.cameraX;
    if (x < -80 || x > WIDTH + 40) {
      return;
    }

    ctx.fillStyle = "#fff0bf";
    ctx.fillRect(x + 10, checkpoint.y, 8, checkpoint.h);
    ctx.fillStyle = checkpoint.active ? "#39d1cb" : "#ffd76a";
    ctx.fillRect(x + 18, checkpoint.y + 6, 56, 30);
    ctx.fillStyle = "#183053";
    ctx.fillRect(x + 24, checkpoint.y + 12, 44, 18);
    ctx.fillStyle = "#fff0bf";
    ctx.font = "bold 18px Lucida Console";
    ctx.fillText(String(checkpoint.index + 1), x + 38, checkpoint.y + 28);
  });
}

function drawCoins() {
  coins.forEach((coin) => {
    if (coin.collected) {
      return;
    }

    const x = coin.x - state.cameraX;
    if (x < -20 || x > WIDTH + 20) {
      return;
    }

    ctx.fillStyle = "#ffd249";
    ctx.fillRect(x - 8, coin.y - 12, 16, 24);
    ctx.fillStyle = "#b36a00";
    ctx.fillRect(x - 4, coin.y - 8, 8, 16);
  });
}

function drawPowerups() {
  powerups.forEach((powerup) => {
    if (powerup.collected || !powerup.unlocked) {
      return;
    }

    const x = powerup.x - state.cameraX;
    if (x < -40 || x > WIDTH + 40) {
      return;
    }

    const pulse = Math.sin(performance.now() / 130) * 3;
    ctx.fillStyle = powerup.color;
    ctx.fillRect(x - 14, powerup.y - 14 - pulse, 28, 28);
    ctx.fillStyle = "rgba(255, 244, 194, 0.45)";
    ctx.fillRect(x - 20, powerup.y - 20 - pulse, 40, 40);
    ctx.fillStyle = "#fff3ca";
    ctx.fillRect(x - 6, powerup.y - 6 - pulse, 12, 12);
    ctx.fillStyle = "#153052";
    ctx.fillRect(x - 2, powerup.y - 2 - pulse, 4, 4);
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }

    const x = enemy.x - state.cameraX;
    if (x + enemy.w < -50 || x > WIDTH + 50) {
      return;
    }

    ctx.fillStyle = enemy.w > 40 ? "#7b2d5d" : "#8b3f24";
    ctx.fillRect(x, enemy.y, enemy.w, enemy.h);
    ctx.fillStyle = "#ffdcb0";
    ctx.fillRect(x + 8, enemy.y + 8, enemy.w - 16, enemy.h - 14);
    ctx.fillStyle = "#111";
    ctx.fillRect(x + 10, enemy.y + 16, 4, 4);
    ctx.fillRect(x + enemy.w - 14, enemy.y + 16, 4, 4);
    ctx.fillRect(x + 8, enemy.y + enemy.h - 6, enemy.w - 16, 4);
  });
}

function drawFlag() {
  const x = flag.x - state.cameraX;
  if (x < -60 || x > WIDTH + 120) {
    return;
  }

  ctx.fillStyle = "#fff1ca";
  ctx.fillRect(x, flag.y, flag.w, flag.h);
  ctx.fillStyle = "#39d1cb";
  ctx.fillRect(x + flag.w, flag.y + 18, 110, 66);
  ctx.fillStyle = "#ffd249";
  ctx.fillRect(x + flag.w, flag.y + 84, 110, 24);
}

function drawPlayer() {
  const flash = player.invulnerable > 0 && Math.floor(player.invulnerable * 12) % 2 === 0;
  if (flash) {
    return;
  }

  const x = player.x - state.cameraX;
  const y = player.y;
  ctx.save();
  if (player.facing < 0) {
    ctx.translate(x + player.w + 4, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x - 4, 0);
  }

  ctx.fillStyle = "#f3c73f";
  ctx.fillRect(19, y - 8, 8, 4);
  ctx.fillRect(15, y - 4, 4, 4);
  ctx.fillRect(27, y - 4, 4, 4);
  ctx.fillStyle = "#2f6ae6";
  ctx.fillRect(19, y - 4, 4, 4);
  ctx.fillStyle = "#d13a3a";
  ctx.fillRect(23, y - 4, 4, 4);
  ctx.fillStyle = "#f3c73f";
  ctx.fillRect(23, y - 8, 4, 4);

  ctx.fillStyle = "#101216";
  ctx.fillRect(9, y + 2, 28, 12);
  ctx.fillRect(5, y + 14, 36, 8);
  ctx.fillRect(7, y + 22, 34, 12);
  ctx.fillRect(11, y + 34, 30, 8);
  ctx.fillRect(15, y + 42, 26, 8);

  ctx.fillStyle = "#ffd8b4";
  ctx.fillRect(16, y + 10, 16, 16);
  ctx.fillRect(14, y + 26, 20, 4);

  ctx.fillStyle = "#151515";
  ctx.fillRect(13, y + 13, 8, 6);
  ctx.fillRect(27, y + 13, 8, 6);
  ctx.fillRect(21, y + 15, 6, 2);

  ctx.fillStyle = "#fff7ef";
  ctx.fillRect(14, y + 14, 6, 4);
  ctx.fillRect(28, y + 14, 6, 4);

  ctx.fillStyle = "#6fa7ff";
  ctx.fillRect(13, y + 30, 22, 12);
  ctx.fillRect(9, y + 42, 30, 12);
  ctx.fillRect(5, y + 54, 38, 8);
  ctx.fillRect(7, y + 62, 34, 4);

  ctx.fillStyle = "#2c66d1";
  ctx.fillRect(12, y + 40, 24, 6);
  ctx.fillRect(10, y + 52, 28, 4);

  ctx.fillStyle = "#e8f2ff";
  ctx.fillRect(21, y + 30, 6, 18);
  ctx.fillRect(7, y + 32, 4, 12);
  ctx.fillRect(37, y + 32, 4, 12);

  ctx.fillStyle = "#ffd8b4";
  ctx.fillRect(7, y + 34, 4, 10);
  ctx.fillRect(37, y + 34, 4, 10);

  ctx.fillStyle = "#1b1b1b";
  ctx.fillRect(13, y + 66, 8, 4);
  ctx.fillRect(27, y + 66, 8, 4);

  ctx.restore();
}

function drawMessage() {
  if (!state.floatingMessage) {
    return;
  }

  ctx.fillStyle = "rgba(10,21,41,0.88)";
  ctx.fillRect(WIDTH / 2 - 180, 90, 360, 48);
  ctx.fillStyle = "#fff0bf";
  ctx.fillRect(WIDTH / 2 - 180, 90, 360, 4);
  ctx.fillRect(WIDTH / 2 - 180, 134, 360, 4);
  ctx.fillStyle = "#fff5d8";
  ctx.font = "bold 20px Lucida Console";
  ctx.textAlign = "center";
  ctx.fillText(state.floatingMessage, WIDTH / 2, 120);
  ctx.textAlign = "start";
}

function drawProgressBar() {
  ctx.fillStyle = "rgba(10,21,41,0.62)";
  ctx.fillRect(24, 24, 288, 26);
  ctx.fillStyle = "#fff0bf";
  ctx.fillRect(24, 24, 288, 4);
  ctx.fillRect(24, 46, 288, 4);
  ctx.fillStyle = "#39d1cb";
  ctx.fillRect(28, 30, 280 * (player.x / LEVEL_END), 14);
}

function drawCelebrations() {
  state.celebrations.forEach((spark) => {
    const alpha = Math.max(0, spark.life / spark.maxLife);
    const screenX = spark.x - state.cameraX;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = spark.color;
    ctx.fillRect(screenX - spark.size / 2, spark.y - spark.size / 2, spark.size, spark.size);
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(screenX - 1, spark.y - spark.size, 2, spark.size * 2);
    ctx.fillRect(screenX - spark.size, spark.y - 1, spark.size * 2, 2);
    ctx.globalAlpha = 1;
  });
}

function render() {
  drawSky();
  drawSectionBanners();
  drawGround();
  drawPlatforms();
  drawCheckpoints();
  drawCoins();
  drawPowerups();
  drawEnemies();
  drawFlag();
  drawPlayer();
  drawCelebrations();
  drawProgressBar();
  drawMessage();
}
function loop(timestamp) {
  if (!loop.lastTime) {
    loop.lastTime = timestamp;
  }

  const delta = Math.min((timestamp - loop.lastTime) / 1000, 0.033);
  loop.lastTime = timestamp;
  update(delta);
  render();
  requestAnimationFrame(loop);
}

function onKeyChange(event, pressed) {
  const key = event.key.toLowerCase();
  if (["arrowleft", "arrowright", "arrowup", "a", "d", "w", " "].includes(key)) {
    event.preventDefault();
  }

  if (key === "arrowleft" || key === "a") {
    keys.left = pressed;
  }
  if (key === "arrowright" || key === "d") {
    keys.right = pressed;
  }
  if (key === "arrowup" || key === "w" || key === " ") {
    if (pressed && !keys.jump) {
      tryJump();
    }
    keys.jump = pressed;
  }
}

window.addEventListener("keydown", (event) => {
  onKeyChange(event, true);
});

window.addEventListener("keyup", (event) => {
  onKeyChange(event, false);
});

function bindMobileControls() {
  document.querySelectorAll(".mobile-button").forEach((button) => {
    const control = button.dataset.control;

    const press = () => {
      if (control === "left") {
        keys.left = true;
      }
      if (control === "right") {
        keys.right = true;
      }
      if (control === "jump") {
        tryJump();
      }
    };

    const release = () => {
      if (control === "left") {
        keys.left = false;
      }
      if (control === "right") {
        keys.right = false;
      }
    };

    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });
}

startButton.addEventListener("click", () => {
  if (!state.started) {
    startGame();
  } else {
    state.paused = false;
    state.running = true;
    hideAllOverlays();
  }
});

overlayStartButton.addEventListener("click", startGame);

continueButton.addEventListener("click", () => {
  storyOverlay.classList.remove("visible");
  state.paused = false;
  state.running = true;
});

bossContinueButton.addEventListener("click", advanceBossDialogue);

restartButton.addEventListener("click", () => {
  resetWorld();
  introOverlay.classList.add("visible");
});

playAgainButton.addEventListener("click", advanceEndSequence);

buildStoryRail();
populateEndOverlay();
resetWorld();
bindMobileControls();
requestAnimationFrame(loop);
























