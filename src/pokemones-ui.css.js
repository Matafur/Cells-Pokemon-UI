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
  flex: 0 1 calc(25% - 20px);
  box-sizing: border-box;
}

.card:hover {
  transform: scale(1.2);
}

.pokemon-image {
  max-width: 150px;
  max-height: 150px;
  margin-bottom: 10px;
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

.contenido {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

p {
  margin: 0;
  font-size: 16px;
  color: #666;
  margin-top: 10px;
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
