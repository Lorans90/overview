import { NvFilterControl, NvGridConfig, NvGridRowSelectionType } from '../src/public_api';
import { cloneDeep } from 'lodash';

const gridConfig: NvGridConfig = {
  gridName: 'inMemoryGridConfig',
  excelExportUrl: 'customers/getCustomersAsExcel',
  title: 'In Memory Grid',
  rowSelectionType: NvGridRowSelectionType.Checkbox,
  showRowIndex: true,
  hideSettingsButton: true,
  paging: {
    pageNumber: 1,
    pageSize: 100
  },
  columns: [
    {
      key: 'customerNo',
      title: 'Kundennr.',
      width: 150,
      isSortable: true,
      filter: {
        values: []
      }
    },
    {
      key: 'title',
      title: 'Anrede',
      width: 80,
      isSortable: true,
      filter: {
        values: [],
        controlType: NvFilterControl.Select,
        selectValues: []
      }
    },
    {
      key: 'customerName',
      title: 'Kunde',
      width: 180,
      isSortable: true,
      filter: {
        values: []
      }
    },
    {
      key: 'street',
      title: 'Straße',
      width: 130,
      isSortable: true,
      filter: {
        values: [],
      }
    },
    {
      key: 'postCode',
      title: 'PLZ',
      width: 100,
      isSortable: true,
      filter: {
        values: [],
      }
    },
    {
      key: 'city',
      title: 'Ort',
      width: 100,
      isSortable: true,
      filter: {
        values: [],
        controlType: NvFilterControl.Select,
        selectValues: []
      }
    },
    {
      key: 'countryName',
      title: 'Land',
      width: 100,
      isSortable: true,
      filter: {
        controlType: NvFilterControl.Select,
        selectValues: [],
        values: []
      }
    },
    {
      key: 'receiverFirstName',
      title: 'z.H. Vorname',
      width: 150,
      isSortable: true,
      filter: {
        values: []
      }

    },
    {
      key: 'receiverLastName',
      title: 'z.H. Nachname',
      width: 100,
      isSortable: true,
      filter: {
        values: []
      }

    },
    {
      key: 'email',
      title: 'Email',
      width: 100,
      isSortable: true,
      filter: {
        values: []
      }
    },
    {
      key: 'tel',
      title: 'Tel',
      width: 100,
      isSortable: true,
      filter: {
        values: []
      }
    },
    {
      key: 'relationship',
      title: 'Beziehung',
      width: 100,
      isSortable: true,
      filter: {
        values: []
      }
    },
    {
      key: 'salesOrderCount',
      title: 'Einkäufe',
      width: 100,
      isSortable: true,
      filter: {
        values: []
      }
    },
  ],
  buttons: [
    {
      icon: 'edit',
      description: 'Kunden bearbeiten',
      name: 'editCustomer',
      tooltip: 'Kunden bearbeiten',
      actOnDoubleClick: true,
      func: () => null
    },
    {
      icon: 'delete',
      description: 'Kunde löschen',
      name: 'deleteCustomer',
      tooltip: 'Kunde löschen',
      func: () => null
    }
  ],
  toolbarButtons: [
    {
      title: 'new',
      tooltip: 'Kunde erfassen',
      icon: 'plus-circle-o',
      func: () => null
    }
  ]
};

export function getGridConfig(): NvGridConfig {
  return cloneDeep(gridConfig);
}
