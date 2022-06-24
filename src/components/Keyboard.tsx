import styled from 'styled-components'
import Key from './Key'
import { SquareState } from './Square'

const keyLines = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
]

const keyboardWidth = 'min(100vw, 600px)'

type KeyboardProps = {
  correctLetters: string[]
  matchedLetters: string[]
  incorrectLetters: string[]
}

const Keyboard: React.FC<KeyboardProps> = ({ correctLetters = [], matchedLetters = [], incorrectLetters = [] }) => {
  const letterToState = (letter: string) => {
    if (correctLetters.includes(letter)) return SquareState.correctLetter
    if (matchedLetters.includes(letter)) return SquareState.matchedLetter
    if (incorrectLetters.includes(letter)) return SquareState.incorrectLetter
    return undefined
  }

  return (
    <KeyboardContainer>
      {keyLines.map((line, lineIdx) => (
        <KeyLine>
          {lineIdx === 2 && <Key letter="Backspace" label="⌫" width={`calc(${keyboardWidth} * 0.15)`} />}
          {line.map((letter) => (
            <Key letter={letter} width={`calc(${keyboardWidth} * 0.1)`} state={letterToState(letter)} />
          ))}
          {lineIdx === 2 && <Key letter="Enter" label="⏎" width={`calc(${keyboardWidth} * 0.15)`} />}
        </KeyLine>
      ))}
    </KeyboardContainer>
  )
}

const KeyLine = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
`

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  //   align-items: stretch;
  width: ${keyboardWidth};
`

export default Keyboard
