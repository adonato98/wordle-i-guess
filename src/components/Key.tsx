import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { SquareState } from './Square'
import { LightenDarkenColor } from 'lighten-darken-color'

type KeyProps = {
  letter: string
  label?: string
  state?: SquareState
  width: string
}

const Key: React.FC<KeyProps> = ({ letter, label = undefined, width, state }) => {
  const [shaded, setShaded] = useState<boolean>(false)

  useEffect(() => {
    const onKeyDown = (e) => e.key === letter && setShaded(true)
    const onKeyUp = (e) => e.key === letter && setShaded(false)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <StyledKey state={state} flexWidth={width} shaded={shaded}>
      <StyledKeyText>{label || letter.toUpperCase()}</StyledKeyText>
    </StyledKey>
  )
}

const StyledKey = styled.div<{
  state?: SquareState
  flexWidth: string
  shaded: boolean
}>`
  background-color: ${(props) =>
    LightenDarkenColor(props.theme[`${props.state}Square`] ?? '#a7aaac', props.shaded ? -50 : 0)};
  border-radius: 4px;
  padding: 5px;
  margin: 3px;
  flex: 0 0 ${(props) => props.flexWidth};
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledKeyText = styled.h1`
  color: white;
  font-family: monospace;
  font-size: 20px;
`

export default Key
