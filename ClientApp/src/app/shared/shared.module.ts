import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N, de_DE } from 'ng-zorro-antd';
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
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';
import { TodoWidgetComponent } from './ui/todo/todo-widget.component';
import { ImGridModule } from '@lorenzhh/im-grid';
import { NgZorroAntdModule } from './module/ng-zorro-antd.module';

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
        TodoWidgetComponent,
        FeedComponent,
        NotificationLogsComponent],
    imports: [
        CommonModule,
        GridsterModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        RouterModule,
        HttpClientModule,
        ImGridModule,
        GoogleChartsModule.forRoot(),
    ],

    exports: [
        CommonModule,
        GoogleChartsModule,
        GridsterModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        TranslatePipe,
        DateFormatPipe,
        GridComponent,
        ImGridModule,
        NotificationLogsComponent
    ]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                RouteGuard,
                LoginGuard,
                UnsavedChangesGuard,
                {
                    provide: NZ_I18N,
                    useValue: de_DE
                },
                DatePipe, DecimalPipe, CurrencyPipe
            ],
        };
    }
}
