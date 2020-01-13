import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export enum Language {
    de = 'de',
    en = 'en'
}

export enum Locale {
    de = 'de-DE',
    us = 'en-US',
    gb = 'en-GB'
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    public language: BehaviorSubject<Language> = new BehaviorSubject<Language>(
        window.navigator.language === 'de-DE'
            ? Language.de
            : Language.en
    );
    public locale: BehaviorSubject<Locale> = new BehaviorSubject<Locale>(Locale.us);

    changeLanguage(language: Language) {
        this.language.next(language);
    }

    changeLocale(locale: Locale) {
        this.locale.next(locale);
    }
}
