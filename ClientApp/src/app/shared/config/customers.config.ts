import { ImColumn, ImColumnType } from '@lorenzhh/im-grid'

export const columns: ImColumn[] = [
    {
        key: 'id',
        title: 'id',
        isUnique: true
    },
    {
        key: 'customerNo',
        title: 'Customer No',
        columnType: ImColumnType.Int
    },
    {
        key: 'title',
        title: 'Salutation',
    },
    {
        key: 'customerName',
        title: 'Customer Name',
    },
    {
        key: 'street',
        title: 'Street',
    },
    {
        key: 'postCode',
        title: 'Post Code',
    },
    {
        key: 'city',
        title: 'City',
    },
    {
        key: 'countryName',
        title: 'Country',
    },
    {
        key: 'email',
        title: 'E-Mail-Address',
    },
    {
        key: 'tel',
        title: 'Phone',
    },
    {
        key: 'relationship',
        title: 'Is Active',
        columnType: ImColumnType.Boolean

    },
    {
        key: 'salesOrderCount',
        title: 'Purchases',
        columnType: ImColumnType.Int

    },
    {
        key: 'paymentDate',
        title: 'Payment Date',
        columnType: ImColumnType.Date

    }];

