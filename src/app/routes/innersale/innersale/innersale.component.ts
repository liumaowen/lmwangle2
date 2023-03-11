import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { InnersaleapiService } from './../innersaleapi.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-innersale',
  templateUrl: './innersale.component.html',
  styleUrls: ['./innersale.component.scss']
})
export class InnersaleComponent implements OnInit {
  totalItems: any;

  singleData;

  search = { pagenum: 1, pagesize: 10 };
  current = this.storage.getObject('cuser');

  public currentPage: number = 1;

  constructor(private innersaleApi: InnersaleapiService, private toast: ToasterService,private storage: StorageService) {
    this.listDetail();
  }

  listDetail() {

    this.innersaleApi.query(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  //分页点击查询
  pageChanged(event: any): void {
    // this.search['salemanid'] = this.current.id;
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.listDetail();
  };


  //删除
  removebill(model) {
    console.log(model);
    if (model.isv) {
      this.toast.pop('warning', '单据已审核不允许删除！！！');
      return;
    }
    if (confirm("你确定要删除吗？")) {
      this.innersaleApi.removeInnersale(model.id).then((data) => {
        // Notify.alert("删除成功", { status: 'success' });
        this.toast.pop('success', '删除成功');
        this.listDetail();
      });
    }
  }

  ngOnInit() {
  }

}
