const generateButton = document.querySelector('#generateColors');
const colorCountInput = document.querySelector('#colorCount');
const savedColorSchemes = document.querySelector('#savedColorSchemes');
const errorMessage = document.querySelector('#errorMessage');

// GENERATE COLOR SCHEME
generateButton.addEventListener('click', () => {
  // Define function to generate random color scheme
  // Pull hex codes from api using number input by user
  const count = parseInt(colorCountInput.value);

  // Check if count is within the range of 2 to 49
  if (count < 2 || count > 49 || isNaN(count)) {
    errorMessage.textContent = 'Color count must be between 2 and 49'
    return; // Exit the function early if the validation fails
  }

  fetch(`https://random-flat-colors.vercel.app/api/random?count=${count}`)
    .then(response => response.json())
    .then(data => displayColors(data.colors));
});

// DISPLAY COLORS
// Define function to display colors for color scheme generated
// Include description input field and save option
const displayColors = (colors) => {
  errorMessage.textContent = ''; // Clear any previous error message
  const colorDisplay = document.querySelector('#colorDisplay');
  colorDisplay.innerHTML = '';  // Clear previous colors

  const colorElements = colors.map(color => {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    div.classList.add('color');
    return div;
  });

  colorElements.forEach(element => colorDisplay.appendChild(element));

  // Description input
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.placeholder = 'Enter description';

  // Save button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save this scheme';
  saveButton.addEventListener('click', () => saveColorScheme(colors));

  colorDisplay.appendChild(descriptionInput);
  colorDisplay.appendChild(saveButton);
}

// SAVE COLOR SCHEME
// Define function to save generated color scheme to the page if user desires
const saveColorScheme = (colors) => {
  const descriptionInput = document.querySelector('#colorDisplay input');
  const description = descriptionInput.value || '(No description)';

  const colorScheme = { colors, description };
  const colorSchemes = JSON.parse(localStorage.getItem('colorSchemes')) || [];
  colorSchemes.push(colorScheme);
  localStorage.setItem('colorSchemes', JSON.stringify(colorSchemes));

  addColorSchemeToPage(colorScheme);
}

// ADD COLOR SCHEME TO PAGE
// Define function used for saving and loading from storage
const addColorSchemeToPage = (colorScheme) => {
  // Create card for the new color scheme
  const card = document.createElement('div');
  card.classList.add('color-scheme-card');

  // Add color divs
  colorScheme.colors.forEach(color => {
    const colorDiv = document.createElement('div');
    colorDiv.style.backgroundColor = color;
    colorDiv.classList.add('color');
    card.appendChild(colorDiv);
  });

  // Add description
  const descriptionP = document.createElement('p');
  descriptionP.textContent = colorScheme.description;
  card.appendChild(descriptionP);

  // Add delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    card.remove();
    // Update local storage 
    removeFromLocalStorage(colorScheme);
  });
  card.appendChild(deleteButton);

  // Prepend the card to the saved color schemes section (so that it is listed first at the top
  savedColorSchemes.prepend(card);
}

// LOAD SAVED + REMOVE WHEN DELETED
const loadSavedColorSchemes = () => {
  const colorSchemes = JSON.parse(localStorage.getItem('colorSchemes')) || [];
  colorSchemes.forEach(addColorSchemeToPage);
}

const removeFromLocalStorage = (colorSchemeToDelete) => {
  let colorSchemes = JSON.parse(localStorage.getItem('colorSchemes')) || [];
  colorSchemes = colorSchemes.filter(cs => JSON.stringify(cs) !== JSON.stringify(colorSchemeToDelete));
  localStorage.setItem('colorSchemes', JSON.stringify(colorSchemes));
}

// Load any saved color schemes
loadSavedColorSchemes();