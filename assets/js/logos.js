// assets/js/logos.js
const LOGO_FILES = [];

// BRAND PRIORITARI (STAGIONALI): mostrati per primi in ogni menu a cascata dei loghi,
// subito dopo la voce di default, ed esclusi dal resto dell'elenco alfabetico.
const PRIORITY_BRANDS = [];

/**
 * Restituisce l'elenco LOGO_FILES riordinato secondo la regola generale:
 * prima i PRIORITY_BRANDS (in ordine alfabetico tra loro), poi tutti gli altri
 * in ordine alfabetico invariato. Va usata da qualsiasi pagina che popola un
 * menu a cascata brand, per garantire lo stesso comportamento ovunque.
 */
function getSortedLogoFiles() {
  const priorityFiles = PRIORITY_BRANDS.filter(f => LOGO_FILES.includes(f));
  const remainingFiles = LOGO_FILES.filter(f => !PRIORITY_BRANDS.includes(f));
  return { priorityFiles, remainingFiles };
}

/**
 * Restituisce LOGO_FILES come singolo array già riordinato secondo la regola generale
 * (brand prioritari stagionali per primi, poi il resto in ordine alfabetico).
 */
function getOrderedLogoFiles() {
  const { priorityFiles, remainingFiles } = getSortedLogoFiles();
  return priorityFiles.concat(remainingFiles);
}

/**
 * Crea e appende un'opzione <option> a un elemento <select> per un menu brand,
 * evidenziando i brand prioritari (stagionali) con una stella e uno stile dedicato
 * (classe CSS "priority-brand-option"). Restituisce l'elemento creato.
 */
function appendBrandOption(selectEl, fileName, displayName, isPriority) {
  const option = document.createElement('option');
  option.value = fileName;
  option.textContent = isPriority ? `⭐ ${displayName}` : displayName;
  if (isPriority) option.className = 'priority-brand-option';
  selectEl.appendChild(option);
  return option;
}