import { LETTERS } from '../../models/constants.model'

export const textModification = (
  inputText: string,
  setInputText: (s: string) => void,
  longRuntime = false,
  stopRecursion = false,
  nonsenseText = '',
) => {
  let iteration = 0

  const interval = setInterval(
    () => {
      const newTex = inputText
        .split('')
        .map((_, index) => {
          // return unchanged first characters
          if (stopRecursion && index < iteration) {
            return inputText[index]
          }

          // recursion happened
          return nonsenseText[index] ?? LETTERS[Math.floor(Math.random() * 26)]
        })
        .join('')

      // change input
      setInputText(newTex)

      if (iteration >= inputText.length) {
        clearInterval(interval)

        // recursion
        if (!stopRecursion) {
          console.log('stopRecursion')
          textModification(inputText, setInputText, longRuntime, true, newTex)
        }
      }

      // no recursion - go fast
      iteration += !stopRecursion && longRuntime ? 1 / 3 : 1
    },
    stopRecursion ? 90 : 50,
  )
}
