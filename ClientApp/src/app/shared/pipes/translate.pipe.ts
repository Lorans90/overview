import { Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Wording } from '../models/wording.model';

/**
 * This pipe turns wording-objects to strings, of the currently selected language.
 */
@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    constructor(private settingsService: SettingsService) {
    }

    transform(wording: Wording): string | null {
        if (!wording) { return null; }

        return wording[this.settingsService.language.value];
    }
}
