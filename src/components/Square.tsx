import React from 'react'
import styled, { css } from 'styled-components'

const SquareColors = {
  default: 'transparent',
  grey: '#787c7f',
  yellow: '#c8b653',
  green: '#6ca965'
}

export enum SquareState {
  empty = 'empty',
  incorrectLetter = 'incorrectLetter',
  matchedLetter = 'matchedLetter',
  correctLetter = 'correctLetter'
}

type SquareProps = {
  value?: string | null
  state?: SquareState
}

const Square: React.FC<SquareProps> = ({ value = '', state = SquareState.empty }) => {
  return (
    <StyledSquare state={state}>
      <StyledSquareValue>{value}</StyledSquareValue>
    </StyledSquare>
  )
}

type StyledSquareProps = {
  state: SquareState
}

const StyledSquare = styled.div<StyledSquareProps>`
  background-color: ${(props) => props.theme[`${props.state}Square`]};
  outline: 2px solid ${(props) => props.theme.bg};
  color: ${(props) => (props.state === SquareState.empty ? props.theme.bg : 'white')};
  width: 50px;
  height: 50px;
  margin: 5px;
  display: flex;
`

const StyledSquareValue = styled.p`
  font-size: 30px;
  margin: auto;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  user-select: none;
`

export default Square
