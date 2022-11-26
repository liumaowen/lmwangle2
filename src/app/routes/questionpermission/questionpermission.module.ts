import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule, MultiSelectModule, TabViewModule } from 'primeng/primeng';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionPermissionComponent } from './questionpermission.component';
import { QuestionapiService } from '../question/questionapi.service';
import { ExamdetComponent } from './examdet/examdet.component';

const routes: Routes = [

  { path: 'questionpermission', component: QuestionPermissionComponent, data: { 'title': '试题权限管理' } },
  { path: 'examdet', component: ExamdetComponent, data: { 'title': '答题分析表' } }
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    SelectModule,
    WiskSharedsModule,
    DataTableModule,
    AgGridModule,
    MultiSelectModule,
    TabViewModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QuestionPermissionComponent, ExamdetComponent],
  providers: [
    QuestionapiService
  ]
})
export class QuestionPermissionModule { }
