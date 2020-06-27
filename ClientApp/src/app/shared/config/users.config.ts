import { ImColumn, ImFieldType, ChildTableComponent, ImColumnType } from '@lorenzhh/im-grid';
import { Validators } from '@angular/forms';

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
        columnType: ImColumnType.Boolean
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
        validators: [Validators.required]
    },
    {
        key: 'location',
        title: 'location',
    },
    {
        key: 'roles',
        title: 'Roles',
        childrenConfig: {
            columns: [

                {
                    key: 'id',
                    title: 'Id',
                    isUnique: true
                },
                {
                    key: 'name',
                    title: 'Role Name',
                },
            ],
            componentConfig: {
                componentToPort: ChildTableComponent
            }
        },
        selectValues: ['Admin', 'User'],
    },
];
