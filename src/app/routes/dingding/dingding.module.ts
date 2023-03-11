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
import { TudutriplogComponent } from './tudutriplog/tudutriplog.component';
import { DingdingService } from './dingding.service';
import { SummaryTudutriplogComponent } from './summarytudutriplog/summarytudutriplog.component';

const routes: Routes = [
  { path: 'tudutriplog', component: TudutriplogComponent , data: {'title': '涂镀工作日报/出差日志提交记录明细'}},
  { path: 'summarytudutriplog', component: SummaryTudutriplogComponent , data: {'title': '涂镀工作日报/出差日志提交记录汇总'}},
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
  declarations: [TudutriplogComponent, SummaryTudutriplogComponent],
  exports: [
    RouterModule
  ],
  providers: [DingdingService]
})
export class DingdingModule { }
