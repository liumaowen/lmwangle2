import { SharedModule } from './../../shared/shared.module';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable/index';
import { AgGridModule } from 'ag-grid-angular/main';
import { DropdownModule, TabViewModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BpriceapiService } from './bpriceapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpriceComponent } from './bprice/bprice.component';

const routes: Routes = [
  { path: 'bprice', component: BpriceComponent, data: { 'title': '基础价格表' } }];

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
  declarations: [BpriceComponent],
  providers: [
    BpriceapiService
  ]
})
export class BpriceModule { }
