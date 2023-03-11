import { ActivatedRoute } from '@angular/router';
import { CustomerapiService } from './../customerapi.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customermailaddress',
  templateUrl: './customermailaddress.component.html',
  styleUrls: ['./customermailaddress.component.scss']
})
export class CustomermailaddressComponent implements OnInit {

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  querys = { pagenum: 1, pagesize: 10 };

  constructor(private route: ActivatedRoute,
    private customerApi: CustomerapiService) {
    this.querydata();
  }

  ngOnInit() {
  }


  // 查询时序表数据
  querydata() {
    this.customerApi.getMaddress(this.route.parent.params['value']['id']).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

}
