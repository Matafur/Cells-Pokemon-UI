import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import '@bbva-web-components/bbva-button-default/bbva-button-default.js';
import { BbvaFoundationsSpinner } from '@bbva-web-components/bbva-foundations-spinner';
import '@bbva-web-components/bbva-foundations-grid-tools-layout/bbva-foundations-grid-tools-layout.js';
import styles from './pokemones-ui.css.js';
import {    bbvaInternational  } from '@bbva-web-components/bbva-foundations-icons';
import '@bbva-web-components/bbva-core-icon/bbva-core-icon.js';


const icons =  bbvaInternational()

export class PokemonesUi extends LitElement {
  static get properties() {
    return {
      name: {type: String,},
      arrayPokemon: { type: Array },
      nextUrl: { type: String },
      loading: { type: Boolean },
      mainIcon: {type: String,
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

  connectedCallback() {
    super.connectedCallback();
    this.fetchPokemonList();
  }

  fetchPokemonList() {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=100') 
      .then((response) => response.json())
      .then((data) => {
        const promises = data.results.map((pokemon) =>
          this.fetchPokemonDetails(pokemon.name)
        );
        return Promise.all(promises).then((pokemons) => {
          const basePokemons = pokemons.filter(
            (pokemon) => pokemon.isBasePokemon
          );
          this.arrayPokemon = [...this.arrayPokemon, ...basePokemons];
          this.nextUrl = data.next;
        });
      })
      .catch((error) =>
        console.error('Error fetching Pokémon list:', error)
      );
  }

  fetchPokemonDetails(pokemonName) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => response.json())
      .then((data) => {
        const { name, sprites, species, types } = data;
        const typesNames = types.map((typeInfo) => typeInfo.type.name).join(', ');

        return fetch(species.url)
          .then((response) => response.json())
          .then((speciesData) => {
            const isBasePokemon = !speciesData.evolves_from_species;

            return {
              name,
              image: sprites.other.dream_world.front_default,
              speciesUrl: species.url,
              types: typesNames,
              isBasePokemon,
            };
          });
      })
      .catch((error) =>
        console.error('Error fetching Pokémon details:', error)
      );
  }

  fetchEvolutionChain(speciesUrl, pokemonName) {
    fetch(speciesUrl)
      .then((response) => response.json())
      .then((speciesData) => fetch(speciesData.evolution_chain.url))
      .then((response) => response.json())
      .then((evolutionData) => {
        const fetchEvolutionImages = async (species) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
          const data = await response.json();
          const typesNames = data.types.map((typeInfo) => typeInfo.type.name).join(', '); // Aquí está la corrección
          return {
            name: species.name,
            types: typesNames,
            image: data.sprites.other.dream_world.front_default || data.sprites.front_default,
          };
        };
  
        const processEvolutionChain = async (chain) => {
          const evolutions = [];
          let currentEvolution = chain;
          
          while (currentEvolution) {
            const evolutionDetails = await fetchEvolutionImages(currentEvolution.species);
            evolutions.push(evolutionDetails);
            currentEvolution = currentEvolution.evolves_to[0];
          }
          
          return evolutions;
        };
  
        processEvolutionChain(evolutionData.chain)
          .then((evolutions) => {
            this.evolutionsData = evolutions.length > 1 ? evolutions : null;
            this.errorMessage = evolutions.length > 1 ? '' : 'Este Pokémon no tiene evoluciones';
            this.showModal = true;
          })
          .catch((error) =>
            console.error('Error al procesar la cadena de evolución:', error)
          );
      })
      .catch((error) => console.error('Error fetching evolution chain:', error));
  }

  closeModal() {
    this.showModal = false;
  }


  loadMorePokemon() {
    if (this.nextUrl) {
      this.loading = true; 
      this.fetchPokemonList(this.nextUrl)
        .catch(error => {
          console.error('Error al cargar la lista de Pokémon:', error);
        })
        .finally(() => {
          this.loading = false; 
        });
    }
  }



  static get styles() {
    return [ styles ];
  }

  render() {
    return html`
      <demo-web-template
        page-title="pokemon-page"
        detail-variant="dark"
        reset-detail-on-state-change
        @detail-opened-change="${(ev) => (this.detailOpened = ev.detail.value)}"
      >
        <div slot="app-top-content" class="overlap">
        
        </div>
        <h1>Pokemones</h1>
        <bbva-core-icon icon="${this.mainIcon}"></bbva-core-icon>
          
        
        <bbva-foundations-grid-tools-layout layout='[{"slot":"single","cols":{"sm":12,"md":12,"lg":12}}]'>
          <div slot="single">
            <div class="card-container">
              ${this.arrayPokemon.length > 0
                ? this.arrayPokemon.map(
                    (pokemon) => html`
                      <div class="card">
                        <h2>Pokémon: ${pokemon.name}</h2>
                        <img
                          src="${pokemon.image}"
                          alt="${pokemon.name}"
                          class="pokemon-image"
                        />
                        <p>Tipo: ${pokemon.types}</p>
                        <bbva-button-default size="l" 
                          @click="${() => this.fetchEvolutionChain(pokemon.speciesUrl, pokemon.name)}">
                          Ver Detalles
                        </bbva-button-default>
                      </div>
                    `
                  )
                : html`<p>Cargando datos de Pokémon...</p>`}
            </div>
            
            ${this.loading
              ? html`<bbva-foundations-spinner></bbva-foundations-spinner>`
              : ''}
            ${this.nextUrl
              ? html`
                  <bbva-button-default size="l" @click="${this.loadMorePokemon}">
                    Cargar más Pokémon
                  </bbva-button-default>
                `
              : ''}
              ${this.showModal
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
                                      <img class="pokemon-image" src="${evolution.image}" alt="${evolution.name}" class="evolution-image" />
                                      <p>Tipo: ${evolution.types}</p>
                                    </div> 
                                  `
                                )}
                              </ul>
                            `
                          : html`<p>${this.errorMessage}</p>`}
                        <bbva-button-default @click="${this.closeModal}">
                          Cerrar
                        </bbva-button-default>
                      </div>
                    </div>
                  `
                : ''}
          </div>
        </bbva-foundations-grid-tools-layout>
      </demo-web-template>
    `;
  }
}
