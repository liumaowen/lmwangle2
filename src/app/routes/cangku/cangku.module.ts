import { AgGridModule } from 'ag-grid-angular/main';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CangkuComponent } from './cangku/cangku.component';
import { CangkudetailComponent } from './cangkudetail/cangkudetail.component';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'angular2-datatable';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { CangkutimedetailComponent } from './cangkutimedetail/cangkutimedetail.component';
import { CangkuApiService } from './cangkuapi.service';

const routes: Routes = [
  { path: '', component: CangkuComponent, data: { 'title': '仓库管理' } },
  { path: ':id', component: CangkudetailComponent, data: { 'title': '仓库修改' } },
  { path: 'cangkutime/:id', component: CangkutimedetailComponent, data: { 'title': '仓库排单时间段管理' } }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    AgGridModule.withComponents([]),
    DataTableModule,
    TabViewModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [CangkuComponent, CangkudetailComponent, CangkutimedetailComponent],
  providers: [CangkuApiService],
})
export class CangkuModule { }
