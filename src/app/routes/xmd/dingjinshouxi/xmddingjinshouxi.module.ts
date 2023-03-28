import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'angular2-datatable/index';
import { AgGridModule } from 'ag-grid-angular/main';
import { DropdownModule, MultiSelectModule } from 'primeng/primeng';
import { CalendarModule, RadioButtonModule, AutoCompleteModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { MessagesModule } from 'primeng/primeng';
import { CreategoodscodeComponent } from 'app/dnn/shared/creategoodscode/creategoodscode.component';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { FlagPipe } from 'app/dnn/shared/pipe/flag.pipe';
import { OrdertypePipe } from 'app/dnn/shared/pipe/ordertype.pipe';
import { TranstypePipe } from 'app/dnn/shared/pipe/transtype.pipe';
import { OrderpaytypePipe } from 'app/dnn/shared/pipe/orderpaytype.pipe';
import { MdmService } from 'app/routes/mdm/mdm.service';
import { XmddingjinshouxiComponent } from './xmddingjinshouxi.component';


const routes: Routes = [
  { path: 'xmddingjinshouxi', component: XmddingjinshouxiComponent, data: { 'title': '新美达定金收息' } }
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
    DropdownModule,
    RadioButtonModule,
    AutoCompleteModule,
    TabViewModule,
    MessagesModule,
    MultiSelectModule
  ],
  declarations: [XmddingjinshouxiComponent],
  exports: [
    RouterModule
  ],
  providers: [
    UserapiService,
    FlagPipe,
    OrdertypePipe,
    TranstypePipe,
    OrderpaytypePipe,
    MdmService
  ],
  entryComponents: [NoticewuliuyuanComponent,  CreategoodscodeComponent]
})
export class XmddingjinshouxiModule { }
