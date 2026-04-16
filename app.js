/* ═══════════════════════════════════════════════════════════════
   VIAJANDO POR EL MUNDO — app.js
   Sistema de Cotizaciones Profesional
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────────────────────
   CONSTANTS & CONFIGURATION
──────────────────────────────────────────────────────────────── */
const GEMINI_BASE  = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.5-flash';

const LS_API_KEY  = 'vpm_gemini_key';

/* ────────────────────────────────────────────────────────────────
   APP STATE
──────────────────────────────────────────────────────────────── */
let state = {
  apiKey:          localStorage.getItem(LS_API_KEY) || '',
  flightBase64:    null,
  flightMime:      null,
  flightLegs:      [],
  hotels:          [],      // Array of hotel objects
  quoteReady:      false,
  logoBase64: 'data:image/png;base64,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',    // Logo pre-convertido a base64 para PDF
};

/* ────────────────────────────────────────────────────────────────
   IATA CODES DICTIONARY (Common Destinations)
──────────────────────────────────────────────────────────────── */
const IATA_CODES = {
  // Colombia
  'MDE': 'Medellín', 'BOG': 'Bogotá', 'CLO': 'Cali', 'CTG': 'Cartagena', 'ADZ': 'San Andrés', 'BAQ': 'Barranquilla', 'SMR': 'Santa Marta', 'PEI': 'Pereira', 'BGA': 'Bucaramanga', 'CUC': 'Cúcuta',
  // Caribe & México
  'PUJ': 'Punta Cana', 'CUN': 'Cancún', 'SDQ': 'Santo Domingo', 'MBJ': 'Montego Bay', 'SJU': 'San Juan', 'NAS': 'Nassau', 'MEX': 'Ciudad de México', 'COZ': 'Cozumel', 'PVR': 'Puerto Vallarta', 'AXM': 'Armenia',
  // USA & Canada
  'MIA': 'Miami', 'FLL': 'Fort Lauderdale', 'MCO': 'Orlando', 'JFK': 'Nueva York', 'EWR': 'Newark', 'LAX': 'Los Angeles', 'IAH': 'Houston', 'YYZ': 'Toronto', 'YUL': 'Montreal', 'DFW': 'Dallas',
  // Europa
  'MAD': 'Madrid', 'BCN': 'Barcelona', 'CDG': 'París', 'LHR': 'Londres', 'FRA': 'Frankfurt', 'FCO': 'Roma', 'AMS': 'Amsterdam', 'IST': 'Estambul',
  // Suramérica
  'PTY': 'Panamá', 'LIM': 'Lima', 'BUE': 'Buenos Aires', 'EZE': 'Buenos Aires', 'SCL': 'Santiago de Chile', 'GRU': 'Sao Paulo', 'UIO': 'Quito', 'GYE': 'Guayaquil', 'CUR': 'Curazao', 'PTY': 'Panamá (Tocumen)'
};

function getCityFromIATA(code) {
  if (!code) return 'N/D';
  const cleanCode = code.trim().toUpperCase();
  return IATA_CODES[cleanCode] || 'N/D';
}

function onIATAChange(legIdx, field, code) {
  const cityField = field === 'origen_codigo' ? 'origen_ciudad' : 'destino_ciudad';
  const cityName = getCityFromIATA(code);
  
  if (cityName !== 'N/D') {
    const cityInput = document.getElementById(`flight-${cityField}-${legIdx}`);
    if (cityInput) {
       cityInput.value = cityName;
       // Update state
       if (state.flightLegs[legIdx]) {
         state.flightLegs[legIdx][cityField] = cityName;
       }
    }
  }
}

let hotelCounter = 0;

/* ────────────────────────────────────────────────────────────────
   FIREBASE (CLOUD DB & STORAGE)
──────────────────────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyABqvEcUNMy7FS8XtI300LHazbSeLdMV_A",
  authDomain: "cotizaciones-viajando.firebaseapp.com",
  projectId: "cotizaciones-viajando",
  storageBucket: "cotizaciones-viajando.firebasestorage.app",
  messagingSenderId: "1045939818223",
  appId: "1:1045939818223:web:b875268e3db276e84bd51a"
};

// Inicializar en la nube
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

function initDB() {
  // Observador de autenticación
  auth.onAuthStateChanged((user) => {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    
    if (user) {
      if (loginScreen) loginScreen.style.display = 'none';
      if (appContainer) appContainer.style.display = 'block';
      loadDestinationsFromDB();
      loadAgentsFromDB();
      loadHotelNamesFromDB();
      showToast(`Bienvenido: ${user.email}`, 'info');
    } else {
      if (loginScreen) loginScreen.style.display = 'flex';
      if (appContainer) appContainer.style.display = 'none';
    }
  });
}

async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  if (!email || !pass) return;

  btn.disabled = true;
  btn.innerText = 'Verificando...';
  errorEl.style.display = 'none';

  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) {
    console.error(e);
    errorEl.innerText = 'Usuario o contraseña incorrectos. Por favor intenta de nuevo.';
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.innerText = 'Entrar al Sistema';
  }
}

async function handleRegister() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('register-btn');

  if (!email || !pass) {
    errorEl.innerText = 'Por favor ingresa un correo y contraseña para registrarte.';
    errorEl.style.display = 'block';
    return;
  }

  if (pass.length < 6) {
    errorEl.innerText = 'La contraseña debe tener al menos 6 caracteres.';
    errorEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Creando Cuenta...';
  errorEl.style.display = 'none';

  try {
    await auth.createUserWithEmailAndPassword(email, pass);
    showToast('Cuenta creada y sesión iniciada', 'success');
  } catch (e) {
    console.error(e);
    errorEl.innerText = 'Fallo al crear cuenta: ' + e.message;
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.innerText = 'Crear Nueva Cuenta';
  }
}

async function saveDestinationToDB(dest) {
  if (!dest.trim()) return;
  const val = dest.trim();
  const normalized = normalizeHotelName(val);
  try {
    await db.collection("destinations").doc(normalized).set({ name: val });
    loadDestinationsFromDB();
  } catch (e) {
    console.error("Error saving destination", e);
  }
}

async function loadDestinationsFromDB() {
  try {
    const snap = await db.collection("destinations").get();
    const list = document.getElementById('destinations-list');
    if (!list) return;
    list.innerHTML = '';
    snap.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.data().name;
      list.appendChild(option);
    });
  } catch (e) {
    console.error("Error loading destinations", e);
  }
}

async function saveAgentToDB(agentName) {
  if (!agentName.trim()) return;
  const val = agentName.trim();
  const normalized = normalizeHotelName(val);
  try {
    await db.collection("agents").doc(normalized).set({ name: val });
    loadAgentsFromDB();
  } catch (e) {
    console.error("Error saving agent", e);
  }
}

async function loadAgentsFromDB() {
  try {
    const snap = await db.collection("agents").get();
    const list = document.getElementById('agents-list');
    if (!list) return;
    list.innerHTML = '';
    snap.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.data().name;
      list.appendChild(option);
    });
  } catch (e) {
    console.error("Error loading agents", e);
  }
}

async function loadHotelNamesFromDB() {
  try {
    const snap = await db.collection("hotel_names").get();
    const list = document.getElementById('hotel-names-list');
    if (!list) return;
    list.innerHTML = '';
    snap.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.data().name;
      list.appendChild(option);
    });
  } catch (e) {
    console.error("Error loading hotel names", e);
  }
}

async function saveHotelNameToDB(name) {
  if (!name.trim()) return;
  const normalized = normalizeHotelName(name);
  try {
    await db.collection("hotel_names").doc(normalized).set({ name: name.trim() });
    loadHotelNamesFromDB();
  } catch (e) {
    console.error("Error saving hotel name", e);
  }
}

function normalizeHotelName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

async function saveHotelImagesToDB(idx) {
  const hotel = state.hotels.find(h => h.id === idx);
  if (!hotel) return;

  const rawName = document.getElementById(`hotel-name-${idx}`)?.value || hotel.name;
  if (!rawName.trim()) return;

  const normalized = normalizeHotelName(rawName);
  try {
    await db.collection("hotels").doc(normalized).set({ images: hotel.images }, { merge: true });
  } catch (e) {
    console.error("Error saving hotel metadata", e);
  }
}

async function onHotelNameChange(idx, inputEl) {
  const hotel = state.hotels.find(h => h.id === idx);
  if (!hotel) return;
  hotel.name = inputEl.value;
  
  if (!hotel.name.trim()) return;

  const hasLocalImages = Object.values(hotel.images).some(url => url !== '');

  let dbImages = null;
  try {
     const doc = await db.collection("hotels").doc(normalizeHotelName(hotel.name)).get();
     if (doc.exists) dbImages = doc.data().images;
  } catch(e) { console.error(e); }

  if (dbImages) {
    if (!hasLocalImages) {
       hotel.images = { ...dbImages };
       IMAGE_SLOTS.forEach(slot => {
         setImageZonePreview(idx, slot.key, hotel.images[slot.key]);
         const input = document.getElementById(`hotel-img-url-${idx}-${slot.key}`);
         if (input) input.value = (hotel.images[slot.key] && hotel.images[slot.key].startsWith('http')) ? hotel.images[slot.key] : '';
       });
       showToast(`Historial en la Nube Cargado: ${hotel.name}`, 'info');
    } else {
       saveHotelImagesToDB(idx);
    }
  } else {
    if (hasLocalImages) {
      saveHotelImagesToDB(idx);
    }
  }
}

/* ────────────────────────────────────────────────────────────────
   INIT
──────────────────────────────────────────────────────────────── */
function init() {
  initDB();

  // Show absolute confirmation that the "base64 inline" patch is active
  showToast('Sistema Inicializado (Módulo PDF Seguro v4)', 'success');
  // preloadLogo() removed as logo is natively embedded now

  // Escuchar botón de login
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) loginBtn.onclick = handleLogin;

  const regBtn = document.getElementById('register-btn');
  if (regBtn) regBtn.onclick = handleRegister;

  // Restaurar API Key UI
  const keyInput = document.getElementById('api-key');
  if (keyInput) keyInput.value = state.apiKey;
  if (state.apiKey) showApiStatus('✅ Credenciales cargadas desde el dispositivo.', 'success');

  // Fecha por defecto
  const today = new Date();
  const ds = document.getElementById('date-start');
  const de = document.getElementById('date-end');
  if (ds) ds.value = formatDateInput(today);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 4);
  if (de) de.value = formatDateInput(nextWeek);
  
  addHotel();
}

