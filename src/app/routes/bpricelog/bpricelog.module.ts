import { BpricelogapiService } from './bpricelogapi.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpricelogComponent } from './bpricelog/bpricelog.component';
import { BpricelogdateilComponent } from './bpricelogdateil/bpricelogdateil.component';
import { ReporterbpriceComponent } from './reporterbprice/reporterbprice.component';

const routes: Routes = [
  { path: 'bpricelog', component: BpricelogComponent, data: { 'title': '基础价格表' } },
  { path: 'bpricelogdet/:id', component: BpricelogdateilComponent, data: { 'title': '基价调整记录明细' } },
  { path: 'reporterbprice', component: ReporterbpriceComponent, data: { 'title': '基价调整记录报表' } },];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    AgGridModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
  ],
  declarations: [BpricelogComponent, BpricelogdateilComponent, ReporterbpriceComponent],
  providers: [BpricelogapiService]
})
export class BpricelogModule { }
