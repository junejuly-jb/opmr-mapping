export interface CPOE{
    productReference: String,
    conditions: Array<Conditions>
}

export interface Conditions{
    calories: Array<Number>,
    reference: String,
    FortifierKey: Array<FortifierKey>
}

export interface FortifierKey{
    fortifierKey: String | null,
    calOzStart: Number | null,
    calOzEnd: Number | null,
    modular: Number | null
}