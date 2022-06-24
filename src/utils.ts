import allWords from './all-words.json'

export const checkValidWord = (word: string) => (allWords as string[]).includes(word)
