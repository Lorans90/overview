import {
    NvColumnDataType,
    NvFilterControl,
    NvGridButtonsPosition,
    NvGridConfig,
    NvRowHeight
} from 'nv-grid/src/public_api';
import { Validators } from '@angular/forms';
import { User } from '../models/user.model';

export const usersGridConfig = (actions?: {
    deleteUser: (user: User) => any
    createCustomer: () => any,
}): NvGridConfig => ({
    gridName: 'users',
    title: { en: 'Users', de: 'Benutzer' },
    rowButtonsPosition: NvGridButtonsPosition.ExpandedRight,
    showRowIndex: true,
    hideSettingsButton: false,
    hideAllFilters: false,
    showExcelButton: true,
    showPaging: true,
    disableDragAndDrop: false,
    disableHideColumns: false,
    disableSortColumns: false,
    isSortAscending: false,
    rowHeight: NvRowHeight.largeSize,
    editForm: {
        allowCreateNewRow: true,
        showCreateNewRowButton: true,
        showDiscardChangesButton: true,
        showSaveChangesButton: true,
        allowJumpToNextCellIfInvalid: true,
    },
    paging: {
        pageNumber: 1,
        pageSize: 25
    },
    columns: [
        {
            key: 'id',
            title: 'id'
        },
        {
            key: 'username',
            title: { en: 'Customer No', de: 'Kundennr' },
            width: 150,
            isSortable: true,
            editControl: {
                editable: true,
                validation: {
                    validators: [
                        Validators.required,
                        Validators.min(1)
                    ],
                },
            },
        },
        {
            key: 'title',
            title: { en: 'Salutation', de: 'Anrede' },
            width: 80,
            isSortable: true,
            editControl: {
                editable: true,
                disabled: false,
                validation: {
                    validators: [Validators.required]
                }
            },
            filter: {
                values: [],
            }
        },
        {
            key: 'displayName',
            title: { en: 'Display Name', de: 'Anzeigename' },
            editControl: {
                editable: true,
            },
            width: 180,
            isSortable: true,
            filter: {
                values: []
            }
        },
        {
            key: 'location',
            title: { en: 'Location', de: 'Ort' },
            width: 130,
            isSortable: true,
            editControl: {
                editable: true,
            },
            filter: {
                values: [],
            }
        },
        {
            key: 'tel',
            title: { en: 'Telefon', de: 'Telefonnumer' },
            width: 130,
            isSortable: true,
            editControl: {
                editable: true,
            },
            filter: {
                values: [],
            }
        },
        {
            key: 'eMail',
            title: { en: 'E-Mail-Address', de: 'E-Mail-Adresse' },
            width: 200,
            isSortable: true,
            editControl: {
                editable: true
            },
            filter: {
                values: []
            }
        },
        {
            key: 'isActive',
            title: { en: 'Is Active', de: 'Ist Aktiv' },
            width: 100,
            isSortable: true,
            dataType: NvColumnDataType.Boolean,
            editControl: {
                editable: true,
                defaultValue: true
            },
            filter: {
                controlType: NvFilterControl.Boolean,
                values: []
            }
        },
        {
            key: 'lastLoggedIn',
            title: { en: 'Last logged in', de: 'Letzte Anmeldung' },
            width: 100,
            isSortable: true,
            editControl: {
                editable: false,
            },
            dataType: NvColumnDataType.DateTime,
            filter: {
                values: []
            },
        },
    ],
    buttons: [
        {
            icon: 'delete',
            description: { en: 'delete customer', de: 'Kunde löschen' },
            name: 'deleteCustomer',
            tooltip: { en: 'delete customer', de: 'Kunde löschen' },
            func: (user: User) => {
                actions.deleteUser(user);
            },
        }
    ],
    toolbarButtons: [
        {
            tooltip: { en: 'Save', de: 'Speichern' },
            icon: 'save',
            title: { en: 'Save', de: 'Speichern' },
            func: () => null,
            class: 'new-class'
        }]
});

