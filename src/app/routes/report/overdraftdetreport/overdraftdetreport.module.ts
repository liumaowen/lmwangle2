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
import { OverdraftdetreportComponent } from './overdraftdetreport.component';
import { OverdraftdetreportService } from './overdraftdetreport.service';

const routes: Routes = [
  { path: 'overdraftdetreport', component: OverdraftdetreportComponent , data: {'title': '欠款明细表'}}
];
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
  declarations: [OverdraftdetreportComponent],
  exports: [
    RouterModule
  ],
  providers: [
    OverdraftdetreportService
  ]
})
export class OverdraftdetreportModule { }
