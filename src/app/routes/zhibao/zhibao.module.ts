import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { DialogModule } from 'primeng/primeng';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZhibaoComponent } from './zhibao/zhibao.component';
import { ZhibaoService } from './zhibao.service';
import { CalendarModule, DropdownModule } from 'primeng/primeng';

const routes: Routes = [
  { path: '', component: ZhibaoComponent, data: { 'title': '质保书' } },
]

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DialogModule,
    DropdownModule,
    DataTableModule
  ],
  declarations: [ZhibaoComponent],
  exports: [
    RouterModule
  ],
  providers: [
    ZhibaoService
  ]
})
export class ZhibaoModule { }
