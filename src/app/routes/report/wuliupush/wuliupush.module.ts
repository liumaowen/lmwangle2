import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/primeng';
import { WuliupushComponent } from './wuliupush.component';

const routes: Routes = [
  { path: 'wuliupush', component: WuliupushComponent , data: {'title': '物流平台推送表'}}
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    AgGridModule.withComponents([]),
    CommonModule,
    DropdownModule
  ],
  declarations: [WuliupushComponent],
  exports: [
    RouterModule
  ]
})
export class WuliupushModule { }
