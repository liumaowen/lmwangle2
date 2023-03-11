import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule, CalendarModule } from 'primeng/primeng';
import { SelectModule } from 'ng2-select';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { AgGridModule } from 'ag-grid-angular/main';
import { TiaohuobiddingComponent } from './tiaohuobidding.component';
import { TiaohuobiddingService } from './tiaohuobidding.service';

const routes: Routes = [
  { path: 'tiaohuobidding', component: TiaohuobiddingComponent, data: { 'title': '调货竞价汇总表' } }
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
    RouterModule.forChild(routes)
  ],
  declarations: [TiaohuobiddingComponent],
  providers: [
    TiaohuobiddingService
  ],
  entryComponents: []
})
export class TiaohuobiddingModule { }