/* ────────────────────────────────────────────────────────────────
   AGENT & CONSECUTIVE LOGIC
──────────────────────────────────────────────────────────────── */
function getAgentName() {
  const name = document.getElementById('agent-name').value.trim();
  return name || 'Agente_Anonimo';
}

function getAgentInitials(name) {
  return name.split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Obtiene el próximo consecutivo para el agente desde Firestore y lo incrementa.
 */
async function getNextConsecutive(agentName) {
  const id = normalizeHotelName(agentName);
  const docRef = db.collection("agent_counters").doc(id);

  try {
    return await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        transaction.set(docRef, { count: 1 });
        return 1;
      }
      const newCount = (doc.data().count || 0) + 1;
      transaction.update(docRef, { count: newCount });
      return newCount;
    });
  } catch (e) {
    console.error("Error obteniendo consecutivo:", e);
    return Math.floor(Math.random() * 1000); // Fallback aleatorio
  }
}

/* ────────────────────────────────────────────────────────────────
   SECTION TOGGLES
──────────────────────────────────────────────────────────────── */
function toggleSection(id) {
  const section  = document.getElementById(id);
  const body     = section.querySelector('.section-body');
  const chevron  = section.querySelector('.chevron');
  const isOpen   = body.classList.contains('open');

  if (isOpen) {
    body.classList.remove('open');
    chevron.classList.remove('open');
  } else {
    body.classList.add('open');
    chevron.classList.add('open');
  }
}

/* ────────────────────────────────────────────────────────────────
   API KEY MANAGEMENT
──────────────────────────────────────────────────────────────── */
function saveKeys() {
  const key = document.getElementById('api-key').value.trim();

  if (!key) { showToast('Por favor ingresa tu Gemini API Key.', 'error'); return; }

  state.apiKey = key;
  localStorage.setItem(LS_API_KEY, key);

  showApiStatus('✅ Credenciales guardadas correctamente.', 'success');
  showToast('Credenciales guardadas 🔑', 'success');
}

function showApiStatus(msg, type) {
  const el = document.getElementById('api-status-msg');
  el.textContent = msg;
  el.className = 'api-status-msg ' + type;
}

function toggleVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

/* ────────────────────────────────────────────────────────────────
   TRIP DATES & DURATION
──────────────────────────────────────────────────────────────── */
function updateDuration() {
  const startVal = document.getElementById('date-start').value;
  const endVal   = document.getElementById('date-end').value;
  const badge    = document.getElementById('duration-badge');
  const txt      = document.getElementById('duration-text');

  if (!startVal || !endVal) { badge.style.display = 'none'; return; }

  const start = new Date(startVal + 'T00:00:00');
  const end   = new Date(endVal   + 'T00:00:00');
  const diffMs = end - start;

  if (diffMs <= 0) { badge.style.display = 'none'; return; }

  const days   = Math.round(diffMs / 86400000);
  const nights = days;
  txt.textContent = `${days + 1} días / ${nights} noches`;
  badge.style.display = 'flex';
}

/* ────────────────────────────────────────────────────────────────
   TOGGLE EXTRA FIELDS (checkbox toggles)
──────────────────────────────────────────────────────────────── */
function toggleExtra(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = el.style.display === 'none' || el.style.display === '' ? 'block' : 'none';
  }
}

/* ────────────────────────────────────────────────────────────────
   PRICE CALCULATION
──────────────────────────────────────────────────────────────── */
function calculatePrice(costoBase, marginPct) {
  if (!costoBase || isNaN(costoBase) || costoBase <= 0) return null;
  const m = parseFloat(marginPct) || 0;
  const raw = costoBase / (1 - m / 100);
  return roundToNearest1000(raw);
}

function roundToNearest1000(n) {
  return Math.round(n / 1000) * 1000;
}

function formatCOP(amount) {
  if (amount === null || isNaN(amount)) return '—';
  return '$ ' + amount.toLocaleString('es-CO');
}

function recalcAllHotels() {
  state.hotels.forEach((_, idx) => recalcHotel(idx));
}

