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
  let previousState = null;
  button.addEventListener('click', () => {
    if (!isActive) previousState = captureState();
    isActive = !isActive;
    button.classList.toggle('is-active', isActive);
    button.title = isActive ? 'Disattiva tema Italia' : 'Attiva tema Italia';
    button.setAttribute('aria-label', button.title);
    document.querySelectorAll('.tema-italia-flag').forEach(flag => {
      flag.classList.toggle('is-visible', isActive);
    });

    if (isActive) {
      applyMadeInItalyDescription();
    } else {
      restoreState(previousState);
      previousState = null;
    }
  });

  function captureState() {
    return {
      controls: [...document.querySelectorAll('input, select, textarea')].map(control => ({
        element: control,
        value: control.value,
        checked: control.checked,
        selectedIndex: control.selectedIndex
      })),
      modeButtons: [...document.querySelectorAll('[id^="mode"]')].map(control => ({
        element: control,
        className: control.className
      })),
      activeMode: [...document.querySelectorAll('[id^="mode"]')]
        .find(control => control.classList.contains('active'))?.id || null,
      descriptionGroups: [...document.querySelectorAll('[id*="descGroup" i]')].map(group => ({
        element: group,
        style: group.getAttribute('style')
      }))
    };
  }

  function restoreState(state) {
    if (!state) return;

    state.controls.forEach(item => {
      item.element.value = item.value;
      item.element.checked = item.checked;
      if (item.element.tagName === 'SELECT') item.element.selectedIndex = item.selectedIndex;
    });

    state.controls.forEach(item => {
      if (item.element.matches('input, textarea')) {
        item.element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    if (state.activeMode && typeof window.switchMode === 'function') {
      const mode = state.activeMode === 'modeDoppia' || state.activeMode === 'modeStandard'
        ? state.activeMode === 'modeDoppia' ? 'doppia' : 'standard'
        : 'descrizione';
      window.switchMode(mode);
    } else {
      state.modeButtons.forEach(item => {
        item.element.className = item.className;
      });
    }
    state.descriptionGroups.forEach(item => {
      if (item.style === null) item.element.removeAttribute('style');
      else item.element.setAttribute('style', item.style);
    });
  }

  function createFlag(side) {
    const flag = document.createElement('img');
    flag.className = `tema-italia-flag tema-italia-flag-${side}`;
    flag.src = flagSource;
    flag.alt = '';
    return flag;
  }

  function applyMadeInItalyDescription() {
    const descriptionModeButton = document.getElementById('modeDescrizione');
    if (descriptionModeButton && !descriptionModeButton.classList.contains('active')) {
      descriptionModeButton.click();
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
