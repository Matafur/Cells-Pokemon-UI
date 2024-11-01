import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles';

export default css`
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 16px;
  margin: 10px;
  text-align: center;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card:hover {
  transform: scale(1.2);
}

.imagen-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.detalles-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
}

.pokemon-image {
  max-width: 150px;
  max-height: 150px;
  object-fit: contain;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  text-align: center;
}

:host {
  display: block;
  box-sizing: border-box;
}

:host([hidden]), [hidden] {
  display: none !important;
}

*, *::before, *::after {
  box-sizing: inherit;
}
`;
