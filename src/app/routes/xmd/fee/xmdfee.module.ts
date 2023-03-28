import { FeeapiService } from './xmdfeeapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule, CalendarModule } from 'primeng/primeng';
import { SelectModule } from 'ng2-select';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { DataTableModule } from 'angular2-datatable';
import { AgGridModule } from 'ag-grid-angular/main';
import { XmdfeedetComponent } from './feedet/xmdfeedet.component';

const routes: Routes = [
  { path: 'xmdfeedet', component: XmdfeedetComponent, data: { 'title': '新美达费用明细表' } },
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
  declarations: [ XmdfeedetComponent],
  providers: [ FeeapiService
  ]
})
export class XmdfeeModule { }
