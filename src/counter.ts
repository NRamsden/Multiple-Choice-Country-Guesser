export function setupCounter(element: HTMLButtonElement, randomCountry: string, correctCountry: string) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.textContent = randomCountry
  }
  const correctCheck = (randomCountry: string, correctCountry: string) => {
    if (randomCountry == correctCountry) {
      element.classList.add('correct')
    }
    else {
      element.classList.add('incorrect')
    }
  }
  element.addEventListener('click', () => correctCheck(randomCountry, correctCountry))
  setCounter(0)
}
