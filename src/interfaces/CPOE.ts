export interface CPOE{
    mappingId: number,
    productReference: string,
    type: string,
    isBreastMilk: boolean,
    fortified: boolean,
    conditions: Array<Conditions>
}

export interface Conditions{
    calories: Array<number>,
    reference: string,
    referenceDID: number | null,
    isUsed: boolean,
    user: User,
    isModular: boolean,
    lastUpdate: number | null,
    milktype: string | null,
    FortifierKey: Array<FortifierKey>
}

export interface FortifierKey{
    fortifierKey: string | null,
    fortifierKeyDID: number | null,
    calOzStart: number | null,
    calOzEnd: number | null,
    modular: number | null
}

interface User {
    userID: number | null,
    userFirstName: string,
    userLastName: string
}