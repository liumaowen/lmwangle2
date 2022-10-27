import { ModalDirective } from 'ngx-bootstrap';
import { DeptpriceapiService } from './../deptpriceapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-deptprice',
  templateUrl: './deptprice.component.html',
  styleUrls: ['./deptprice.component.scss']
})
export class DeptpriceComponent implements OnInit {

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  search: object = { pagenum: 1, pagesize: 10, billno: '' };
  current = this.storage.getObject('cuser');


  // 分页点击查询数据
  pageChanged(event) {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  }


  constructor(private deptpriceApi: DeptpriceapiService,private storage: StorageService) { }

  ngOnInit() {
    this.querydata();
  }

  // 查询时序表数据
  querydata() {
    this.deptpriceApi.query(this.search).then(data => {
      console.log('cgbucha1', data);
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  selectNull() {
    this.search = { pagenum: 1, pagesize: 10, billno: '' };
  }

  query() {
    this.search['cuserid'] = this.current.id;
    this.search['orgid'] = this.current.orgid;
    this.querydata();
    this.hideclassicModal();
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
