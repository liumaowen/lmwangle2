import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZentaoComponent } from './zentao.component';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { SharedModule } from './../../shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { ZentaoService } from './zentao.service';

const routes: Routes = [
  { path: 'zentao', component: ZentaoComponent , data: {'title': '禅道管理'}}
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    FileUploadModule,
    AgGridModule.withComponents([]),
    SelectModule,
    CommonModule
  ],
  declarations: [ZentaoComponent],
  exports: [
    RouterModule
  ],
  providers: [
    ZentaoService
  ]
})
export class ZentaoModule { }
