export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  const statusChance = Math.random()
  return {
    firstName: Math.random().toString(36).substring(7),
    lastName: Math.random().toString(36).substring(7),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single',
  }
}

export type PersonData = Person & {
  subRows?: PersonData[]
}

export function makeData(...lens: number[]): PersonData[] {
  const makeDataLevel = (depth = 0): PersonData[] => {
    const len = lens[depth]
    return range(len).map(() => ({
      ...newPerson(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }))
  }
  return makeDataLevel()
}
