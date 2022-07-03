import { NgModule } from '@angular/core';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NavsearchComponent } from './header/navsearch/navsearch.component';
import { OffsidebarComponent } from './offsidebar/offsidebar.component';
import { UserblockComponent } from './sidebar/userblock/userblock.component';
import { UserblockService } from './sidebar/userblock/userblock.service';
import { FooterComponent } from './footer/footer.component';

import { SharedModule } from '../shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { ExamapiService } from './exam/examapi.service';
import { DropdownModule } from 'primeng/primeng';
import { CaigouService } from 'app/routes/caigou/caigou.service';
import { SelectModule } from 'ng2-select';

@NgModule({
    imports: [
        SharedModule,
        SelectModule,
        WiskSharedsModule
    ],
    providers: [
        UserblockService,
        CaigouService,
        ExamapiService
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        UserblockComponent,
        HeaderComponent,
        NavsearchComponent,
        OffsidebarComponent,
        FooterComponent,
    ],
    exports: [
        LayoutComponent,
        SidebarComponent,
        UserblockComponent,
        HeaderComponent,
        NavsearchComponent,
        OffsidebarComponent,
        FooterComponent
    ]
})
export class LayoutModule { }
