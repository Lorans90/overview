import { Pipe, PipeTransform } from '@angular/core';
import { SettingsService, Locale } from '../services/settings.service';

@Pipe({
    name: 'dateFormat',
    pure: true
})
export class DateFormatPipe implements PipeTransform {
    DATE_FMT_DE = 'dd.MM.y';
    DATE_FMT_US = 'MM/dd/y';
    DATE_FMT_GB = 'dd/MM/y';

    DATE_TIME_FMT_DE = `${this.DATE_FMT_DE} HH:mm:ss`;
    DATE_TIME_FMT_US = `${this.DATE_FMT_US} h:mm:ss a`;
    DATE_TIME_FMT_GB = `${this.DATE_FMT_GB} h:mm:ss a`;

    constructor(private settingsService: SettingsService) {
    }

    transform(locale: Locale): string | null {
        return locale === 'en-GB'
            ? this.DATE_TIME_FMT_GB
            : (locale === 'en-US'
                ? this.DATE_TIME_FMT_US
                : this.DATE_TIME_FMT_DE);
    }
}
