import namor from 'namor'

const range = (len:number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = () => {
    const statusChance = Math.random()
    return {
        firstName: namor.generate({ words: 1, numbers: 0 }),
        lastName: namor.generate({ words: 1, numbers: 0 }),
        age: Math.floor(Math.random() * 100),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status:
            statusChance > 0.66
                ? 'relationship'
                : statusChance > 0.33
                ? 'complicated'
                : 'single',
        col_1: Math.floor(Math.random() * 100),
        col_2: namor.generate({ words: 1, numbers: 0 }),
        col_3: namor.generate({ words: 1, numbers: 0 }),
        col_4: namor.generate({ words: 1, numbers: 0 }),
        col_5: namor.generate({ words: 1, numbers: 0 }),
    }
}

export default function makeData(len = 5000) {
    return range(len).map(d => {
        return {
            ...newPerson(),
            children: range(10).map(newPerson)
        };
    });
}

