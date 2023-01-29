import { LETTERS } from '../../models/constants.model'

export const textModification = (
  inputText: string,
  setInputText: (s: string) => void,
  longRuntime = false,
) => {
  let iteration = 0

  const interval = setInterval(() => {
    const newTex = inputText
      .split('')
      .map((letter, index) => {
        // if (index < iteration) {
        //   return inputText[index]
        // }
        return LETTERS[Math.floor(Math.random() * 26)]
      })
      .join('')

    // change input
    setInputText(newTex)

    if (iteration >= inputText.length) {
      console.log('clearing')
      clearInterval(interval)
      setInputText(inputText)
    }
    iteration += longRuntime ? 1 / 3 : 1
  }, 50)
}
