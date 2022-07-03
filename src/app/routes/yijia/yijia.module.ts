import { YijiaapiService } from './yijiaapi.service';
import { RouterModule, Routes } from '@angular/router';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerlevelComponent } from './customerlevel/customerlevel.component';
import { DataTableModule } from 'angular2-datatable';
import { CalendarModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { BargainComponent } from './bargain/bargain.component';

const routes: Routes = [
  { path: 'customerlevel', component: CustomerlevelComponent, data: { 'title': '客户分类管理表' } },
  { path: 'bargain', component: BargainComponent, data: { 'title': '议价申请表' } }

];
 

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    WiskSharedsModule,
    SelectModule,
    DropdownModule,
    TabViewModule
  ],
  declarations: [CustomerlevelComponent, BargainComponent],
  providers: [YijiaapiService]
})
export class YijiaModule { }
