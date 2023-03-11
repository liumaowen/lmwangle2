import { NgModule } from '@angular/core';
import { EchartsComponent } from './echarts.component';
import { SharedModule } from 'app/shared/shared.module';
import { WiskSharedsModule } from 'app/dnn/shared/wiskshared.module';
import { RouterModule, Routes } from '@angular/router';
import { EchartsService } from './echarts.service';
import { TabViewModule, DropdownModule } from 'primeng/primeng';

const routes: Routes = [
  { path: '', component: EchartsComponent, data: { 'title': '图表' } },
];

@NgModule({
  imports: [
    SharedModule,
    WiskSharedsModule,
    RouterModule.forChild(routes),
    TabViewModule,
    DropdownModule
  ],
  declarations: [EchartsComponent],
  providers: [EchartsService]
})
export class EchartsModule { }
