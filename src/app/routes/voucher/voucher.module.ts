import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { SharedModule } from './../../shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { VoucherComponent } from './voucher.component';
import { VoucherService } from './voucher.service';
import { DataTableModule } from 'angular2-datatable';

const routes: Routes = [
  { path: 'voucher', component: VoucherComponent , data: {'title': '生成凭证'}}
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
  ],
  declarations: [VoucherComponent],
  exports: [
    RouterModule
  ],
  providers: [
    VoucherService
  ]
})
export class VoucherModule { }
