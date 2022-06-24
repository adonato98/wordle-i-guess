import { match } from 'assert'
import { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Keyboard from './components/Keyboard'
import Square, { SquareState } from './components/Square'
import theme from './theme'
import { checkValidWord } from './utils'

const wordLength = 5
const numTries = 6
const allowedKeys = 'abcdefghijklmnopqrstuvwxyz'

type GuessLetter = {
  char: string
  state: SquareState
}

type GuessWord = GuessLetter[]

const getWordLetterFrequencies = (word: string) =>
  word.split('').reduce((accum, curr) => {
    if (accum[curr]) {
      return { ...accum, [curr]: accum[curr] + 1 }
    } else {
      return { ...accum, [curr]: 1 }
    }
  }, {})

function App() {
  const [guesses, setGuesses] = useState<GuessWord[]>([])
  const [currentGuess, setCurrentGuess] = useState<string>('')
  const [correctWord, setCorrectWord] = useState<string>('')

  const correctLetters = guesses
    .flat()
    .filter((el) => el.state === SquareState.correctLetter)
    .map((el) => el.char)

  const matchedLetters = guesses
    .flat()
    .filter((el) => el.state === SquareState.matchedLetter)
    .map((el) => el.char)

  const incorrectLetters = guesses
    .flat()
    .filter((el) => el.state === SquareState.incorrectLetter)
    .map((el) => el.char)

  // pick the random word to use
  useEffect(() => {
    fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`)
      .then((res) => res.json())
      .then((res) => setCorrectWord(res[0]))
  }, [])

  const triesRemaining = numTries - guesses.length

  const handleKeyDown = (e) => {
    if (allowedKeys.includes(e.key)) {
      triesRemaining > 0 && currentGuess.length < wordLength && setCurrentGuess((cg) => cg + e.key)
    } else if (e.key === 'Enter') {
      if (currentGuess.length == wordLength && triesRemaining > 0 && checkValidWord(currentGuess)) {
        setGuesses((g) => [...g, checkGuess(currentGuess)])
        setCurrentGuess('')
      }
    } else if (e.key === 'Backspace') {
      triesRemaining > 0 && currentGuess.length > 0 && setCurrentGuess((cg) => cg.substring(0, cg.length - 1))
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const checkGuess = (guess: string): GuessWord => {
    const guessArr = guess.split('')

    // Mark all correct letters off the bat, defer state evaluation of others until after
    const guessCheckedForCorrectLetters = guessArr.map((guessLetter, idx) => ({
      char: guessLetter,
      state: guessLetter === correctWord.charAt(idx) ? SquareState.correctLetter : undefined
    }))

    // frequencies of the letters in the word minus the letters that were correctly guessed
    const remainingLetterFrequencies = getWordLetterFrequencies(
      correctWord
        .split('')
        .map((el, idx) => (el === guessArr[idx] ? '' : el))
        .join('')
    )

    const finalPassCheckedGuess = guessCheckedForCorrectLetters.map((el, idx) => {
      if (el.state !== undefined) return el
      // these letter states are green and already resolved
      else {
        // this is some wizard shit I can't really articulate, maybe I'll try again someday
        const guessLetterOccurrenceNumber = guessArr
          .slice(0, idx + 1)
          .reduce((accum, curr, idx2) => (curr == el.char && correctWord[idx2] !== curr ? accum + 1 : accum), 0)

        if (correctWord.includes(el.char) && guessLetterOccurrenceNumber <= remainingLetterFrequencies[el.char]) {
          return { ...el, state: SquareState.matchedLetter }
        }
        return { ...el, state: SquareState.incorrectLetter }
      }
    })

    return finalPassCheckedGuess as GuessWord
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledMainLayout className="App" id="root">
        <StyledHeader>
          <StyledHeaderText>n-tle</StyledHeaderText>
        </StyledHeader>
        <StyledBodySection>
          <StyledLetterGridSection>
            {guesses.map((word) =>
              word.map(({ char, state }, idx) => (
                <Square key={`past-guess-${idx}`} value={char.toUpperCase()} state={state} />
              ))
            )}
            {currentGuess.split('').map((letter, idx) => (
              <Square key={`current-guess-${idx}`} value={letter.toUpperCase()} />
            ))}
            {[...Array(Math.max((triesRemaining - 1) * wordLength + wordLength - currentGuess.length, 0)).keys()].map(
              (_, idx) => (
                <Square key={`empty-guess-${idx}`} />
              )
            )}
          </StyledLetterGridSection>
          <Keyboard
            correctLetters={correctLetters}
            matchedLetters={matchedLetters}
            incorrectLetters={incorrectLetters}
          />
        </StyledBodySection>
        <StyledFooterSection>
          <StyledText>Created by Andy Donato, who did not in fact invent the concept of Wordle</StyledText>
        </StyledFooterSection>
      </StyledMainLayout>
    </ThemeProvider>
  )
}

const StyledHeader = styled.div`
  height: 60px;
  background-color: ${(props) => props.theme.bg};
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledHeaderText = styled.h1`
  font-family: monospace;
  color: ${(props) => props.theme.text};
  vertical-align: center;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 5;
`

const StyledText = styled.p`
  font-family: monospace;
`

const StyledFooterSection = styled.div`
  height: 60px;
  background-color: ${(props) => props.theme.bg};
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledBodySection = styled.div`
  background-color: ${(props) => props.theme.fg};
  flex-grow: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`

const StyledLetterGridSection = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: ${wordLength * 60}px;
  flex-grow: 0;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
`

const StyledMainLayout = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
`

export default App
