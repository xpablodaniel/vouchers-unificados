// app.js — Bootstrap y configuración principal para vouchers unificados
// Soporta dos modos: MAP (Media Pensión) y PC (Pensión Completa)

const APP_CONFIG = {
  mode: 'PC',                    // 'PC' (Pensión Completa) o 'MAP' (Media Pensión)
  renderMode: 'boxes',           // 'boxes' (casillas HTML) o 'image' (imagen hardcodeada)
  imageForTildes: {
    MAP: 'assets/MapDay.png',
    PC: 'assets/JubPc2.png'
  },
  mealMultiplier: {
    MAP: 1,  // 1 comida/día (cena)
    PC: 2    // 2 comidas/día (almuerzo + cena)
  },
  csvParser: 'split',            // 'split' (legacy) o 'papaparse' (robusto, futuro)
  serviceLookup: {
    MAP: 'MEDIA PENSION',
    PC: 'PENSIÓN COMPLETA'        // Con acento para match exacto
  }
};

// Global data storage
let relevantData = [];

// UI Handlers
function handleFileSelect() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.csv';
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileContents = reader.result;
      relevantData = processData(fileContents, APP_CONFIG.mode);

      const resultOutput = document.getElementById('resultOutput');
      const noDataMessage = document.getElementById('noDataMessage');

      if (relevantData.length === 0) {
        resultOutput.innerHTML = '';
        noDataMessage.style.display = 'block';
      } else {
        resultOutput.innerHTML = relevantDataToForm(relevantData, APP_CONFIG);
        noDataMessage.style.display = 'none';
      }
    };

    reader.readAsText(file);
  });

  fileInput.click();
}

function toggleMode(newMode) {
  APP_CONFIG.mode = newMode;
  document.getElementById('mode-indicator').textContent = `Modo actual: ${newMode}`;
  
  // Re-render si ya hay datos cargados
  if (relevantData.length > 0) {
    const resultOutput = document.getElementById('resultOutput');
    resultOutput.innerHTML = relevantDataToForm(relevantData, APP_CONFIG);
  }
}

function printContent() {
  const headerContainer = document.querySelector('.header-container');
  const printButtonsContainer = document.querySelector('.print-buttons-container');
  if (headerContainer) headerContainer.style.display = 'none';
  if (printButtonsContainer) printButtonsContainer.style.display = 'none';
  window.print();
  if (headerContainer) headerContainer.style.display = 'block';
  if (printButtonsContainer) printButtonsContainer.style.display = 'block';
}

// These functions are now implemented in the lib/ modules
// and available globally via window object
