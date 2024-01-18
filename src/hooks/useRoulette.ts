import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getRandomNumberFromInterval } from '~/helpers'

interface UseRouletteReturnType<T> {
  isSpinning: boolean
  isSpinEnd: boolean
  slots: T[]
  spin: () => number | undefined
  transitionEndHandler: () => void
}

interface UseRouletteArgType<T> {
  /** Список наград */
  items: T[]
  /** Выпавшая награда */
  winner: T
  /** Контейнер к которому будет применен трансформ */
  spinContainerRef: MutableRefObject<HTMLDivElement | null>
  /** Контайнер в котором находится спин таргет, для вычета оффсета */
  containerRef: MutableRefObject<HTMLDivElement | null>
  /** Длительность крутки */
  transitionDuration: number
  /** Ширина приза */
  itemWidth: number
  /** Кол-во айтемов в рулетке,
   *  также этот параметр влияет на максимальный сдвиг по оси x,
   *  поэтому он влияет на скорость анимации */
  virtualItemsCount?: number
}

/** Рандомизатор массива */
const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

const useRoulette = <T>({
  spinContainerRef,
  containerRef,
  transitionDuration,
  itemWidth,
  items,
  winner,
  virtualItemsCount = 74,
}: UseRouletteArgType<T>): UseRouletteReturnType<T> => {
  const [prizeIndex] = useState(() =>
    getRandomNumberFromInterval(virtualItemsCount / 2, virtualItemsCount - 10),
  )
  const [slots, setSlots] = useState<T[]>([])
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [isSpinEnd, setIsSpinEnd] = useState<boolean>(false)

  /** Генерация слотов */
  const setupSlots = useCallback(() => {
    const itemLength: number = items.length

    const setActors = (from: number, to: number): T[] => {
      let j = 0
      const createdSlots: T[] = []

      for (let i = from; i <= to; i += 1) {
        createdSlots.push(items[j])
        j = j === itemLength - 1 ? 0 : j + 1
      }
      return shuffle(createdSlots)
    }

    setSlots((): T[] => {
      let newSlots = [...setActors(0, prizeIndex - 1)]
      newSlots[prizeIndex] = winner
      newSlots = newSlots.concat(
        setActors(prizeIndex + 1, virtualItemsCount - 1),
      )

      return newSlots
    })
  }, [items, prizeIndex, virtualItemsCount, winner])

  useEffect(() => {
    setupSlots()
  }, [setupSlots])

  /** Сброс к заводским настройкам */
  const prepare = useCallback((): void => {
    if (!spinContainerRef.current) return

    spinContainerRef.current.style.transition = 'none'
    spinContainerRef.current.style.left = '0px'
  }, [spinContainerRef])

  const spin = useCallback((): number | undefined => {
    if (!spinContainerRef.current) return

    prepare()

    const rootWidth = containerRef.current?.getBoundingClientRect().width ?? 0

    const additionalOffset = getRandomNumberFromInterval(
      itemWidth / 6,
      itemWidth / 4,
    )

    /** Координата остановки */
    const randStop
      = (prizeIndex - 1) * itemWidth + rootWidth / 2 + additionalOffset

    /** Запуск рулетки */

    requestAnimationFrame(() => {
      if (!spinContainerRef.current) return

      spinContainerRef.current.style.transition = `left ${transitionDuration}s ease-out`
      spinContainerRef.current.style.willChange = 'left'
      spinContainerRef.current.style.left = `-${randStop}px`
    })

    return prizeIndex
  }, [spinContainerRef, prepare, containerRef, itemWidth, prizeIndex, transitionDuration])

  const transitionEndHandler = useCallback(() => {
    setIsSpinning(false)
    setIsSpinEnd(true)

    if (!spinContainerRef.current) {
      return
    }

    spinContainerRef.current.style.willChange = 'auto'
    spinContainerRef.current.style.transition = 'none'
  }, [spinContainerRef])

  return useMemo(
    () => ({
      isSpinning,
      isSpinEnd,
      slots,
      spin,
      transitionEndHandler,
    }),
    [isSpinning, isSpinEnd, slots, spin, transitionEndHandler],
  )
}

export default useRoulette
