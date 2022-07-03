import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular/main';
import { SelectModule } from 'ng2-select';
import { SharedModule } from '../../shared/shared.module';
import { WiskSharedsModule } from '../../dnn/shared/wiskshared.module';
import { CalendarModule, DropdownModule, RadioButtonModule, CheckboxModule } from 'primeng/primeng';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackService } from './feedback.service';

const routes: Routes = [
    { path: 'feedback', component: FeedbackComponent, data: { 'title': '反馈中心' } }
  ];

@NgModule({
    imports: [
      CommonModule,
      AgGridModule,
      SharedModule,
      WiskSharedsModule,
      RouterModule.forChild(routes),
      AgGridModule.withComponents([]),
      SelectModule,
      CalendarModule,
      DropdownModule,
      DataTableModule,
      FormsModule,
      RadioButtonModule,
      CheckboxModule
    ],
    exports: [RouterModule],
    declarations: [FeedbackComponent],
    providers: [FeedbackService]
  })
  export class FeedbackModule { }