function recalcHotel(idx) {
  const costoInput      = document.getElementById(`hotel-costo-${idx}`);
  const costoNiñoInput  = document.getElementById(`hotel-costonino-${idx}`);
  const priceEl         = document.getElementById(`hotel-price-${idx}`);
  if (!costoInput || !priceEl) return;

  const margin = parseFloat(document.getElementById('margin').value) || 0;
  
  const costo      = parseFloat(costoInput.value.replace(/[^0-9.]/g, '')) || 0;
  const pvf        = calculatePrice(costo, margin);
  
  const costoNiño  = costoNiñoInput ? (parseFloat(costoNiñoInput.value.replace(/[^0-9.]/g, '')) || 0) : 0;
  const pvfNiño    = calculatePrice(costoNiño, margin);

  let html = `<div>Adulto: <strong>${formatCOP(pvf)}</strong></div>`;
  if (pvfNiño > 0) {
    html += `<div style="margin-top:2px; font-size:0.8rem; color:var(--teal-400)">Niño: <strong>${formatCOP(pvfNiño)}</strong></div>`;
  }
  priceEl.innerHTML = html;
  
  const hotel = state.hotels.find(h => h.id === idx);
  if (hotel) {
    hotel.pvf = pvf;
    hotel.pvfNiño = pvfNiño;
    hotel.costoBase = costo;
    hotel.costoNiño = costoNiño;
  }
}

/* ────────────────────────────────────────────────────────────────
   HOTEL MANAGEMENT
──────────────────────────────────────────────────────────────── */
const IMAGE_SLOTS = [
  { key: 'piscina',     label: '🏊 Piscina / Áreas comunes',   query: 'pool swimming area' },
  { key: 'fachada',     label: '🏨 Fachada / Vista aérea',      query: 'facade aerial view resort' },
  { key: 'habitacion',  label: '🛏 Habitación estándar',        query: 'standard room bedroom' },
  { key: 'restaurante', label: '🍽 Restaurante / Buffet',       query: 'restaurant buffet dining' },
];

function addHotel() {
  const idx = hotelCounter++;
  const hotelObj = {
    id:          idx,
    name:        '',
    costoBase:   0,
    costoNiño:   0,
    pvf:         null,
    pvfNiño:     null,
    images:      { piscina: '', fachada: '', habitacion: '', restaurante: '' },
  };
  state.hotels.push(hotelObj);

  const list = document.getElementById('hotels-list');
  const card = document.createElement('div');
  card.className = 'hotel-card';
  card.id = `hotel-card-${idx}`;

  card.innerHTML = `
    <div class="hotel-card-header">
      <span class="hotel-card-num">Hotel #${idx + 1}</span>
      <button class="hotel-remove-btn" onclick="removeHotel(${idx})" title="Eliminar hotel">✕</button>
    </div>

    <div class="field-group">
      <label class="field-label">Nombre del Hotel <span class="req">*</span></label>
      <input type="text" id="hotel-name-${idx}" class="field-input"
             placeholder="Ej: Majestic Elegance Punta Cana"
             list="hotel-names-list"
             onchange="onHotelNameChange(${idx}, this)">
    </div>

    <div class="field-row two-col">
      <div class="field-group">
        <label class="field-label">Costo Adulto (Base) <span class="req">*</span></label>
        <input type="number" id="hotel-costo-${idx}" class="field-input"
               placeholder="Ej: 3500000" min="0" step="1000"
               oninput="recalcHotel(${idx})">
      </div>
      <div class="field-group">
        <label class="field-label">Costo Niño (Base)</label>
        <input type="number" id="hotel-costonino-${idx}" class="field-input"
               placeholder="Opcional" min="0" step="1000"
               oninput="recalcHotel(${idx})">
      </div>
    </div>

    <div class="hotel-price-display">
      <div class="hotel-price-label">Precios de Venta Final</div>
      <div class="hotel-price-value" id="hotel-price-${idx}">—</div>
    </div>

    <div class="hotel-images-title">🖼 Imágenes del Hotel</div>
    <p style="font-size:0.72rem;color:var(--text-muted);margin:0 0 8px;">Sube fotos desde tu PC o pega una URL directa de imagen.</p>
    <button class="btn btn-ai" style="width:100%; margin-bottom:10px; font-size:0.78rem; padding:8px;"
            onclick="searchAllHotelImages(${idx})">
      🔍 Buscar fotos en Google Imágenes
    </button>
    <div class="hotel-img-grid" id="hotel-img-grid-${idx}">
      ${IMAGE_SLOTS.map(slot => `
        <div class="hotel-img-slot" id="hotel-slot-${idx}-${slot.key}">
          <div class="hotel-img-slot-label">${slot.label}</div>

          <!-- Upload zone (click or drag) -->
          <div class="img-upload-zone" id="img-zone-${idx}-${slot.key}"
               onclick="document.getElementById('img-file-${idx}-${slot.key}').click()"
               ondragover="event.preventDefault();this.classList.add('drag-over')"
               ondragleave="this.classList.remove('drag-over')"
               ondrop="handleHotelImageDrop(event,${idx},'${slot.key}')">
            <input type="file" id="img-file-${idx}-${slot.key}" accept="image/*" style="display:none"
                   onchange="handleHotelImageFile(this,${idx},'${slot.key}')">
            <div class="img-zone-inner" id="img-zone-inner-${idx}-${slot.key}">
              <span class="img-zone-icon">📷</span>
              <span class="img-zone-hint">Subir foto</span>
            </div>
          </div>

          <!-- URL fallback -->
          <input type="url" class="field-input hotel-img-url-input" style="margin-top:4px"
                 id="hotel-img-url-${idx}-${slot.key}"
                 placeholder="O pega URL directa de imagen"
                 onchange="onImgUrlChange(${idx}, '${slot.key}', this.value)">

          <!-- Individual Google search -->
          <button class="btn-search-img" onclick="searchSingleImage(${idx}, '${slot.key}')">
            🌐 Buscar en Google
          </button>
        </div>
      `).join('')}
    </div>
  `;

  list.appendChild(card);
}

function removeHotel(idx) {
  const card = document.getElementById(`hotel-card-${idx}`);
  if (card) card.remove();
  state.hotels = state.hotels.filter(h => h.id !== idx);
  if (state.hotels.length === 0) addHotel();
}

function onImgUrlChange(idx, key, url) {
  const hotel = state.hotels.find(h => h.id === idx);
  if (hotel) hotel.images[key] = url;
  setImageZonePreview(idx, key, url);
  saveHotelImagesToDB(idx);
  
  // También agregar a la memoria de autocompletado si hay un nombre escrito
  const rawName = document.getElementById(`hotel-name-${idx}`)?.value || (hotel ? hotel.name : '');
  if (rawName.trim()) {
    saveHotelNameToDB(rawName);
  }
}

/**
 * Updates the visual upload zone to show the loaded image (works with data URLs and http URLs)
 */
function setImageZonePreview(idx, key, src) {
  const zone      = document.getElementById(`img-zone-${idx}-${key}`);
  const inner     = document.getElementById(`img-zone-inner-${idx}-${key}`);
  if (!zone || !inner) return;

  if (src) {
    inner.innerHTML = `
      <img src="${src}" alt="preview"
           style="width:100%;height:100%;object-fit:cover;border-radius:6px;"
           onerror="this.parentElement.innerHTML='<span style=\'font-size:1.4rem;\'>⚠️</span><span class=\'img-zone-hint\'>Error cargando imagen</span>'">
      <button onclick="clearHotelImage(${idx},'${key}',event)"
              style="position:absolute;top:3px;right:3px;background:rgba(0,0,0,.6);border:none;
                     color:#fff;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;
                     display:flex;align-items:center;justify-content:center;z-index:1;">✕</button>`;
    zone.style.background = 'transparent';
    zone.style.border = 'none';
    zone.style.cursor = 'default';
    zone.onclick = null;
  } else {
    inner.innerHTML = '<span class="img-zone-icon">📷</span><span class="img-zone-hint">Subir foto</span>';
    zone.style.background = '';
    zone.style.border = '';
    zone.style.cursor = 'pointer';
    zone.onclick = () => document.getElementById(`img-file-${idx}-${key}`).click();
  }
}

