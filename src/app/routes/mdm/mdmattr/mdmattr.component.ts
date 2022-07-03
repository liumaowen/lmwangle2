import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap';
import { SettingsService } from 'app/core/settings/settings.service';
import { ToasterService } from 'angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MdmService } from '../mdm.service';

@Component({
  selector: 'app-mdmattr',
  templateUrl: './mdmattr.component.html',
  styleUrls: ['./mdmattr.component.scss']
})
export class MdmattrComponent implements OnInit {
  // 分页查询的条件
  attrsearch: any = { pagenum: 1, pagesize: 15 };
  attrData: Array<any> = [];
  fenleisearch = { pagenum: 1, pagesize: 15, categorydesc: '' };
  public fenleitotalItems: number;
  fenleiData: Array<any> = [];
  public attrtotalItems: number;
  public currentPage = 1;
  public currentattrPage = 1;
  categorydesc = '';
  @ViewChild('attrsmodify') private attrsmodify: ModalDirective;
  @ViewChild('querymodify') private querymodify: ModalDirective;
  attrseditdata = {};
  constructor(public settings: SettingsService, private mdmServiceApi: MdmService) {

  }

  ngOnInit() {
      this.mdmcategoryquery();
  }
  showquerymdmcategory() {
    this.querymodify.show();
  }
  // 分类查询数据
  mdmcategoryquery() {
    this.mdmServiceApi.mdmcategoryquery(this.fenleisearch).then((data) => {
      // 获取到总条目
      this.fenleitotalItems = data.headers.get('total');
      // 获取到当前数据
      this.fenleiData = data.json();
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
  // 分类属性查询数据
  mdmattrquery() {
    this.mdmServiceApi.mdmattrquery(this.attrsearch).then((data) => {
      // 获取到总条目
      this.attrtotalItems = data.headers.get('total');
      // 获取到当前数据
      this.attrData = data.json();
    });
  }
  changecategorycode(item) {
    this.attrsearch['categorycode'] = item.categorycode;
    this.categorydesc = item['categorydesc'];
    this.mdmattrquery();
  }
  attrpageChanged(event) {
    this.attrsearch['pagenum'] = event.page;
    this.attrsearch['pagesize'] = event.itemsPerPage;
    this.mdmattrquery();
  }
  showattrsmodify(item) {
    this.attrseditdata = JSON.parse(JSON.stringify(item));
    this.attrsmodify.show();
  }
  closeattrsmodify() {
    this.attrsmodify.hide();
    this.attrseditdata = {};
  }
  editattr() {
    this.mdmServiceApi.editattr(this.attrseditdata).then(data => {
      this.closeattrsmodify();
      this.changecategorycode(this.fenleiData[0]);
    });
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
