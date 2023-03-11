import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule } from 'primeng/primeng';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ReceiveapiService } from './receiveapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiveComponent } from './receive/receive.component';
import { ReceivedetailComponent } from './receivedetail/receivedetail.component';

const routes: Routes = [
  { path: 'receive', component: ReceiveComponent, data: { 'title': '收款管理' } },
  { path: 'receive/:id', component: ReceivedetailComponent, data: { 'title': '收款详情', customerid: '' } },
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    SelectModule,
    WiskSharedsModule,
    DataTableModule,
    AgGridModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReceiveComponent, ReceivedetailComponent],
  providers: [
    ReceiveapiService
  ]
})
export class ReceiveModule { }
