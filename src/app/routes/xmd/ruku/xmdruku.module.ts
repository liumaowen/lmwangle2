import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from '../../../dnn/shared/wiskshared.module';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { SharedModule } from '../../../shared/shared.module';
import { XmdrukuService } from './xmdruku.service';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SelectModule } from 'ng2-select';
import { CommonModule } from '@angular/common';
import { XmdrukuComponent } from './ruku/xmdruku.component';
import { XmdrukudetreportComponent } from './rukudetreport/xmdrukudetreport.component';
import { XmdrukudetailComponent } from './rukudetail/xmdrukudetail.component';

const routes: Routes = [
  { path: 'xmdruku', component: XmdrukuComponent, data: { 'title': '新美达入库管理' } },
  { path: 'xmdrukudetreport', component: XmdrukudetreportComponent, data: { 'title': '新美达入库明细表' } },
  { path: 'xmdruku/:id', component: XmdrukudetailComponent, data: { 'title': '新美达入库明细' } },
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    WiskSharedsModule,
    SelectModule,
    DropdownModule,
    TabViewModule
  ],
  declarations: [XmdrukuComponent, XmdrukudetailComponent, XmdrukudetreportComponent],
  exports: [
    RouterModule
  ],
  providers: [
    XmdrukuService
  ],
})
export class XmdrukuModule { }
