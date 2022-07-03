import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import {DropdownModule} from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { MaoliService } from './maoli.service';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaoliComponent } from './maoli/maoli.component';
import 'ag-grid-enterprise/main';

const routes: Routes = [{path: 'maoli',component: MaoliComponent, data: { 'title': '销售毛利明细表' }}];

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
  declarations: [MaoliComponent],
  exports:[RouterModule],
  providers:[MaoliService]
})
export class MaoliModule { }
