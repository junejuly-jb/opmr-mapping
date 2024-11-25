export interface CPOE{
    productReference: String,
    conditions: Array<Conditions>
}

export interface Conditions{
    condition: String,
    reference: String,
    FortifierKey: String,
    CalOzStart: Number | null,
    CalOzEnd: Number | null,
    Modular: Number | null
}

export interface MapType {
    productReference: String,
    conditions: Array<Conditions>
}

export const emptyMap: MapType = {
    productReference: "",
    conditions: [],
};