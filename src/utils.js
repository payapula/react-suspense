// 🚨 This should NOT be copy/pasted for production code and is only here
// for experimentation purposes. The API for suspense (currently throwing a
// promise) is likely to change before suspense is officially released.
// This was strongly inspired by work done in the React Docs by Dan Abramov
function createResource(promise) {
  console.log(
    '%c Promise Started ',
    'font-size:1rem;color:violet;border:1px dashed violet;',
  )

  let status = 'pending'
  let result = promise.then(
    resolved => {
      console.log(
        '%c Promise Resoloved -> ',
        'font-size:1rem;color:green;border:1px dashed violet;',
      )
      status = 'success'
      result = resolved
    },
    rejected => {
      console.log(
        '%c Promise Rejected -> ',
        'font-size:1rem;color:green;border:1px dashed violet;',
      )
      status = 'error'
      result = rejected
    },
  )
  return {
    read() {
      if (status === 'pending') {
        console.log('%c Throw Promise', 'font-size:1rem;color:orange;')
        throw result // Promise itself to let know suspense wait for complete to rerender the component
      }
      if (status === 'error') {
        console.log('%c Throw Error', 'font-size:1rem;color:red;')

        throw result // error data, handled by error boundary
      }
      if (status === 'success') {
        console.log(
          '%c Throw Result -> ' +
            JSON.stringify(result?.name ? result.name : result, null, 2),
          'font-size:1rem;color:green;',
        )

        return result // Success data handled by our component
      }
      throw new Error('This should be impossible')
    },
  }
}

function preloadImage(src) {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
  })
}

export {createResource, preloadImage}
