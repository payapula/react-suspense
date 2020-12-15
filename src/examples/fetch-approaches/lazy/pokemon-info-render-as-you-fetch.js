// http://localhost:3000/isolated/examples/fetch-approaches/lazy/pokemon-info-render-as-you-fetch.js

import * as React from 'react'
import {PokemonDataView} from '../../../pokemon'

function PokemonInfo({pokemonResource}) {
  console.log('%cRender', 'font-size:1rem;color:red;border:1px dashed blue;')

  const pokemon = pokemonResource.data.read()

  console.log(
    '%c           Render Continues',
    'font-size:1rem;color:green;border:1px dashed blue;',
  )

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemonResource.image.read()} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

export default PokemonInfo
