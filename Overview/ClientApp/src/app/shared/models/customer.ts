export interface Customer {

    id?: number;
    customerNo?: number;
    receiverFirstName?: string;
    receiverLastName?: string;
    customerName: string;
    street?: string;
    city?: string;
    country?: Country;
    countryName: string;
    countryId: number;
    email: string;
    tel: string;
    relationship: string;
    postCode?: string;
    title: string;
    vatIdNo?: string;
    salesOrderCount: number;
}

export interface Country {
    id: number;
    name: string;
    isoCode: string;
    isEUMember: boolean;
}
