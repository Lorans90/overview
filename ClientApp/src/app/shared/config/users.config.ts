import { ImColumn, ImFieldType, ChildTableComponent, ImColumnType } from '@lorenzhh/im-grid';
import { Validators } from '@angular/forms';
import { Role } from '../models/role.model';

export const columns: ImColumn[] = [
    {
        key: 'id',
        title: 'Id',
        isUnique: true
    },
    {
        key: 'username',
        title: 'username',
        validators: [Validators.required]
    },
    {
        key: 'displayName',
        title: 'displayName',
        validators: [Validators.required]
    },
    {
        key: 'title',
        title: 'title',

    },
    {
        key: 'isActive',
        title: 'isActive',
        columnType: ImColumnType.Boolean,
        defaultValue: true
    },
    {
        key: 'lastLoggedIn',
        title: 'lastLoggedIn',
        columnType: ImColumnType.Date,
        editable: false,
        creatable: false,
    },
    {
        key: 'tel',
        title: 'tel',
    },
    {
        key: 'eMail',
        title: 'eMail',
    },
    {
        key: 'location',
        title: 'location',
    },
    {
        key: 'roles',
        title: 'Roles',
        columnType: ImColumnType.Array,
        selectValues: [
            { id: 1, name: 'admin' },
            { id: 2, name: 'user' }
        ],

        labelProperty: 'name',
        valueProperty: 'id',
        multiSelect: true,
        compareFn: (o1: Role, o2: Role) => o1 && o2 ? o1.id === o2.id : o1 === o2,
        validators: [Validators.required],
    },
];