function clearHotelImage(idx, key, event) {
  event.stopPropagation();
  const hotel = state.hotels.find(h => h.id === idx);
  if (hotel) hotel.images[key] = '';
  const input = document.getElementById(`hotel-img-url-${idx}-${key}`);
  if (input) input.value = '';
  setImageZonePreview(idx, key, '');
  saveHotelImagesToDB(idx);
}

async function handleHotelImageFile(input, idx, key) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Solo se aceptan archivos de imagen.', 'warning'); return; }

  const hotel = state.hotels.find(h => h.id === idx);
  if (!hotel) return;

  const rawName = document.getElementById(`hotel-name-${idx}`)?.value || hotel.name;
  if (!rawName.trim()) {
     showToast('¡Por favor escribe el nombre del Hotel ANTES de cargarle imágenes!', 'warning');
     input.value = '';
     return;
  }

  const inner = document.getElementById(`img-zone-inner-${idx}-${key}`);
  if (inner) inner.innerHTML = '<span class="img-zone-icon">⏳</span><span class="img-zone-hint">Subiendo a Nube...</span>';

  const normalized = normalizeHotelName(rawName);
  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `hotels/${normalized}/${key}-${Date.now()}.${ext}`;
  const storageRef = storage.ref(filePath);

  try {
    const snapshot = await storageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    hotel.images[key] = downloadURL;
    const urlInput = document.getElementById(`hotel-img-url-${idx}-${key}`);
    if (urlInput) urlInput.value = '';
    
    setImageZonePreview(idx, key, downloadURL);
    saveHotelImagesToDB(idx);
    saveHotelNameToDB(rawName); // Registrar hotel en la lista de autocompletado
    showToast('Imagen guardada en la Nube', 'success');
  } catch (e) {
    console.error("Error uploading image:", e);
    showToast('Error de conexión con la Nube', 'error');
    setImageZonePreview(idx, key, '');
  }
}

function handleHotelImageDrop(event, idx, key) {
  event.preventDefault();
  const zone = document.getElementById(`img-zone-${idx}-${key}`);
  if (zone) zone.classList.remove('drag-over');
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const fakeInput = { files: [file] };
    handleHotelImageFile(fakeInput, idx, key);
  } else {
    showToast('Solo se aceptan archivos de imagen.', 'warning');
  }
}

/* ────────────────────────────────────────────────────────────────
   HOTEL IMAGE SEARCH — Google Images (manual copy-paste)
   Opens Google Images with the right query so the user can pick
   the exact photo they want. Most reliable approach.
──────────────────────────────────────────────────────────────── */

/**
 * Opens Google Images searches for all 4 photo categories of a hotel
 */
function searchAllHotelImages(idx) {
  const hotel = state.hotels.find(h => h.id === idx);
  if (!hotel) return;

  const nameEl = document.getElementById(`hotel-name-${idx}`);
  const hotelName = nameEl ? nameEl.value.trim() : hotel.name;

  if (!hotelName) {
    showToast('Ingresa el nombre del hotel primero.', 'warning');
    return;
  }

  IMAGE_SLOTS.forEach(slot => {
    openGoogleImages(hotelName, slot.query);
  });

  showToast(`Se abrieron 4 búsquedas en Google Imágenes.\nHaz clic derecho en la foto → "Copiar dirección de imagen" → pégala aquí.`, 'info');
}

/**
 * Opens Google Images for a single category
 */
function searchSingleImage(idx, key) {
  const hotel = state.hotels.find(h => h.id === idx);
  if (!hotel) return;

  const nameEl = document.getElementById(`hotel-name-${idx}`);
  const hotelName = nameEl ? nameEl.value.trim() : hotel.name;

  if (!hotelName) {
    showToast('Ingresa el nombre del hotel primero.', 'warning');
    return;
  }

  const slot = IMAGE_SLOTS.find(s => s.key === key);
  if (!slot) return;

  openGoogleImages(hotelName, slot.query);
  showToast(`Busca la foto de "${slot.label.replace(/^[^\s]+ /, '')}" → clic derecho → "Copiar dirección de imagen" → pégala.`, 'info');
}

/**
 * Opens a Google Images tab with the constructed search query
 */
function openGoogleImages(hotelName, queryExtra) {
  const q = encodeURIComponent(`${hotelName} hotel ${queryExtra}`);
  const url = `https://www.google.com/search?q=${q}&udm=2`;
  window.open(url, '_blank');
}

function getApiKey() {
  const apiKey = document.getElementById('api-key').value.trim() || state.apiKey;
  if (!apiKey) {
    showToast('⚠ Ingresa tu Gemini API Key en "Configuración API".', 'error');
    return null;
  }
  return apiKey;
}

/* ────────────────────────────────────────────────────────────────
   FLIGHT IMAGE UPLOAD
──────────────────────────────────────────────────────────────── */
function handleFlightUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  processFlightFile(file);
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('flight-upload-zone').classList.add('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('flight-upload-zone').classList.remove('drag-over');
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processFlightFile(file);
  } else {
    showToast('Por favor sube un archivo de imagen.', 'warning');
  }
}

// Soporte para pegar imagen desde el portapapeles (Ctrl+V)
document.addEventListener('paste', (event) => {
  const items = event.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        processFlightFile(file);
        showToast('Imagen cargada desde el portapapeles 📋', 'success');
        event.preventDefault();
        return;
      }
    }
  }
});

