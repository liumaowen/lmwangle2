import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SharedModule } from './../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZhibaoshuComponent } from './zhibaoshu/zhibaoshu.component';
import { ZhibaoshuService } from './zhibaoshu.service';
import { DropdownModule } from 'primeng/primeng';

const routes: Routes = [
  { path: '', component: ZhibaoshuComponent, data: { 'title': '质保书管理' } },
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    WiskSharedsModule,
    DataTableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ZhibaoshuComponent,
  ],
  providers: [
    ZhibaoshuService
  ]
})
export class ZhibaoshuModule { }
