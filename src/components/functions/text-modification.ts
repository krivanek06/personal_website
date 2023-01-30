import { LETTERS } from '../../models/constants.model'

export class TextModificator {
  // should be XXXX XXXX at the beginning
  maskText!: string
  interval: any = null
  originalText!: string
  setTextMethod!: (s: string) => void

  /// XXX XXX all the times
  private defaultMaskText!: string

  constructor() {}

  init(originalText: string, setTextMethod: (s: string) => void) {
    this.originalText = originalText
    this.setTextMethod = setTextMethod

    this.maskText = originalText
      .split('')
      .map((d) => (d === ' ' ? ' ' : 'X'))
      .join('')

    console.log('TextModificator init')
    this.defaultMaskText = this.maskText
  }

  startRandomTextGenerationLoop() {
    this.stopRandomTextGenerationLoop()

    this.interval = setInterval(() => {
      this.maskText = this.originalText
        .split('')
        .map((_, index) => {
          return LETTERS[Math.floor(Math.random() * 26)]
        })
        .join('')

      // change input
      this.setTextMethod(this.maskText)
    }, 30)
  }

  stopRandomTextGenerationLoop() {
    if (this.interval) {
      console.log('cleared')
      clearInterval(this.interval)
    }
  }

  async generateBackToOriginal() {
    await this.generateText(this.defaultMaskText, this.maskText)

    await this.generateText(this.originalText, this.defaultMaskText)
  }

  private generateText = (inputText: string, alreadyDisplayedWork?: string): Promise<void> => {
    // const indexes = Array.from(Array(inputText.length).keys())
    // const shuffledIndexes = getShuffledArr(indexes)
    let iteration = 0

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const newTex = inputText
          .split('')
          .map((_, index) => {
            // desired letter at shuffled index
            if (index < iteration) {
              return inputText[index]
            }

            // if I no longer want to change chars
            if (alreadyDisplayedWork) {
              return alreadyDisplayedWork[index]
            }

            // random letter
            return LETTERS[Math.floor(Math.random() * 26)]
          })
          .join('')

        // change input
        this.setTextMethod(newTex)

        if (iteration >= inputText.length) {
          clearInterval(interval)
          resolve()
        }

        // no recursion - go fast
        iteration += alreadyDisplayedWork ? 1 : 1 / 3
      }, 50)
    })
  }
}
