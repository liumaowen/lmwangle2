import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchcarComponent } from './matchcar/matchcar.component';
import { MatchcardetailComponent } from './matchcardetail/matchcardetail.component';
import { MatchcarService } from './matchcar.service';
import { RouterModule, Routes } from '@angular/router';
import { DropdownModule, CalendarModule, DataTableModule, TabViewModule, RadioButtonModule } from 'primeng/primeng';
import { SelectModule } from 'ng2-select';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { SharedModule } from 'app/shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatchcarwuliuComponent } from './matchcarwuliu/matchcarwuliu.component';
const routes: Routes = [
  { path: '', component: MatchcarComponent, data: { 'title': '物流约车' } },
  { path: 'detail/:id', component: MatchcardetailComponent, data: { 'title': '约车详情' } },
  { path: 'wuliu', component: MatchcarwuliuComponent, data: { 'title': '约车运输报表' } }
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    DropdownModule,
    TabViewModule,
    FormsModule,
    RadioButtonModule
  ],
  exports: [RouterModule],
  declarations: [MatchcarComponent, MatchcardetailComponent, MatchcarwuliuComponent],
  providers: [MatchcarService]

})
export class MatchcarModule { }
