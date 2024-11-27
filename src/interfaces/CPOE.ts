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
    fortifierKey: String,
    calOzStart: Number | null,
    calOzEnd: Number | null,
    Modular: Number | null
}