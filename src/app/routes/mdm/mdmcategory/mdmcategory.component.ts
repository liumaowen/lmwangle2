import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap';
import { SettingsService } from 'app/core/settings/settings.service';
import { ToasterService } from 'angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MdmService } from '../mdm.service';

@Component({
  selector: 'app-mdmcategory',
  templateUrl: './mdmcategory.component.html',
  styleUrls: ['./mdmcategory.component.scss']
})
export class MdmcategoryComponent implements OnInit {
  // 分页查询的条件
  gnsearch: any = { pagenum: 1, pagesize: 15 };
  gnData: Array<any> = [];
  fenleisearch = { pagenum: 1, pagesize: 15, categorydesc: '' };
  public fenleitotalItems: number;
  fenleiData: Array<any> = [];
  public gntotalItems: number;
  public currentPage = 1;
  public currentgnPage = 1;
  categorydesc = '';
  @ViewChild('querymodify') private querymodify: ModalDirective;
  constructor(public settings: SettingsService, private mdmServiceApi: MdmService) {
  }

  ngOnInit() {
      this.mdmcategoryquery();
  }
  // 分类查询数据
  mdmcategoryquery() {
    this.mdmServiceApi.mdmcategoryquery(this.fenleisearch).then((data) => {
      // 获取到总条目
      this.fenleitotalItems = data.headers.get('total');
      // 获取到当前数据
      this.fenleiData = data.json();
      console.log(this.fenleiData);
      if (this.fenleiData.length) {
        this.changecategorycode(this.fenleiData[0]);
        this.categorydesc = this.fenleiData[0]['categorydesc'];
      }
    });
  }
  pageChanged(event) {
    this.fenleisearch['pagenum'] = event.page;
    this.fenleisearch['pagesize'] = event.itemsPerPage;
    this.mdmcategoryquery();
  }
  showquerymdmcategory() {
    this.querymodify.show();
  }
  // 分类属性查询数据
  mdmgnquery() {
    this.mdmServiceApi.gnquery(this.gnsearch).then((data) => {
      // 获取到总条目
      this.gntotalItems = data.headers.get('total');
      // 获取到当前数据
      this.gnData = data.json();
    });
  }
  changecategorycode(item) {
    this.gnsearch['categorycode'] = item.categorycode;
    this.categorydesc = item['categorydesc'];
    this.mdmgnquery();
  }
  gnpageChanged(event) {
    this.gnsearch['pagenum'] = event.page;
    this.gnsearch['pagesize'] = event.itemsPerPage;
    this.mdmgnquery();
  }
  closequerymodify() {
    this.querymodify.hide();
  }
  queryfenlei() {
    this.fenleisearch['pagenum'] = 1;
    this.closequerymodify();
    this.mdmcategoryquery();
  }
}
