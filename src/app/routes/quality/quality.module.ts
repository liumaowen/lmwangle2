import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityComponent } from './quality/quality.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { SharedModule } from './../../shared/shared.module';
import { SelectModule } from 'ng2-select';
import { QualityService } from './quality.service';
import { QualityDetailComponent } from './quality-detail/quality-detail.component';

const routes: Routes = [
  { path: 'quality', component: QualityComponent, data: { 'title': '质量异议管理' } },
  { path: 'quality/:id', component: QualityDetailComponent, data: { 'title': '质量异议详情' } }];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    SelectModule,
    DropdownModule,
    TabViewModule
  ],
  declarations: [QualityComponent, QualityDetailComponent],
  exports: [
    RouterModule
  ],
  providers: [
    QualityService
  ]
})
export class QualityModule { }
