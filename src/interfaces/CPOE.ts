export interface CPOE{
    mappingId: Number,
    productReference: String,
    type: String,
    conditions: Array<Conditions>
}

export interface Conditions{
    calories: Array<Number>,
    reference: String,
    isUsed: Boolean,
    userId: Number | null,
    isModular: Boolean
    FortifierKey: Array<FortifierKey>
}

export interface FortifierKey{
    fortifierKey: String | null,
    calOzStart: Number | null,
    calOzEnd: Number | null,
    modular: Number | null
}