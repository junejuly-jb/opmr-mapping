export interface CPOE{
    mappingId: Number,
    productReference: String,
    type: String,
    conditions: Array<Conditions>
}

export interface Conditions{
    calories: Array<Number>,
    reference: String,
    referenceDID: Number | null,
    isUsed: Boolean,
    user: User,
    isModular: Boolean
    lastUpdate: Date | null
    FortifierKey: Array<FortifierKey>
}

export interface FortifierKey{
    fortifierKey: String | null,
    fortifierKeyDID: Number | null,
    calOzStart: Number | null,
    calOzEnd: Number | null,
    modular: Number | null
}

interface User {
    userID: Number | null,
    userFirstName: String,
    userLastName: String
}