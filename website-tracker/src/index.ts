import { getHostId } from './utils'

const script = document.currentScript

function init() {
  const hostId = getHostId(script)
}

const hasMPData = localStorage.getItem('MP')

if (!hasMPData) {
  // Call verification service to get blob data
  // Save blob data to local storage?
}

// create a new script element
const newScript = document.createElement('script');
newScript.src = 'http://localhost:8081/scribe-analytics.js';
newScript.async = true;

// insert the script element into the document
document.head.appendChild(newScript);

// Wait until all elements are on the page from initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
