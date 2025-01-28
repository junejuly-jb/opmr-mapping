export interface CPOE{
    mappingId: number,
    productReference: String,
    type: String,
    isBreastMilk: Boolean,
    conditions: Array<Conditions>
}

export interface Conditions{
    calories: Array<number>,
    reference: String,
    referenceDID: number | null,
    isUsed: Boolean,
    user: User,
    isModular: Boolean,
    lastUpdate: number | null,
    milktype: String | null,
    FortifierKey: Array<FortifierKey>
}

export interface FortifierKey{
    fortifierKey: String | null,
    fortifierKeyDID: number | null,
    calOzStart: number | null,
    calOzEnd: number | null,
    modular: number | null
}

interface User {
    userID: number | null,
    userFirstName: String,
    userLastName: String
}