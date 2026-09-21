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
    }
  });

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
