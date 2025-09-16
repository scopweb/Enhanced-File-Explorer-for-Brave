"use strict";

// Check if the folder exists by looking for file listing elements
const hasFileListing = document.querySelector('table') || document.querySelectorAll('a').length > 0;

// If no file listing is found, show a warning
if (!hasFileListing) {
  const warningDiv = document.createElement('div');
  warningDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffdddd;
    border: 2px solid #ff0000;
    padding: 20px;
    border-radius: 10px;
    font-size: 18px;
    color: #cc0000;
    text-align: center;
    z-index: 10000;
    font-family: Arial, sans-serif;
  `;
  warningDiv.innerHTML = `
    <strong>⚠️ Carpeta no encontrada</strong><br>
    La ruta especificada no existe o no tienes permisos para acceder.<br>
    Verifica la URL y tus permisos de acceso.
  `;
  document.body.appendChild(warningDiv);
  return; // Stop further execution
}

// Get header element and trim the text content
const header = document.getElementById("header");
if (header) {
  header.textContent = header.textContent.trim();

  // Set the header text content to ~ if it is empty
  if (header.textContent === "") {
    header.textContent = "~";
  }

  // Set the width of the header to 100% in order to fill the space
  header.style.width = "100%";

  // Set the length of the header to 65 characters
  if (header.textContent.length > 65) {
    header.textContent = header.textContent.slice(0, 65) + "...";
  }
}

// Shorten the text content of links that are too long
const links = document.querySelectorAll("a");
links.forEach((link) => {
  if (link.textContent.length > 60) {
    link.textContent = link.textContent.slice(0, 60) + "...";
  }
});

// Intercept file:// links and open in new window
document.addEventListener('click', function(event) {
  const target = event.target.closest('a');
  if (target && target.href && target.href.startsWith('file://')) {
    event.preventDefault();
    window.open(target.href, '_blank');
  }
});