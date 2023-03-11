import { ChengbenService } from './chengben.service';
import { ChengbenComponent } from './chengben/chengben.component';
import { DropdownModule } from 'primeng/primeng';
import { SelectModule } from 'ng2-select';
import { CalendarModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnechengbenComponent } from './onechengben/onechengben.component';
import { WsonechengbenComponent } from './wsonechengben/wsonechengben.component';
import { SheshuichengbenComponent } from './sheshuichengben/sheshuichengben.component';

const routes: Routes = [
  { path: 'chengbenhesuan', component: ChengbenComponent, data: { 'title': '成本核算表' } },
  { path: 'wsonechengben', component: WsonechengbenComponent, data: { 'title': '维实个别计价表' } },
  { path: 'onechengben', component: OnechengbenComponent, data: { 'title': '个别计价表' } },
  { path: 'sheshuichengben', component: SheshuichengbenComponent, data: { 'title': '涉税个别计价表' } }
];

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
    ChengbenComponent,
    OnechengbenComponent,
    WsonechengbenComponent,
    SheshuichengbenComponent
  ],
  exports: [RouterModule],
  providers: [ChengbenService]
})
export class ChengbenModule { }