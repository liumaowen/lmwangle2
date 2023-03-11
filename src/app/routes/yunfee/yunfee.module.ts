import { YunfeeapiService } from './yunfeeapi.service';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YunfeeComponent } from './yunfee/yunfee.component';
import { YunfeedetailComponent } from './yunfeedetail/yunfeedetail.component';
import { DataTableModule } from 'angular2-datatable';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { YunpricecankaoComponent } from './yunpricecankao/yunpricecankao.component';

const routes: Routes = [
  { path: 'yunfee', component: YunfeeComponent, data: { 'title': '固定路线明细表' } },
  { path: 'yunpricecankao', component: YunpricecankaoComponent, data: { 'title': '运价参考明细表' } },
  { path: 'yunfee/:id', component: YunfeedetailComponent, data: { 'title': '入库明细' } }];

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
  declarations: [YunfeeComponent, YunfeedetailComponent, YunpricecankaoComponent],
  providers: [YunfeeapiService]
})
export class YunfeeModule { }
