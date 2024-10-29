import { LitElement, html } from 'lit-element';
import '@bbva-web-components/bbva-button-default/bbva-button-default.js';
import '@bbva-web-components/bbva-foundations-grid-tools-layout/bbva-foundations-grid-tools-layout.js';
import styles from './pokemones-ui.css.js';
import { bbvaInternational } from '@bbva-web-components/bbva-foundations-icons';
import '@bbva-web-components/bbva-core-icon/bbva-core-icon.js';
import '@meraki/pokemones-dm/pokemones-dm.js';
import '@bbva-web-components/bbva-core-heading/bbva-core-heading.js';



const icons = bbvaInternational();

export class PokemonesUi extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      arrayPokemon: { type: Array },
      nextUrl: { type: String },
      loading: { type: Boolean },
      mainIcon: {
        type: String,
        attribute: 'main-icon',
      },
      showModal: { type: Boolean },
      evolutionsData: { type: Object },
      errorMessage: { type: String },
    };
  }

  constructor() {
    super();
    this.arrayPokemon = [];
    this.nextUrl = null;
    this.loading = false;
    this.mainIcon = icons;
    this.showModal = false;
    this.evolutionsData = null;
    this.errorMessage = '';
  }

  async firstUpdated() {
    const pokemonDM = this.shadowRoot.querySelector('pokemones-dm');
    pokemonDM.addEventListener('pokemonesFetched', (pokemon) => {
      this.arrayPokemon = pokemon.detail.pokemons;
      this.nextUrl = pokemon.detail.nextUrl;
    });
    pokemonDM.addEventListener('evolucionesFetched', (pokemon) => {
      this.evolutionsData = pokemon.detail.evolutions;
      this.showModal = true;
    });
    pokemonDM.addEventListener('errorFetch', (pokemon) => {
      this.errorMessage = pokemon.detail.error;
    });
    await pokemonDM.fetchPokemonList();
  }

  async fetchEvolution(speciesUrl) {
    const pokemonDM = await this.shadowRoot.querySelector('pokemones-dm');
    pokemonDM.fetchEvolutionChain(speciesUrl);
  }

  closeModal() {
    this.showModal = false;
  }

  loadMorePokemon() {
    if (this.nextUrl) {
      const pokemonDM = this.shadowRoot.querySelector('pokemones-dm');
      this.loading = true;

      pokemonDM
        .fetchPokemonList(this.nextUrl)
        .catch((error) => {
          console.error('Error al cargar la lista:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  static get styles() {
    return [styles];
  }

  render() {
    return html`

        <div slot="app-top-content" class="overlap">
          <bbva-foundations-grid-tools-layout layout='[{"slot":"single","cols":{"sm":12,"md":12,"lg":12}}]'>
          <div slot="single">
            <div class="card-container">
              ${
                this.arrayPokemon.length > 0
                  ? this.arrayPokemon.map(
                      (pokemon) => html`
                        <div class="card">
                          <h2>Pokémon: ${pokemon.name}</h2>
                          <div class="imagen-container">
                            <img
                              src="${pokemon.image}"
                              alt="${pokemon.name}"
                              class="pokemon-image"
                            />
                          </div>
                          <div class="detalles-container">
                            <p>Tipo: ${pokemon.types}</p>
                            <bbva-button-default
                              size="l"
                              @click="${() =>
                                this.fetchEvolution(
                                  pokemon.speciesUrl,
                                  pokemon.name,
                                )}"
                            >
                              Ver Detalles
                            </bbva-button-default>
                          </div>
                        </div>
                      `,
                    )
                  : html`<p>Cargando datos de Pokémon...</p>`
              }
             </div>
                    ${
                      this.loading
                        ? html`<bbva-foundations-spinner></bbva-foundations-spinner>`
                        : ''
                    }
                    ${
                      this.nextUrl
                        ? html`
                            <bbva-button-default
                              size="l"
                              @click="${this.loadMorePokemon}"
                            >
                              Cargar más Pokémon
                            </bbva-button-default>
                          `
                        : ''
                    }
                      ${
                        this.showModal
                          ? html`
                              <div class="modal">
                                <div class="modal-content">
                                  ${this.evolutionsData
                                    ? html`
                                        <h3>Cadena de Evoluciones</h3>
                                        <ul class="card-container">
                                          ${this.evolutionsData.map(
                                            (evolution) => html`
                                              <div class="card">
                                                <h2>${evolution.name}</h2>
                                                <img
                                                  class="pokemon-image"
                                                  src="${evolution.image}"
                                                  alt="${evolution.name}"
                                                  class="evolution-image"
                                                />
                                                <p>Tipo: ${evolution.types}</p>
                                              </div>
                                            `,
                                          )}
                                        </ul>
                                      `
                                    : html`<p>${this.errorMessage}</p>`}
                                  <bbva-button-default
                                    @click="${this.closeModal}"
                                  >
                                    Cerrar
                                  </bbva-button-default>
                                </div>
                              </div>
                            `
                          : ''
                      }
          </div>
        </bbva-foundations-grid-tools-layout>
      <pokemones-dm .arrayPokemon="${this.arrayPokemon}"></pokemones-dm>
    `;
  }
}
