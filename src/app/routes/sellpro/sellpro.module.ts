import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SellproService } from './sellpro.service';
import { FileUploadModule } from 'ng2-file-upload';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellproComponent } from './sellpro/sellpro.component';
import { SellprodetailComponent } from './sellprodetail/sellprodetail.component';
import { ProjectreportComponent } from './projectreport/projectreport.component';
import { DropdownModule } from 'primeng/primeng';
import { ProjectuserhuizongComponent } from './projectuserhuizong/projectuserhuizong.component';
import { DaylogdetComponent } from './daylogdet/daylogdet.component';
import { DaylogdiffComponent } from './daylogdiff/daylogdiff.component';

const routes: Routes = [
  { path: 'sellpro', component: SellproComponent , data: {'title': '备案管理'}},
  { path: 'projectreport', component: ProjectreportComponent , data: {'title': '项目管理'}},
  { path: 'projectuserhuizong', component: ProjectuserhuizongComponent , data: {'title': '项目汇总表'}},
  { path: 'sellpro/:id', component: SellprodetailComponent , data: {'title': '备案详情'}},
  { path: 'daylogdet', component: DaylogdetComponent , data: {'title': '涂镀日报明细表'}},
  { path: 'daylogdiff', component: DaylogdiffComponent , data: {'title': '涂镀日报差异汇总表'}}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    FileUploadModule,
    AgGridModule.withComponents([]),
    SelectModule,
    DropdownModule,
    CommonModule
  ],
  declarations: [SellproComponent, SellprodetailComponent, ProjectreportComponent, ProjectuserhuizongComponent,
     DaylogdetComponent, DaylogdiffComponent],
  exports: [
    RouterModule
  ],
  providers: [
    SellproService
  ]
})
export class SellproModule { }
