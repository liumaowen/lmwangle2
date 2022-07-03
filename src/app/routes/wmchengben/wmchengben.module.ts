import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WmchengbenComponent } from './wmchengben/wmchengben.component';
import { Routes, RouterModule } from '@angular/router';
import { ChengbenService } from '../chengben/chengben.service';
import { DropdownModule, CalendarModule } from 'primeng/primeng';
import { SelectModule } from 'ng2-select';
import { AgGridModule } from 'ag-grid-angular';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { SharedModule } from 'app/shared/shared.module';
const routes: Routes = [{ path: 'wmchengbenhesuan', component: WmchengbenComponent, data: { 'title': '外贸成本核算表' } }];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    CalendarModule,
    SelectModule,
    DropdownModule
  ],
  declarations: [
    WmchengbenComponent
  ],
  exports: [RouterModule],
  providers: [ChengbenService]
})
export class WmchengbenModule { }