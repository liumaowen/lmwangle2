import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule } from 'primeng/primeng';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmdreceiveComponent } from './receive/xmdreceive.component';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { XmdreceivedetailComponent } from './receivedetail/xmdreceivedetail.component';
import { XmdreceiveapiService } from './xmdreceive.service';

const routes: Routes = [
  { path: 'xmdreceive', component: XmdreceiveComponent, data: { 'title': '新美达收款管理' } },
  { path: 'xmdreceive/:id', component: XmdreceivedetailComponent, data: { 'title': '新美达收款详情', customerid: '' } },
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
  declarations: [XmdreceiveComponent, XmdreceivedetailComponent],
  providers: [
    XmdreceiveapiService
  ]
})
export class XmdreceiveModule { }
