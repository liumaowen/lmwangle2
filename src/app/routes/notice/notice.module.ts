import { NoticeapiService } from './noticeapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeComponent } from './notice/notice.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { TabViewModule, DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { NoticedetailComponent } from './noticedetail/noticedetail.component';

const routes: Routes = [
  { path: '', component: NoticeComponent, data: { 'title': '公告管理' }, },
  { path: ':id', component: NoticedetailComponent, data: { 'title': '公告明细' }, }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    TabViewModule,
    DropdownModule,
    FormsModule,
    TreeModule
  ],
  declarations: [NoticeComponent, NoticedetailComponent],
  providers: [NoticeapiService]
})
export class NoticeModule { }
