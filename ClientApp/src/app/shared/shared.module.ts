import { NgModule, ModuleWithProviders } from '@angular/core';
import { NvGridModule, GRID_GLOBAL_CONFIG, FAKE_GridGlobalConfig } from 'nv-grid/src/public_api';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, de_DE } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from './pipes/translate.pipe';
import { RouteGuard } from './guards/route.guard';
import { LoginGuard } from './guards/login.guard';
import { DateFormatPipe } from './pipes/data-format-pipe';
import { StepsComponent } from './ui/steps/steps.component';
import { CirclesComponent } from './ui/circles/circles.component';
import { BarsComponent } from './ui/bars/bars.component';
import { WidgetsContainerComponent } from './ui/widgets-container/widgets-container.component';
import { GridComponent } from './ui/grid/grid.component';
import { GridsterModule } from 'angular-gridster2';
import { ChartComponent } from '../pages/welcome/dashboard/chart/chart.component';
import { FeedComponent } from './ui/feed/feed.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NotificationLogsComponent } from './ui/notification-logs/notification-logs.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
    declarations: [
        TranslatePipe,
        DateFormatPipe,
        GridComponent,
        StepsComponent,
        CirclesComponent,
        BarsComponent,
        ChartComponent,
        WidgetsContainerComponent,
        FeedComponent,
        NotificationLogsComponent],
    imports: [
        CommonModule,
        GridsterModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        RouterModule,
        NgZorroAntdModule,
        ScrollingModule,
        HttpClientModule,
        GoogleChartsModule.forRoot(),
        NvGridModule.forRoot({ language: 'en' }),
    ],

    exports: [
        NvGridModule,
        CommonModule,
        GoogleChartsModule,
        GridsterModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        TranslatePipe,
        DateFormatPipe,
        GridComponent,
        NotificationLogsComponent
    ]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                RouteGuard,
                LoginGuard,
                {
                    provide: NZ_I18N,
                    useValue: de_DE
                },
                {
                    provide: GRID_GLOBAL_CONFIG, useValue: FAKE_GridGlobalConfig,
                },
                DatePipe, DecimalPipe, CurrencyPipe
            ],
        };
    }
}
