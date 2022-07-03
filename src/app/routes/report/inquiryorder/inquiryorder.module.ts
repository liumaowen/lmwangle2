import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { FileUploadModule } from 'ng2-file-upload';
import { DataTableModule } from 'angular2-datatable';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/primeng';
import { InquiryorderComponent } from './inquiryorder.component';

const routes: Routes = [
  { path: 'inqueryorder', component: InquiryorderComponent, data: { 'title': '询单系统明细' } }];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    FileUploadModule,
    AgGridModule.withComponents([]),
    SelectModule,
    CommonModule,
    DataTableModule,
    DropdownModule
  ],
  declarations: [InquiryorderComponent],
  exports: [
    RouterModule
  ]
})
export class InquiryorderModule { }
