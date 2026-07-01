import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/* 
 * Showcase & Portfolio License Note:
 * This application is developed as a showcase / portfolio / project application 
 * sample for clients. Released under the MIT License.
 */
