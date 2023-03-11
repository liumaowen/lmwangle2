import { FproductimportComponent } from './../../dnn/shared/fproductimport/fproductimport.component';
import { BasematerialimportComponent } from './../../dnn/shared/basematerialimport/basematerialimport.component';
import { TasklistdetimportComponent } from './../../dnn/shared/tasklistdetimport/tasklistdetimport.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule } from 'angular2-datatable/index';
import { WiskSharedsModule } from './../../dnn/shared/wiskshared.module';
import { SelectModule } from 'ng2-select';
import { DropdownModule, CalendarModule, TabViewModule } from 'primeng/primeng';
import { SharedModule } from './../../shared/shared.module';
import { ProduceapiService } from './produceapi.service';
import { ProorderapiService } from './proorderapi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyproduceComponent } from './myproduce/myproduce.component';
import { ProduceComponent } from './produce/produce.component';
import { ProducedetComponent } from './producedet/producedet.component';
import { ProducedetailComponent } from './producedetail/producedetail.component';
import { ProducechengbenComponent } from './producechengben/producechengben.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { TaskdetComponent } from './taskdet/taskdet.component';
import { TasklistdetComponent } from './tasklistdet/tasklistdet.component';

const routes: Routes = [
  { path: 'myproduce', component: MyproduceComponent, data: { 'title': '加工单管理' } },
  { path: 'produce/:id', component: ProducedetailComponent, data: { 'title': '加工单明细' } },
  { path: 'produce', component: ProduceComponent, data: { 'title': '加工单管理' } },
  { path: 'producedet', component: ProducedetComponent, data: { 'title': '加工单明细表' } },
  { path: 'producechengben/:id', component: ProducechengbenComponent, data: { 'title': '成本计算方式' } },
  { path: 'tasklist', component: TasklistComponent, data: { 'title': '加工任务单管理' } },
  { path: 'tasklist/:id', component: TaskdetComponent, data: { 'title': '加工任务单详情' } },
  { path: 'tasklistdet',component: TasklistdetComponent,data:{'title':'加工任务单明细表'}}
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
    TabViewModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyproduceComponent, ProduceComponent, ProducedetComponent, ProducedetailComponent, BasematerialimportComponent,
    FproductimportComponent, ProducechengbenComponent, TasklistComponent, TaskdetComponent, TasklistdetimportComponent,TasklistdetComponent],
  providers: [ProorderapiService, ProduceapiService],
  entryComponents: [BasematerialimportComponent, FproductimportComponent, TasklistdetimportComponent]
})
export class ProduceModule { }
