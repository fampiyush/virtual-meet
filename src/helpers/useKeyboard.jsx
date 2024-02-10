import { useEffect, useRef, useContext } from 'react'
import { PlayerContext } from './contextProvider'

export default function useKeyboard() {
  const keyMap = useRef({})

  const { controlsAllowed } = useContext(PlayerContext)

  useEffect(() => {
    if(controlsAllowed){
      const onDocumentKey = (e) => {
        keyMap.current[e.code] = e.type === 'keydown'
      }
      document.addEventListener('keydown', onDocumentKey)
      document.addEventListener('keyup', onDocumentKey)
      return () => {
        document.removeEventListener('keydown', onDocumentKey)
        document.removeEventListener('keyup', onDocumentKey)
      }
    }
  }, [controlsAllowed])

  return keyMap.current
}