function processFlightFile(file) {
  if (file.size > 10 * 1024 * 1024) {
    showToast('La imagen debe ser menor a 10 MB.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    state.flightBase64 = dataUrl.split(',')[1];
    state.flightMime   = file.type;

    document.getElementById('flight-img-el').src   = dataUrl;
    document.getElementById('flight-img-preview').style.display = 'block';
    document.getElementById('flight-upload-zone').style.display = 'none';
    document.getElementById('flight-data-editor').style.display = 'none';
    state.flightLegs = [];
    document.getElementById('flight-legs-list').innerHTML = '';
  };
  reader.readAsDataURL(file);
}

function clearFlight() {
  state.flightBase64 = null;
  state.flightMime   = null;
  state.flightLegs   = [];
  document.getElementById('flight-img-el').src   = '';
  document.getElementById('flight-img-preview').style.display = 'none';
  document.getElementById('flight-upload-zone').style.display = 'block';
  document.getElementById('flight-data-editor').style.display = 'none';
  document.getElementById('flight-legs-list').innerHTML = '';
  document.getElementById('flight-file-input').value = '';
}

/* ────────────────────────────────────────────────────────────────
   FLIGHT DATA EXTRACTION (Gemini Vision API)
──────────────────────────────────────────────────────────────── */
async function extractFlightData() {
  if (!state.flightBase64) {
    showToast('Primero sube la imagen del itinerario de vuelos.', 'warning');
    return;
  }

  const apiKey = document.getElementById('api-key').value.trim() || state.apiKey;
  if (!apiKey) {
    showToast('⚠ Configura tu Gemini API Key primero.', 'error');
    return;
  }

  showLoading('Extrayendo datos del vuelo...', 'Analizando imagen con Gemini Vision IA');

  const prompt = `Analiza esta captura de pantalla de un itinerario de vuelo y extrae TODOS los tramos de vuelo.
Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta (sin texto adicional):
{
  "vuelos": [
    {
      "fecha": "Fecha del vuelo en formato DD/MM/YYYY",
      "origen_ciudad": "Ciudad de origen",
      "origen_codigo": "Código IATA del aeropuerto de origen (3 letras)",
      "hora_salida": "HH:MM",
      "destino_ciudad": "Ciudad de destino",
      "destino_codigo": "Código IATA del aeropuerto de destino (3 letras)",
      "hora_llegada": "HH:MM",
      "duracion": "Xh Ym",
      "tipo": "Directo o Escala en [Ciudad]",
      "equipaje": "Descripción del equipaje incluido (si se muestra)",
      "aerolinea": "Nombre de la aerolínea"
    }
  ]
}
Si no encuentras información de equipaje, usa "Según política de la aerolínea".
Si no puedes leer claramente algún campo, usa "N/D".`;

  try {
    const resp = await fetch(
      `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: state.flightMime, data: state.flightBase64 } },
              { text: prompt }
            ]
          }],
          generationConfig: { temperature: 0 }
        })
      }
    );

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${resp.status}`);
    }

    const data       = await resp.json();
    const rawText    = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch  = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('La IA no devolvió un JSON válido. Intenta de nuevo.');

    const parsed = JSON.parse(jsonMatch[0]);
    state.flightLegs = parsed.vuelos || [];

    if (state.flightLegs.length === 0) throw new Error('No se detectaron vuelos en la imagen.');

    renderFlightLegs();
    // Auto-rellenar ciudades desde códigos al terminar extracción
    state.flightLegs.forEach((leg, i) => {
      if (leg.origen_codigo) onIATAChange(i, 'origen_codigo', leg.origen_codigo);
      if (leg.destino_codigo) onIATAChange(i, 'destino_codigo', leg.destino_codigo);
    });
  } catch (err) {
    console.error(err);
    showToast(`Error extrayendo vuelos: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

/* ────────────────────────────────────────────────────────────────
   RECOMMENDATIONS GENERATION (Gemini API)
──────────────────────────────────────────────────────────────── */
async function generateRecommendations() {
  const dest = document.getElementById('destination').value.trim();
  if (!dest) {
    showToast('Ingresa el destino del viaje primero.', 'warning');
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) return;

  showLoading('Generando recomendaciones...', 'Consultando IA...');

  const prompt = `Actúa como un experto asesor de viajes. Redacta recomendaciones imperdibles u cosas por hacer para el destino: "${dest}". 
Debes usar un tono emocionante y vendedor. 
REGLA ESTRICTA: El texto debe tener MÁXIMO 240 caracteres. ¡Ve al grano y no uses formato de viñetas largas, solo un párrafo fluido!`;

  try {
    const resp = await fetch(
      `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Limpieza
    text = text.replace(/\*/g, '').trim();
    if (text.length > 240) {
      text = text.substring(0, 237) + '...';
    }

    const txtArea = document.getElementById('recom-text');
    if (txtArea) {
      txtArea.value = text;
      showToast('Recomendaciones generadas por IA ✅', 'success');
    }

  } catch (err) {
    console.error(err);
    showToast(`Error de IA: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

function renderFlightLegs() {
  const container = document.getElementById('flight-legs-list');
  container.innerHTML = '';
  state.flightLegs.forEach((leg, i) => renderFlightLeg(leg, i));
  document.getElementById('flight-data-editor').style.display = 'block';
}

function renderFlightLeg(leg, i) {
  const container = document.getElementById('flight-legs-list');
  const card = document.createElement('div');
  card.className = 'flight-leg-card';
  card.id = `flight-leg-${i}`;

  card.innerHTML = `
    <div class="flight-leg-header">
      <span class="flight-leg-title">✈ Tramo ${i + 1}: ${leg.origen_codigo || '?'} → ${leg.destino_codigo || '?'}</span>
      <button class="flight-leg-remove" onclick="removeFlightLeg(${i})" title="Eliminar tramo">✕</button>
    </div>
    <div class="flight-leg-grid">
      <div class="field-group">
        <label class="field-label">Fecha</label>
        <input type="text" class="field-input" value="${leg.fecha || ''}"
               onchange="updateFlightLeg(${i}, 'fecha', this.value)" placeholder="DD/MM/YYYY">
      </div>
      <div class="field-group">
        <label class="field-label">Aerolínea</label>
        <input type="text" class="field-input" value="${leg.aerolinea || ''}"
               onchange="updateFlightLeg(${i}, 'aerolinea', this.value)" placeholder="Aerolínea">
      </div>
      <div class="field-group">
        <label class="field-label">Origen (Ciudad)</label>
        <input type="text" id="flight-origen_ciudad-${i}" class="field-input" value="${leg.origen_ciudad || ''}"
               onchange="updateFlightLeg(${i}, 'origen_ciudad', this.value)" placeholder="Ciudad">
      </div>
      <div class="field-group">
        <label class="field-label">Código Origen</label>
        <input type="text" class="field-input" value="${leg.origen_codigo || ''}"
               oninput="updateFlightLeg(${i}, 'origen_codigo', this.value); onIATAChange(${i}, 'origen_codigo', this.value)" placeholder="MDE">
      </div>
      <div class="field-group">
        <label class="field-label">Hora Salida</label>
        <input type="text" class="field-input" value="${leg.hora_salida || ''}"
               onchange="updateFlightLeg(${i}, 'hora_salida', this.value)" placeholder="HH:MM">
      </div>
      <div class="field-group">
        <label class="field-label">Duración</label>
        <input type="text" class="field-input" value="${leg.duracion || ''}"
               onchange="updateFlightLeg(${i}, 'duracion', this.value)" placeholder="Xh Ym">
      </div>
      <div class="field-group">
        <label class="field-label">Destino (Ciudad)</label>
        <input type="text" id="flight-destino_ciudad-${i}" class="field-input" value="${leg.destino_ciudad || ''}"
               onchange="updateFlightLeg(${i}, 'destino_ciudad', this.value)" placeholder="Ciudad">
      </div>
      <div class="field-group">
        <label class="field-label">Código Destino</label>
        <input type="text" class="field-input" value="${leg.destino_codigo || ''}"
               oninput="updateFlightLeg(${i}, 'destino_codigo', this.value); onIATAChange(${i}, 'destino_codigo', this.value)" placeholder="PUJ">
      </div>
      <div class="field-group">
        <label class="field-label">Hora Llegada</label>
        <input type="text" class="field-input" value="${leg.hora_llegada || ''}"
               onchange="updateFlightLeg(${i}, 'hora_llegada', this.value)" placeholder="HH:MM">
      </div>
      <div class="field-group">
        <label class="field-label">Escala</label>
        <input type="text" class="field-input" value="${leg.tipo || ''}"
               onchange="updateFlightLeg(${i}, 'tipo', this.value)" placeholder="Directo o Escala en...">
      </div>
    </div>
    <div class="field-group" style="margin-top:8px">
      <label class="field-label">Equipaje incluido</label>
      <input type="text" class="field-input" value="${leg.equipaje || ''}"
             onchange="updateFlightLeg(${i}, 'equipaje', this.value)"
             placeholder="Incluye artículo personal y equipaje de cabina 10 kg">
    </div>
  `;

  container.appendChild(card);
}

function updateFlightLeg(idx, field, value) {
  if (state.flightLegs[idx]) state.flightLegs[idx][field] = value;
}

function removeFlightLeg(idx) {
  state.flightLegs.splice(idx, 1);
  renderFlightLegs();
}

function addFlightLeg() {
  state.flightLegs.push({
    fecha: '', aerolinea: '',
    origen_ciudad: '', origen_codigo: '', hora_salida: '',
    destino_ciudad: '', destino_codigo: '', hora_llegada: '',
    duracion: '', tipo: 'Directo',
    equipaje: 'Incluye artículo personal y equipaje de cabina 10 kg'
  });
  renderFlightLegs();
}

/* ────────────────────────────────────────────────────────────────
   QUOTE GENERATION
──────────────────────────────────────────────────────────────── */
async function generateQuote() {
  // 1. Capturar datos básicos
  const destination = document.getElementById('destination').value.trim();
  const dateStart   = document.getElementById('date-start').value;
  const dateEnd     = document.getElementById('date-end').value;
  const margin      = document.getElementById('margin').value;
  const agent       = getAgentName();

  // 2. Validaciones obligatorias iniciales
  if (!agent || agent === 'Agente_Anonimo') { showToast('⚠ Ingresa tu nombre de Agente de Viajes.', 'warning'); return; }
  if (!destination) { showToast('⚠ Ingresa el destino del viaje.', 'warning'); return; }
  if (!dateStart)   { showToast('⚠ Ingresa la fecha de salida.', 'warning'); return; }
  if (!dateEnd)     { showToast('⚠ Ingresa la fecha de regreso.', 'warning'); return; }
  if (!margin)      { showToast('⚠ Ingresa el porcentaje de ganancia.', 'warning'); return; }

  const hotelsWithNames = state.hotels.filter(h => {
    const el = document.getElementById(`hotel-name-${h.id}`);
    const val = el ? el.value.trim() : h.name;
    return val !== "";
  });

  if (hotelsWithNames.length === 0) {
    showToast('⚠ Agrega al menos un hotel con nombre.', 'warning');
    return;
  }

  // 3. VALIDACIÓN CRUZADA DE FECHAS (Vuelo vs Viaje)
  if (state.flightLegs && state.flightLegs.length > 0) {
    const flightFirst = state.flightLegs[0].fecha; 
    const flightLast  = state.flightLegs[state.flightLegs.length - 1].fecha;
    
    const tripStart = dateStart.split('-').reverse().join('/');
    const tripEnd   = dateEnd.split('-').reverse().join('/');

    let dateWarnings = [];
    if (flightFirst && flightFirst !== tripStart) {
      dateWarnings.push(`• Salida viaje: ${tripStart} | Salida vuelo: ${flightFirst}`);
    }
    if (flightLast && flightLast !== tripEnd) {
      dateWarnings.push(`• Regreso viaje: ${tripEnd} | Regreso vuelo: ${flightLast}`);
    }

    if (dateWarnings.length > 0) {
      const msg = `⚠️ ATENCIÓN: LAS FECHAS NO COINCIDEN\n\n${dateWarnings.join('\n')}\n\n¿Deseas generar la cotización de todas formas?`;
      if (!confirm(msg)) return;
    }
  }

  showLoading('Generando cotización...', 'Preparando imágenes...');

  // 4. Pre-convertir TODAS las imágenes externas a base64
  //    Esto es la solución definitiva al "tainted canvas"
  await preloadHotelImages();

  // 5. Procesar y Generar Documento
  setTimeout(() => {
    try {
      const data = gatherFormData();
      const html = buildQuoteHTML(data);

      const output = document.getElementById('quote-output');
      if (output) {
        output.innerHTML = html;
        output.style.display = 'block';
        document.getElementById('preview-placeholder').style.display = 'none';
        document.getElementById('btn-pdf').disabled = false;
        state.quoteReady = true;
        showToast('¡Cotización generada exitosamente! 🎉', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      hideLoading();
    }
  }, 300);
}

/**
 * Pre-carga TODAS las imágenes de hoteles externas (http/https) y las convierte a base64.
 * Esto elimina completamente el problema de "tainted canvas" porque html2pdf
 * solo encontrará data URIs inline, no URLs externas cross-origin.
 */
async function preloadHotelImages() {
  const imageKeys = ['piscina', 'fachada', 'habitacion', 'restaurante'];
  const promises = [];

  for (const hotel of state.hotels) {
    for (const key of imageKeys) {
      const url = hotel.images[key] || '';
      if (url && url.startsWith('http')) {
        const p = imgToBase64(url)
          .then(dataUrl => { hotel.images[key] = dataUrl; })
          .catch(e => {
            console.warn(`No se pudo pre-cargar imagen [${key}] para hotel "${hotel.name}":`, url, e);
            hotel.images[key] = ''; // Omitir imagen si falla en lugar de dejar URL cruda
          });
        promises.push(p);
      }
    }
  }

  // Procesar todas en paralelo para mayor velocidad
  if (promises.length > 0) {
    await Promise.allSettled(promises);
  }
}

function gatherFormData() {
  const startVal = document.getElementById('date-start').value;
  const endVal   = document.getElementById('date-end').value;
  const start    = new Date(startVal + 'T00:00:00');
  const end      = new Date(endVal   + 'T00:00:00');
  const diffDays = Math.round((end - start) / 86400000);

  const hotels = state.hotels
    .map(h => {
      const nameEl  = document.getElementById(`hotel-name-${h.id}`);
      const costoEl = document.getElementById(`hotel-costo-${h.id}`);
      const costoNinoEl = document.getElementById(`hotel-costonino-${h.id}`);
      const name    = nameEl  ? nameEl.value.trim()  : h.name;
      const costo   = costoEl ? parseFloat(costoEl.value) || 0 : h.costoBase;
      const costoNiño = costoNinoEl ? parseFloat(costoNinoEl.value) || 0 : h.costoNiño;
      const margin  = parseFloat(document.getElementById('margin').value) || 0;
      
      const pvf     = calculatePrice(costo, margin);
      const pvfNiño = calculatePrice(costoNiño, margin);

      return { ...h, name, costoBase: costo, costoNiño, pvf, pvfNiño, images: h.images };
    })
    .filter(h => h.name);

  const tourismChk  = document.getElementById('chk-tourism').checked;
  const vaccineChk  = document.getElementById('chk-vaccine').checked;
  const recomChk    = document.getElementById('chk-recom').checked;
  const tourismText = document.getElementById('tourism-text').value.trim();
  const vaccineText = document.getElementById('vaccine-text').value.trim();
  const recomText   = document.getElementById('recom-text').value.trim();
  const extraNotInc = document.getElementById('extra-not-inc').value.trim();

  return {
    destination:  document.getElementById('destination').value.trim(),
    dateStart:    formatDateES(start),
    dateEnd:      formatDateES(end),
    dateStartRaw: startVal,
    dateEndRaw:   endVal,
    days:         diffDays + 1,
    nights:       diffDays,
    margin:       parseFloat(document.getElementById('margin').value) || 0,
    planType:     document.getElementById('plan-type').value,
    clientName:   document.getElementById('client-name').value.trim(),
    numPax:       document.getElementById('num-pax').value.trim(),
    hotels,
    recommendations: recomChk ? recomText : null,
    flightLegs:   state.flightLegs,
    tourismCard:  tourismChk ? tourismText : null,
    vaccine:      vaccineChk ? vaccineText : null,
    extraNotInc,
    today:        formatDateES(new Date()),
  };
}

/* ────────────────────────────────────────────────────────────────
   QUOTE HTML BUILDER
──────────────────────────────────────────────────────────────── */
function buildQuoteHTML(d) {
  const ref = `COT-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}-${Math.floor(Math.random()*900+100)}`;

  const clientStr  = d.clientName  ? `<strong>${d.clientName}</strong>, es` : 'Es';
  const paxStr     = d.numPax      ? ` para <strong>${d.numPax} pasajero(s)</strong>` : '';
  const durationStr = `<strong>${d.days} días / ${d.nights} noches</strong>`;

  // Build "no incluye" list
  const noInclude = ['Gastos no especificados en el programa.'];
  if (d.tourismCard) noInclude.push(d.tourismCard);
  if (d.extraNotInc) d.extraNotInc.split('\n').filter(Boolean).forEach(l => noInclude.push(l));

  // Build notes list
  const notes = [
    'Te recomendamos verificar que tu pasaporte tenga una vigencia mínima de <strong>6 meses</strong> antes de la fecha del viaje, requisito necesario para destinos internacionales.',
    'Es tu deber conocer y cumplir con todos los requisitos de viaje exigidos por las autoridades colombianas y del país de destino, incluyendo documentación, permisos de salida de menores y demás requerimientos migratorios.',
  ];
  if (d.vaccine) {
    notes.push(`<strong>Vacunación requerida para este destino:</strong> ${d.vaccine}.`);
  }

  // Flight table rows
  const flightRows = d.flightLegs.length > 0
    ? d.flightLegs.map(leg => `
        <tr>
          <td><strong>${leg.fecha || 'N/D'}</strong></td>
          <td>
            <div class="q-flight-route">
              <span class="q-flight-code">${leg.origen_codigo || '?'}</span>
              <span class="q-flight-arrow">→</span>
              <span class="q-flight-code">${leg.destino_codigo || '?'}</span>
            </div>
            <div style="font-size:0.72rem;color:#5A7A9D;margin-top:3px">
              ${leg.origen_ciudad || ''} → ${leg.destino_ciudad || ''}
            </div>
          </td>
          <td>${leg.hora_salida || 'N/D'}</td>
          <td>${leg.duracion || 'N/D'}</td>
          <td>${leg.hora_llegada || 'N/D'}</td>
          <td>
            <span class="q-badge ${(leg.tipo||'').toLowerCase().includes('directo') ? 'q-badge-direct' : 'q-badge-stop'}">
              ${leg.tipo || 'N/D'}
            </span>
          </td>
          <td style="font-size:0.72rem">${leg.equipaje || 'N/D'}</td>
        </tr>
      `).join('')
    : `<tr><td colspan="7" style="text-align:center;padding:20px;color:#8FA3C7;">
         No se han cargado datos de vuelo. Sube la imagen y extrae los datos con IA.
       </td></tr>`;

  // Hotel cards
  const hotelCardsHTML = d.hotels.map(hotel => {
    const imgs = hotel.images;
    const slots = [
      { key: 'piscina',     emoji: '🏊' },
      { key: 'fachada',     emoji: '🏨' },
      { key: 'habitacion',  emoji: '🛏' },
      { key: 'restaurante', emoji: '🍽' },
    ];

    const imgCells = slots.map((s, i) => {
      const url = imgs[s.key] || '';
      if (url && (url.startsWith('http') || url.startsWith('data:'))) {
        // data: URLs (subidas desde PC) se usan directamente; http URLs también
        const src = url;
        return `<img src="${src}" alt="${s.emoji} ${hotel.name}" style="width:100%;height:100%;object-fit:cover;">`;
      }
      return `<div class="img-placeholder">${s.emoji}</div>`;
    }).join('');

    return `
      <div class="q-hotel-card">
        <div class="q-hotel-img-grid">${imgCells}</div>
        <div class="q-hotel-info">
          <div class="q-hotel-name">${hotel.name}</div>
          <div class="q-hotel-plan">Plan: ${d.planType} — ${durationStr}</div>
          <div class="q-hotel-price-box">
            <div>
              <div class="q-hotel-price-label">Valor por persona</div>
              <div class="q-hotel-price-sub">${d.days} días / ${d.nights} noches — ${d.planType}</div>
            </div>
            <div style="text-align:right">
              <div class="q-hotel-price-value">${formatCOP(hotel.pvf)} <span style="font-size:0.75rem; font-weight:400; color:rgba(255,255,255,0.7)">Adulto</span></div>
              ${hotel.pvfNiño > 0 ? `<div class="q-hotel-price-value" style="font-size:1.3rem; margin-top:2px; color:var(--teal-400)">${formatCOP(hotel.pvfNiño)} <span style="font-size:0.65rem; font-weight:400; color:rgba(255,255,255,0.7)">Niño</span></div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="quote-doc" id="quote-doc">
      <!-- ══ HEADER ══ -->
      <div class="quote-hdr">
        <div class="quote-hdr-inner">
          <div class="quote-logo-block">
            <img src="${state.logoBase64 || 'logo.png'}" alt="Viajando X el Mundo"
                 class="quote-logo-img"
                 onerror="this.outerHTML='<div class=\\'quote-agency-name\\'>🌍 Viajando <span>X el Mundo</span></div>'">
            <div class="quote-slogan">"Te llevamos hasta donde Tu Imaginación te deje llegar."</div>
          </div>
          <div class="quote-hdr-right">
            <div class="quote-date-label">Fecha de emisión</div>
            <div class="quote-date">Medellín, ${d.today}</div>
            <div class="quote-ref" id="pdf-ref-label">Ref: ${ref}</div>
          </div>
        </div>
      </div>
      <div class="quote-gold-line"></div>

      <!-- ══ BODY ══ -->
      <div class="quote-body">

        <!-- Greeting -->
        <div class="quote-greeting">
          <p>
            ${clientStr} para <strong>Viajando por el Mundo</strong> un placer contar con clientes como usted${paxStr}.
            Adjunto enviamos la cotización detallada del plan a
            <span class="trip-highlight">${d.destination}</span>,
            con salida el <span class="trip-highlight">${d.dateStart}</span>
            y regreso el <span class="trip-highlight">${d.dateEnd}</span>.
          </p>
        </div>

        <!-- Plan Conditions -->
        <div class="q-section-title">Condiciones del Plan</div>
        <div class="q-conditions">
          <div class="q-box q-box-includes">
            <div class="q-box-title">✅ El Plan Incluye</div>
            <ul>
              <li>Tiquetes aéreos Medellín — ${d.destination} — Medellín</li>
              <li>Alojamiento ${durationStr} con plan <strong>${d.planType}</strong></li>
              <li>Traslado aeropuerto — hotel — aeropuerto</li>
              <li>Asistencia médica de viaje</li>
            </ul>
          </div>
          <div class="q-box q-box-excludes">
            <div class="q-box-title">❌ El Plan No Incluye</div>
            <ul>
              ${noInclude.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Important Notes -->
        <div class="q-notes">
          <div class="q-notes-title">⚠ Notas Importantes</div>
          <ul>
            ${notes.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>

        <!-- Flight Itinerary -->
        <div class="q-section-title">Itinerario de Vuelo</div>
        <table class="q-flight-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ruta</th>
              <th>Salida</th>
              <th>Duración</th>
              <th>Llegada</th>
              <th>Escala</th>
              <th>Equipaje</th>
            </tr>
          </thead>
          <tbody>
            ${flightRows}
          </tbody>
        </table>

        <!-- Hotel Options -->
        <div style="page-break-before: always; break-before: page; padding-top: 30px;">
          <div class="q-section-title">Opciones de Alojamiento</div>
          <div class="q-hotel-section">
            ${hotelCardsHTML}
          </div>
        </div>

        <!-- Recommendations Section -->
        ${d.recommendations ? `
          <div class="q-section-title">✨ Recomendaciones Imperdibles</div>
          <div class="q-recom-box">
             <div class="q-recom-icon">🧭</div>
             <div class="q-recom-text">${d.recommendations}</div>
          </div>
        ` : ''}

      </div>

      <!-- ══ FOOTER ══ -->
      <div class="quote-footer">
        <div class="quote-footer-top">
          <div class="quote-footer-note">
            <strong>💳 Nota sobre pagos:</strong><br>
            Para pagos con Tarjeta de Crédito el precio descrito incrementa el <strong>4.5%</strong>.
            Los precios están sujetos a disponibilidad al momento de la reserva.
          </div>
          <div class="quote-contact">
            <div class="quote-contact-item"><span class="icon">📞</span> PBX (604) 322 56 31</div>
            <div class="quote-contact-item"><span class="icon">📱</span> (+57) 319 5563557</div>
            <div class="quote-contact-item"><span class="icon">📧</span> reservas@viajandoxelmundo.com.co</div>
            <div class="quote-contact-item"><span class="icon">📸</span> @viajanmundo</div>
            <div class="quote-contact-item"><span class="icon">🌐</span> viajandoporelmundo.com.co</div>
          </div>
        </div>
        <hr class="quote-footer-divider">
        <div class="quote-footer-bottom">
          Viajando X el Mundo — Registro Nacional de Turismo RNT 36661 — Ministerio de Comercio, Industria y Turismo de Colombia.<br>
          Este documento es una cotización y no constituye una reserva confirmada.
        </div>
      </div>

    </div>
  `;
}

/* ────────────────────────────────────────────────────────────────
   PDF EXPORT
──────────────────────────────────────────────────────────────── */
async function downloadPDF() {
  if (!state.quoteReady) {
    showToast('Primero genera la cotización.', 'warning');
    return;
  }

  showLoading('Generando PDF...', 'Construyendo documento...');

  const element = document.getElementById('quote-doc');
  if (!element) { hideLoading(); showToast('Error: documento no encontrado.', 'error'); return; }

  const agentName = getAgentName();
  const initials  = getAgentInitials(agentName);
  const consecutive = await getNextConsecutive(agentName);

  const destination = document.getElementById('destination').value.trim().replace(/[^a-zA-Z0-9]/g,'_');
  const dateStr = new Date().toISOString().slice(0,10);
  const baseFilename = `${initials}_${destination}_${dateStr}_${consecutive}`;
  
  const refLabel = document.getElementById('pdf-ref-label');
  if (refLabel) {
    refLabel.innerText = `Ref: ${baseFilename}`;
  }

  // 1. Ajuste Geométrico preciso para "Pegar" el pie de página al fondo de la última hoja:
  element.style.minHeight = 'auto'; // Reset
  const currentHeight = element.scrollHeight;
  const a4HeightPx = 1122.5; // Relación matemática A4 en px para 794px de ancho (794 * 297/210)
  const totalPages = Math.ceil(currentHeight / a4HeightPx);
  element.style.minHeight = (totalPages * a4HeightPx) + 'px';

  const opt = {
    margin:       [0, 0, 0, 0],
    filename:     `${baseFilename}.pdf`,
    image:        { type: 'jpeg', quality: 0.96 },
    html2canvas:  {
      scale: 2,
      useCORS: false,      // Desactivado: las imágenes ya están inline y esto previene bugs CORS de Chrome local
      allowTaint: false,   // NO permitir canvas contaminado
      logging: false,
    },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
    showToast('PDF descargado exitosamente ✅', 'success');
  } catch (err) {
    console.error(err);
    showToast(`Error generando PDF: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

/**
 * Convierte una imagen remota a base64 data URL.
 * 
 * Estrategia en 2 capas para máxima compatibilidad:
 *   1) fetch con mode:'cors' — funciona con Firebase Storage y servidores con CORS
 *   2) Canvas con crossOrigin — fallback para URLs que permiten el atributo pero no fetch CORS
 *   3) Proxy CORS público — último recurso absoluto
 *
 * Si TODAS fallan, se rechaza la promesa y la imagen se omite del PDF.
 */
function imgToBase64(url) {
  // Si ya es data URL, no hacer nada
  if (url.startsWith('data:')) return Promise.resolve(url);

  return imgToBase64_fetch(url)
    .catch(() => imgToBase64_canvas(url))
    .catch(() => imgToBase64_fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`))
    .catch(() => {
      console.warn('Todas las estrategias de conversión fallaron para:', url);
      return ''; // Devolver vacío para omitir la imagen
    });
}

/** Estrategia 1: fetch + blob → FileReader */
function imgToBase64_fetch(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { mode: 'cors' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })
      .catch(reject);
  });
}

