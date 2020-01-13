import { Wording } from '../shared/models/wording.model';

export const wording: { [word: string]: Wording } = {
    dashboard: { en: 'Dashboard', de: 'Dashboard' },
    overview: { en: 'Overview', de: 'Überblick' },
    welcome: { en: 'Welcome', de: 'Willkommen' },
    warnings: { en: 'Warnings', de: 'Warnungen' },
    errors: { en: 'Errors', de: 'Fehler' },
    account: { en: 'Account', de: 'Konto' },
    inProgress: { en: 'In Progress', de: 'In Bearbeitung' },
    changePassword: { en: 'Change Password', de: 'Passwort ändern' },
    finished: { en: 'Finished', de: 'Erledigt' },
    todo: { en: 'To Do', de: 'Zu tun' },
    waiting: { en: 'Waiting', de: 'Warten' },
    clickOnThe: { en: 'Click on the Sign', de: 'Klicken Sie auf das Zeichen' },
    inOrderToAddWidget: { en: 'in order to add any widget', de: ', um ein Widget hinzuzufügen' },
    thisIsDecription: { en: 'This is a decription', de: 'Das ist eine Beschreibung' },
    error: { en: 'Error', de: 'Fehler' },
    notifications: { en: 'Notifications', de: 'Notifications' },
    doYouWantToLeave: { en: 'Do you want to leave the page?', de: 'Möchten Sie die Seite verlassen?' },
    youHaveUnsavedChanges: {
        en: 'You have unsaved changes! If you leave, your changes will be lost.',
        de: 'Sie haben nicht gespeicherte Änderungen! Wenn Sie diese Seite verlassen, gehen Ihre Änderungen verloren.'
    },
    yes: { en: 'Yes', de: 'Ja' },
    no: { en: 'No', de: 'Nein' }
};
