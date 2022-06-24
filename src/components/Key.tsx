import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { SquareState } from './Square'
import { LightenDarkenColor } from 'lighten-darken-color'

type KeyProps = {
  letter: string
  label?: string
  state?: SquareState
  customBgColor?: string
  customFgColor?: string
  width: string
}

const Key: React.FC<KeyProps> = ({ letter, width, label, customBgColor, customFgColor, state = SquareState.empty }) => {
  const [shaded, setShaded] = useState<boolean>(false)
  const keyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (e) => e.key === letter && setShaded(true)
    const onKeyUp = (e) => e.key === letter && setShaded(false)

    // simulate keyboard behavior on click
    const onMouseDown = (e) => {
      keyRef.current &&
        e.target instanceof Node &&
        keyRef.current.contains(e.target) &&
        document.dispatchEvent(new KeyboardEvent('keydown', { key: letter }))
    }
    const onMouseUp = () => keyRef.current && document.dispatchEvent(new KeyboardEvent('keyup', { key: letter }))

    const listeners = {
      keydown: onKeyDown,
      keyup: onKeyUp,
      mousedown: onMouseDown,
      mouseup: onMouseUp
    }

    Object.entries(listeners).forEach(([evt, handler]) => document.addEventListener(evt, handler))
    return () => Object.entries(listeners).forEach(([evt, handler]) => document.removeEventListener(evt, handler))
  }, [letter])

  return (
    <StyledKey
      ref={keyRef}
      state={state}
      flexWidth={width}
      shaded={shaded}
      customBgColor={customBgColor}
      customFgColor={customFgColor}
    >
      <StyledKeyText>{label || letter.toUpperCase()}</StyledKeyText>
    </StyledKey>
  )
}

const StyledKey = styled.div<{
  state: SquareState
  flexWidth: string
  shaded: boolean
  customBgColor?: string
  customFgColor?: string
}>`
  background-color: ${(props) => {
    if (props.shaded && props.state === SquareState.empty && !props.customBgColor) {
      return '#ccc'
    } else {
      return LightenDarkenColor(props.customBgColor ?? props.theme[`${props.state}Square`], props.shaded ? -50 : 0)
    }
  }};
  border-radius: 4px;
  outline: 2px solid ${(props) => props.theme.bg};
  padding: 5px;
  margin: 3px;
  flex: 0 0 ${(props) => props.flexWidth};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.customFgColor ?? (props.state === SquareState.empty ? props.theme.bg : 'white')};
`

const StyledKeyText = styled.h1`
  font-family: monospace;
  font-size: 20px;
  user-select: none;
`

export default Key
