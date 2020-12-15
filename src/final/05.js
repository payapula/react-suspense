// Suspense Image
// http://localhost:3000/isolated/final/05.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

// ❗❗❗❗
// 🦉 On this one, make sure that you UNCHECK the "Disable cache" checkbox
// in your DevTools "Network Tab". We're relying on that cache for this
// approach to work!
// ❗❗❗❗

function preloadImage(src) {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
  })
}

const imgSrcResourceCache = {}

function Img({src, alt, ...props}) {
  let imgSrcResource = imgSrcResourceCache[src]
  if (!imgSrcResource) {
    imgSrcResource = createResource(preloadImage(src))
    imgSrcResourceCache[src] = imgSrcResource
  }
  return <img src={imgSrcResource.read()} alt={alt} {...props} />
}

function PokemonInfo({pokemonResource}) {
  console.log('%cRender', 'font-size:1rem;color:red;border:1px dashed blue;')

  const pokemon = pokemonResource.read()

  console.log(
    '%cRender Continues',
    'font-size:1rem;color:green;border:1px dashed blue;',
  )

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <Img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

const pokemonResourceCache = {}

function getPokemonResource(name) {
  const lowerName = name.toLowerCase()
  let resource = pokemonResourceCache[lowerName]
  if (resource) {
    console.log(
      '%c Cached Resource',
      'font-size:1rem;color:green;border: 1px solid green;',
    )
  }

  if (!resource) {
    console.log(
      '%c Fresh Resource',
      'font-size:1rem;color:red;border: 1px solid red;',
    )

    resource = createPokemonResource(lowerName)
    pokemonResourceCache[lowerName] = resource
  }

  console.log('%c return Resource', 'font-size:1rem;color:black;')

  return resource
}

function createPokemonResource(pokemonName) {
  console.log('%cCreate Resource', 'font-size:1rem;color:black;')

  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      console.log('%c Set resource', 'font-size:1rem;color:black;')

      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

export default App
