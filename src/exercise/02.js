// Render as you fetch
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
  // 🐨 you'll need PokemonErrorBoundary here
} from '../pokemon'
// 🐨 you'll need createResource from ../utils
import {createResource} from '../utils'

function PokemonInfo({pokemonResource}) {
  // 💣 you're pretty much going to delete all this stuff except for the one
  // place where 🐨 appears
  // const [state, setState] = React.useReducer((s, a) => ({...s, ...a}), {
  //   pokemon: null,
  //   error: null,
  //   status: 'pending',
  // })

  // const {pokemon, error, status} = state

  // React.useEffect(() => {
  //   let current = true
  //   setState({status: 'pending'})
  //   fetchPokemon(pokemonName).then(
  //     p => {
  //       if (current) setState({pokemon: p, status: 'success'})
  //     },
  //     e => {
  //       if (current) setState({error: e, status: 'error'})
  //     },
  //   )
  //   return () => (current = false)
  // }, [pokemonName])

  // 💰 This will be the fallback prop of <React.Suspense />
  // if (status === 'pending') {
  //   return
  // }

  // 💰 This is the same thing the PokemonErrorBoundary renders
  // if (status === 'error') {
  //   return (
  //     <div>
  //       There was an error.
  //       <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  //     </div>
  //   )
  // }

  const pokemon = pokemonResource.read()

  // 💰 this is the part that will suspend
  // 🐨 instead of accepting the pokemonName as a prop to this component
  // you'll accept a pokemonResource.
  // 💰 you'll get the pokemon from: pokemonResource.read()
  // 🐨 This will be the return value of this component. You wont need it
  // to be in this if statement anymore thought!
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  // 🐨 add a useState here to keep track of the current pokemonResource

  const [pokemonResource, setPokemonResource] = React.useState()

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
    } else {
      setPokemonResource(createPokemonResource(pokemonName))
    }
  }, [pokemonName])
  // 🐨 Add a useEffect here to set the pokemon resource to a createResource
  // with fetchPokemon whenever the pokemonName changes.
  // If the pokemonName is falsy, then set the pokemon resource to null

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={() => {
              setPokemonName('')
            }}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          // 🐨 wrap PokemonInfo in a PokemonErrorBoundary and React.Suspense component
          // to manage the error and loading states that PokemonInfo was managing
          // before your changes.
          //
          // 💰 The PokemonErrorBoundary has the ability to recover from errors
          // if you pass an onReset handler (or resetKeys). As a mini
          // extra-credit, try to make that work.
          // 📜 https://www.npmjs.com/package/react-error-boundary
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
