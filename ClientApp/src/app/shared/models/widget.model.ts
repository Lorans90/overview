import { WidgetType } from '../enums/widgets.enum';

export interface Widget {
    type: WidgetType;
    name: string;
    icon: string;
}
