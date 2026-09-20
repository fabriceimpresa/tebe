(function initTemaItalia() {
  const cards = [...document.querySelectorAll('.card')];
  if (!cards.length) return;

  const flagSource = 'assets/img/madeinitaly.png';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tema-italia-btn';
  button.title = 'Attiva tema Italia';
  button.setAttribute('aria-label', 'Attiva tema Italia');

  const buttonImage = document.createElement('img');
  buttonImage.src = flagSource;
  buttonImage.alt = '';
  button.appendChild(buttonImage);
  document.body.appendChild(button);

  cards.forEach(card => {
    card.append(
      createFlag('left'),
      createFlag('right')
    );
  });

  let isActive = false;
  button.addEventListener('click', () => {
    isActive = !isActive;
    button.classList.toggle('is-active', isActive);
    button.title = isActive ? 'Disattiva tema Italia' : 'Attiva tema Italia';
    button.setAttribute('aria-label', button.title);
    document.querySelectorAll('.tema-italia-flag').forEach(flag => {
      flag.classList.toggle('is-visible', isActive);
    });

    if (isActive) {
      applyMadeInItalyDescription();
      syncFlagAlignment();
    }
  });

  // Nel Cartello Percentuale, in modalità Standard (nessuna descrizione), le bandiere
  // devono allinearsi al rettangolo dorato "FINO AL -" invece che restare a metà cartello.
  // Le altre pagine non hanno .minus-bar, quindi questa logica non le riguarda.
  const observer = new MutationObserver(() => syncFlagAlignment());
  cards.forEach(card => observer.observe(card, { attributes: true, attributeFilter: ['class'] }));

  function syncFlagAlignment() {
    cards.forEach(card => {
      const minusBar = card.querySelector('.minus-bar');
      const flags = card.querySelectorAll('.tema-italia-flag');
      if (minusBar && card.classList.contains('standard-mode')) {
        // Usiamo getBoundingClientRect invece di offsetTop perché in modalità Standard
        // .card-fields ha una transform (per sollevare i campi), il che lo rende
        // l'offsetParent del rettangolo dorato invece di .card, falsando il calcolo.
        const cardRect = card.getBoundingClientRect();
        const minusRect = minusBar.getBoundingClientRect();
        const center = (minusRect.top + minusRect.height / 2) - cardRect.top;
        let percent = (center / cardRect.height * 100);
        // #cardBottom è ruotato di 180° per la stampa fronte/retro: getBoundingClientRect
        // restituisce già la posizione "a schermo" (post-rotazione), mentre `top` viene
        // applicato prima della rotazione, quindi va invertito per finire nel punto giusto.
        if (isRotated180(card)) {
          percent = 100 - percent;
        }
        const top = percent + '%';
        flags.forEach(flag => { flag.style.top = top; });
      } else {
        flags.forEach(flag => { flag.style.removeProperty('top'); });
      }
    });
  }

  function isRotated180(card) {
    const transform = getComputedStyle(card).transform;
    if (!transform || transform === 'none') return false;
    // matrix(a, b, c, d, tx, ty): una rotazione di 180° dà a ≈ -1 e d ≈ -1
    const match = transform.match(/matrix\(([^)]+)\)/);
    if (!match) return false;
    const [a, , , d] = match[1].split(',').map(Number);
    return a < -0.5 && d < -0.5;
  }

  function createFlag(side) {
    const flag = document.createElement('img');
    flag.className = `tema-italia-flag tema-italia-flag-${side}`;
    flag.src = flagSource;
    flag.alt = '';
    return flag;
  }

  function applyMadeInItalyDescription() {
    // Alcune pagine (Sale, Brand, Percentuale) hanno una modalità "Doppia Cifra" / "Standard"
    // in alternativa a "Descrizione Articolo": il campo descrittivo esiste nel markup ma è
    // nascosto (#descGroup con display:none) finché quella modalità non è selezionata.
    // In quel caso il pulsante deve limitarsi a mostrare le bandiere, senza toccare la
    // descrizione né forzare il cambio di modalità.
    const descGroup = document.getElementById('descGroup');
    if (descGroup && descGroup.style.display === 'none') {
      return;
    }

    const descriptionSelect = [...document.querySelectorAll('select')].find(select =>
      [...select.options].some(option => normalize(option.textContent) === 'made in italy')
    );

    if (descriptionSelect) {
      const option = [...descriptionSelect.options].find(item =>
        normalize(item.textContent) === 'made in italy'
      );
      descriptionSelect.value = option.value;
      descriptionSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const descriptionInput = document.querySelector(
      'input[id*="desc" i], textarea[id*="desc" i]'
    );
    if (descriptionInput) {
      descriptionInput.value = 'Made in Italy';
      descriptionInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function normalize(value) {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
  }
}());
