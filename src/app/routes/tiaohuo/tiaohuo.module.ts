import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiaohuoService } from './tiaohuo.service';
import { RouterModule, Routes } from '@angular/router';
import {TabViewModule} from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable/index';
import { DropdownModule } from 'primeng/primeng';
import { SharedModule } from '../../shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { AgGridModule } from 'ag-grid-angular';
import { TiaohuoComponent } from './tiaohuo/tiaohuo.component';
import { FormsModule } from '@angular/forms';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { FlagPipe } from 'app/dnn/shared/pipe/flag.pipe';
import { OrdertypePipe } from 'app/dnn/shared/pipe/ordertype.pipe';
import { TranstypePipe } from 'app/dnn/shared/pipe/transtype.pipe';
import { OrderpaytypePipe } from 'app/dnn/shared/pipe/orderpaytype.pipe';
import { MdmService } from '../mdm/mdm.service';
import { TiaohuofanxiComponent } from './tiaohuofanxi/tiaohuofanxi.component';
import { TiaohuoshouxiComponent } from './tiaohuoshouxi/tiaohuoshouxi.component';

const routes: Routes = [
  { path: 'tiaohuo', component: TiaohuoComponent, data: { 'title': '调货时序表' } },
  { path: 'tiaohuofanli', component: TiaohuofanxiComponent, data: { 'title': '调货定金返息表' } },
  { path: 'tiaohuoshouxi', component: TiaohuoshouxiComponent, data: { 'title': '调货定金收息表' } }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    AgGridModule,
    TabViewModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [TiaohuoComponent,TiaohuofanxiComponent,TiaohuoshouxiComponent],
  exports: [
    RouterModule
  ],
  providers: [
    TiaohuoService,
    UserapiService,
    FlagPipe,
    OrdertypePipe,
    TranstypePipe,
    OrderpaytypePipe,
    MdmService
  ]
})
export class TiaohuoModule { }
