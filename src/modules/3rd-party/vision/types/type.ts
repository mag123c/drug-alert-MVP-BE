interface I_Drug {
    type: 'drug',
    text: string,
}

interface I_Dosage {
    type: 'dosage',
    text: string,
}

interface I_DosageDetail {
    day: number,
    times: number,
    amount: number,
}

export type T_DrugInfo = I_Drug | I_Dosage;

export type T_DrugRespose = {
    drugName: string,
    dosage: I_DosageDetail | null,
}