import {
    NvColumnDataType,
    NvFilterControl,
    NvGridButtonsPosition,
    NvGridConfig,
    NvGridRowSelectionType,
    NvOperation
} from 'nv-grid/src/public_api';
import { Customer } from '../models/customer.model';
import { FormGroup, Validators } from '@angular/forms';


export const customersGridConfig = (actions?: {
    editCustomer: (customer: Customer) => any,
    deleteCustomer: (customer: Customer) => any
    createCustomer: () => any,
}): NvGridConfig => ({
    gridName: 'customers',
    title: { en: 'Customers', de: 'Kunden' },
    rowButtonsPosition: NvGridButtonsPosition.ExpandedRight,
    showRowIndex: true,
    hideSettingsButton: false,
    hideAllFilters: false,
    showExcelButton: true,
    showPaging: true,
    disableDragAndDrop: false,
    disableHideColumns: false,
    disableSortColumns: false,
    pinFirstRow: true,
    isSortAscending: false,
    sortBy: 'customerNo',
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
            key: 'customerNo',
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
                onValueChange: (form: FormGroup) =>
                    form.get('salesOrderCount').patchValue(form.get('customerNo').value - form.get('postCode').value)
            },
            // dataType: NvColumnDataType.Decimal,
            filter: {
                controlType: NvFilterControl.RangeNumber,
                values: []
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
                // controlType: NvFilterControl.Select,
                // selectValues: ['1', '2']
            }
        },
        {
            key: 'label',
            title: { en: 'Label EN', de: 'LABEL DE' },
            width: 80,
            isSortable: true,
            editControl: {
                editable: true
            },
            filter: {
                values: [],
            },
        },
        {
            key: 'customerName',
            title: { en: 'Customer Name', de: 'Kundenname' },
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
            key: 'street',
            title: { en: 'Street', de: 'Straße' },
            width: 130,
            isSortable: true,
            editControl: {
                editable: true,
                defaultValue: 'streeeet',
            },
            filter: {
                values: [],
            }
        },
        {
            key: 'postCode',
            title: { en: 'Post Code', de: 'PLZ' },
            width: 100,
            isSortable: true,
            editControl: {
                editable: true,
                onValueChange: (form: FormGroup) =>
                    form.get('salesOrderCount').patchValue(form.get('customerNo').value - form.get('postCode').value)
            },
            filter: {
                values: [],
            }
        },
        {
            key: 'city',
            title: { en: 'City', de: 'Ort' },
            width: 100,
            isSortable: true,
            editControl: {
                editable: true,
            },
            filter: {
                values: [],
                // controlType: NvFilterControl.Select,
                selectValues: [],
                multiSelect: false
            }
        },
        {
            key: 'countryName',
            title: { en: 'Country', de: 'Land' },
            width: 150,
            isSortable: true,
            editControl: {
                editable: true,
            },
            filter: {
                // controlType: NvFilterControl.Select,
                selectValues: [],
                values: []
            }
        },
        {
            key: 'email',
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
            key: 'tel',
            title: { en: 'Phone', de: 'Telefon' },
            width: 100,
            isSortable: true,
            editControl: {
                editable: true,
            },
            filter: {
                values: []
            }
        },
        {
            key: 'relationship',
            title: { en: 'Is Active', de: 'Ist Aktiv' },
            width: 100,
            isSortable: true,
            dataType: NvColumnDataType.Boolean,
            editControl: {
                editable: true
            },
            filter: {
                controlType: NvFilterControl.Boolean,
                values: []
            }
        },
        {
            key: 'salesOrderCount',
            title: { en: 'Purchases', de: 'Einkäufe' },
            width: 100,
            isSortable: true,
            editControl: {
                editable: false,
            },
            dataType: NvColumnDataType.Decimal,
            filter: {
                controlType: NvFilterControl.RangeNumber,
                values: []
            },
            footer: {
                label: 'Sum',
                operation: NvOperation.Sum
            },
        },
        {
            key: 'paymentDate',
            title: { en: 'Payment Date', de: 'Zahlungsdatum' },
            width: 100,
            isSortable: true,
            editControl: {
                editable: true,
            },
            dataType: NvColumnDataType.DateTime,
            filter: {
                values: []
            },
        },
    ],
    buttons: [
        {
            icon: 'edit',
            description: { en: 'Edit customer', de: 'Kunde Bearbeiten' },
            name: 'editCustomer',
            tooltip: { en: 'Edit customer', de: 'Kunde Bearbeiten' },
            actOnDoubleClick: true,
            actOnEnter: true,
            disabled: (customer: Customer) => customer ? customer.customerNo % 2 === 0 : false,
            hidden: (customer: Customer) => customer ? customer.customerNo % 6 === 0 : false,
            func: (customer: Customer) => {
                actions.editCustomer(customer);
            },
        },
        {
            icon: 'delete',
            description: { en: 'delete customer', de: 'Kunde löschen' },
            name: 'deleteCustomer',
            tooltip: { en: 'delete customer', de: 'Kunde löschen' },
            func: (customer: Customer) => {
                actions.deleteCustomer(customer);
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