/** Estrategia 2: Image element + Canvas (crossOrigin=anonymous) */
function imgToBase64_canvas(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Image load failed'));
    // Agregar cache buster para evitar uso de versión cacheada sin CORS
    img.src = url + (url.includes('?') ? '&' : '?') + '_cb=' + Date.now();
  });
}

/* ────────────────────────────────────────────────────────────────
   DATE FORMATTING UTILITIES
──────────────────────────────────────────────────────────────── */
const MONTHS_ES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre'
];

const DAYS_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

function formatDateES(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

/* ────────────────────────────────────────────────────────────────
   LOADING OVERLAY
──────────────────────────────────────────────────────────────── */
function showLoading(msg = 'Procesando...', sub = '') {
  document.getElementById('loading-msg').textContent = msg;
  document.getElementById('loading-sub').textContent = sub;
  document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

/* ────────────────────────────────────────────────────────────────
   TOAST NOTIFICATIONS
──────────────────────────────────────────────────────────────── */
function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* ────────────────────────────────────────────────────────────────
   MOBILE TABS
──────────────────────────────────────────────────────────────── */
function switchTab(target) {
  const formPanel    = document.getElementById('form-panel');
  const previewPanel = document.getElementById('preview-panel');
  const tabForm      = document.getElementById('tab-form');
  const tabPreview   = document.getElementById('tab-preview');

  if (target === 'form') {
    formPanel.classList.remove('hidden');
    previewPanel.classList.add('hidden');
    tabForm.classList.add('active');
    tabPreview.classList.remove('active');
  } else {
    formPanel.classList.add('hidden');
    previewPanel.classList.remove('hidden');
    tabPreview.classList.add('active');
    tabForm.classList.remove('active');
  }
}

/* ────────────────────────────────────────────────────────────────
   STARTUP
──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);
