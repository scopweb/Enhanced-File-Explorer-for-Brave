"use strict";

// Flag to prevent multiple initializations
if (!window.enhancedFileExplorerInitialized) {
  window.enhancedFileExplorerInitialized = true;

  console.log('Enhanced File Explorer: Initializing content script');

  // Function to handle file:// link clicks
  function handleFileLink(event) {
    // Find the closest anchor element, even if clicking on child elements
    const target = event.target.closest('a');

    if (target && target.href) {
      console.log('Enhanced File Explorer: Clicked link with href:', target.href);

      // Check if it's a file:// URL (including UNC paths like file:////server/path)
      if (target.href.startsWith('file://')) {
        console.log('Enhanced File Explorer: Intercepting file:// URL');
        event.preventDefault();
        event.stopPropagation();

        // Use Chrome extension API to open new window
        chrome.runtime.sendMessage({
          action: 'openFileUrl',
          url: target.href
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Enhanced File Explorer: Runtime error:', chrome.runtime.lastError);
            // Fallback: try to open in current window
            window.location.href = target.href;
          } else if (!response || !response.success) {
            console.error('Enhanced File Explorer: Failed to open file URL:', response?.error || 'Unknown error');
            // Fallback: try to open in current window
            window.location.href = target.href;
          } else {
            console.log('Enhanced File Explorer: Successfully opened file URL in new window');
          }
        });
      }
    }
  }

  // Add event listener with delegation to handle dynamic content
  document.addEventListener('click', handleFileLink, true);

  // Observer for dynamically added content
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Check if the added node or its descendants have file:// links
            const fileLinks = node.querySelectorAll ? node.querySelectorAll('a[href^="file://"]') : [];
            if (fileLinks.length > 0) {
              console.log('Enhanced File Explorer: Detected', fileLinks.length, 'new file:// links');
            }
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    observer.disconnect();
  });

  // If current page is a file:// URL, apply styling and checks
  if (window.location.protocol === 'file:') {
    document.body.classList.add('efb-body');

    // Check if this is a directory listing or a file
    const hasFileListing = document.querySelector('table');
    const isDirectoryPath = window.location.href.endsWith('/');
    const hasErrorContent = document.body.textContent.toLowerCase().includes('not found') ||
                           document.body.textContent.toLowerCase().includes('no existe') ||
                           document.body.textContent.toLowerCase().includes('access denied') ||
                           document.body.textContent.toLowerCase().includes('acceso denegado');

    // Only show warning for directories that don't exist or have access issues
    if (!hasFileListing && isDirectoryPath && (document.body.children.length === 0 || hasErrorContent)) {
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
    } else if (hasFileListing) {
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
    }
  }
}
