
import { GridOptions } from 'ag-grid';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'app/core/settings/settings.service';

@Component({
  selector: 'app-xmdcgbuchadetreport',
  templateUrl: './xmdcgbuchadetreport.component.html',
  styleUrls: ['./xmdcgbuchadetreport.component.scss']
})
export class XmdCgbuchadetreportComponent implements OnInit {

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
