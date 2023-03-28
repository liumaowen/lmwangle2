import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule, DataTableModule } from 'primeng/primeng';
import { SharedModule } from 'app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmderpkaoheService } from './xmderpkaohe.service';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { XmdyanqitihuoComponent } from './yanqitihuo/xmdyanqitihuo.component';

const routes: Routes = [
  { path: 'xmdyanqitihuo', component: XmdyanqitihuoComponent, data: { 'title': '新美达延期提货' } },
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
    AgGridModule.withComponents([]),
    RouterModule.forChild(routes)
  ],
  declarations: [
    XmdyanqitihuoComponent,
  ],
  providers: [
    XmderpkaoheService
  ]
})
export class ErpkaoheModule { }