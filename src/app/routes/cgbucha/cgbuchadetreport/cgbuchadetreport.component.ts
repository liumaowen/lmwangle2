import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cgbuchadetreport',
  templateUrl: './cgbuchadetreport.component.html',
  styleUrls: ['./cgbuchadetreport.component.scss']
})
export class CgbuchadetreportComponent implements OnInit {

  gridOptions: GridOptions;

  // 查询条件
  requestparams = {};

  constructor(public settings: SettingsService) { }

  ngOnInit() {
  }


  // 打开查询对话框
  openclassicmodal() {
  }

  // 关闭查询对话框
  closeclassicmodal() {
  }

}
