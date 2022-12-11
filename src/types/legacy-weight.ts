type LegacyDate = {
    date: {
        seconds: number
        nanoseconds: number
    }
}

export default interface LegacyWeight {
    weight: number | string 
    date: LegacyDate
}