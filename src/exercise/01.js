// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import {Suspense} from 'react'
// 🐨 you'll also need to get the fetchPokemon function from ../pokemon:
import {
  PokemonDataView,
  fetchPokemon,
  PokemonErrorBoundary,
  PokemonInfoFallback,
} from '../pokemon'
import {createResource} from '../utils'

// 💰 use it like this: fetchPokemon(pokemonName).then(handleSuccess, handleFailure)

// 🐨 create a variable called "pokemon" (using let)
// let pokemon
// let pokemonError
// 💣 delete this now...
// const pokemon = {
//   name: 'TODO',
//   number: 'TODO',
//   attacks: {
//     special: [{name: 'TODO', type: 'TODO', damage: 'TODO'}],
//   },
//   fetchedAt: 'TODO',
// }

// We don't need the app to be mounted to know that we want to fetch the pokemon
// named "pikachu" so we can go ahead and do that right here.
// 🐨 assign a pokemonPromise variable to a call to fetchPokemon('pikachu')
// const pokemonPromise = fetchPokemon('piasdkachu')
//   .then(result => (pokemon = result))
//   .catch(err => {
//     pokemonError = err
//   })

const resource = createResource(fetchPokemon('pikadchu'))

function PokemonInfo() {
  console.log('rendered')
  const pokemon = resource.read()

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
          <Suspense fallback={<PokemonInfoFallback />}>
            <PokemonInfo />
          </Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
