export interface CPOE{
    productReference: String,
    conditions: Array<Conditions>
}

export interface Conditions{
    condition: String,
    reference: String,
    theFortifierParser: Array<FortifierParser>
}

export interface FortifierParser{
    FortifierKey: String,
    CalOzStart: number | null,
    CalOzEnd: number,
    Modular: number | null
}

export interface MapType {
    productReference: String,
    conditions: Array<Conditions>
}

export const emptyMap: MapType = {
    productReference: "",
    conditions: [],
};