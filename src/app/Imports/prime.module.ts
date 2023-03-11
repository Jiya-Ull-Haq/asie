import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {KnobModule} from 'primeng/knob';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {SidebarModule} from 'primeng/sidebar';
import {BlockUIModule} from 'primeng/blockui';
import {MegaMenuModule} from 'primeng/megamenu';
import {GMapModule} from 'primeng/gmap';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';
import {TimelineModule} from 'primeng/timeline';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToastModule} from 'primeng/toast';

const PrimeNGComponents = [
    ToastModule,
    CardModule,
    BlockUIModule,
    ButtonModule,
    KnobModule,
    ToolbarModule,
    TooltipModule,
    SidebarModule,
    MegaMenuModule,
    GMapModule,
    BadgeModule,
    AvatarModule,
    AvatarGroupModule,
    MenubarModule,
    MenuModule,
    TimelineModule,
    OverlayPanelModule,
    BreadcrumbModule
    
];

@NgModule({
imports: [PrimeNGComponents],
exports: [PrimeNGComponents]
})

export class PrimeNGModule{}