// Import React's StrictMode for highlighting potential problems
import { StrictMode } from 'react';

// Import the createRoot API for concurrent rendering
import { createRoot } from 'react-dom/client';

// Import global CSS styles
import './index.css';

// Import the main App component
import App from './App.jsx';

// Render the App component inside the element with id 'root'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap App in StrictMode to catch potential issues in development */}
    <App />
  </StrictMode>,
);
