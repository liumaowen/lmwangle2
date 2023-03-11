import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular/main';
import { SharedModule } from 'app/shared/shared.module';
import { ChandimaoliComponent } from './chandimaoli.component';

const routes: Routes = [
  { path: 'chandimaoli', component: ChandimaoliComponent, data: { 'title': '产地账面毛利对比表' } }
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    WiskSharedsModule,
    AgGridModule.withComponents([]),
    CommonModule
  ],
  declarations: [ChandimaoliComponent],
  exports: [
    RouterModule
  ]
})
export class ChandimaoliModule { }
