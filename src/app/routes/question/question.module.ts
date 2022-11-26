import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule, MultiSelectModule } from 'primeng/primeng';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './question.component';
import { QuestionapiService } from './questionapi.service';

const routes: Routes = [
  { path: 'question', component: QuestionComponent, data: { 'title': '试题管理' } },
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
    RouterModule.forChild(routes)
  ],
  declarations: [QuestionComponent],
  providers: [
    QuestionapiService
  ]
})
export class QuestionModule { }
