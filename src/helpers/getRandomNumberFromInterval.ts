export const roundNumber = (number: number): number => {
  const roundedValue = Math.floor(number)
  return isNaN(roundedValue) ? number : roundedValue
}

export const getRandomNumberFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getNoun = (
  number: number,
  one: string,
  two: string,
  five: string,
) => {
  let n = Math.abs(number)
  n %= 100
  if (n >= 5 && n <= 20) {
    return five
  }
  n %= 10
  if (n === 1) {
    return one
  }
  if (n >= 2 && n <= 4) {
    return two
  }
  return five
}
