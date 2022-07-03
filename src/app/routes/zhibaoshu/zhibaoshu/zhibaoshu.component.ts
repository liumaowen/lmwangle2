import { ZhibaoshuService } from './../zhibaoshu.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-zhibaoshu',
  templateUrl: './zhibaoshu.component.html',
  styleUrls: ['./zhibaoshu.component.scss']
})
export class ZhibaoshuComponent implements OnInit {

  zhiBaoFormats: { label: string, value: string }[] = new Array();

  access_token;

  querys: Query = new Query(1, 10);

  zhiBaoTasks: ZhiBaoTask[];

  addzhibao: AddZhiBao = new AddZhiBao();

  total: any = 1;

  public currentPage: number = 1;

  @ViewChild('staticModal') private addModel: ModalDirective;

  constructor(private zhibaoshuApi: ZhibaoshuService,
    private toast: ToasterService,) {
    console.log(112211);
    this.getZhiBaoTasks();
    this.getZhiBaoFormat();
  }

  ngOnInit() {
  }

  getZhiBaoTasks() {
    this.zhibaoshuApi.getZhiBaoTasks(this.querys).then((data: any) => {
      this.total = data.headers.get('total');
      this.zhiBaoTasks = data.json();
    });
  }

  pageChanged(event: any) {
    this.querys.pageNum = event.page;
    this.querys.pageSize = event.itemsPerPage;
    this.getZhiBaoTasks();
  }

  AddDialog() {
    this.addselectNull();
    this.addModel.show();
  }

  closeAddDialog() {
    this.addModel.hide();
  }

  // 清空添加质保书对象
  addselectNull() {
    this.addzhibao = new AddZhiBao();
  }

  // 获取质保书格式列表
  getZhiBaoFormat() {
    this.zhibaoshuApi.getZhiBaoFormat().then((data) => {
      const list = data.json();
      this.zhiBaoFormats = [{ label: '请选择格式', value: '' }];
      list.forEach((element: ZhiBaoFormat) => {
        this.zhiBaoFormats.push({ label: `${element.gn}+${element.chandi}`, value: `${element.id}` });
      });
    });
  }

  addlist() {
    console.log(this.addzhibao);
    if (!this.addzhibao.formatid) {
      this.toast.pop('warning', '请选择格式！');
      return;
    }
    if (!this.addzhibao.grnos) {
      this.toast.pop('warning', '请填写资源号！');
      return;
    }
    this.zhibaoshuApi.addZhiBaoTask(this.addzhibao).then((data) => {
      this.addselectNull();
      this.closeAddDialog();
      this.getZhiBaoTasks();
    });

  }

  retry(id) {
    this.zhibaoshuApi.retry(id).then((data) => {
      this.getZhiBaoTasks();
    });
  }

}

class Query {
  pageNum: number;
  pageSize: number;
  constructor(pageNum, pageSize) {
    this.pageSize = pageSize;
    this.pageNum = pageNum;
  }
}

class ZhiBaoTask {
  id: number;
  // 主键
  grno: string;
  // 资源号
  factoryid: number;
  // 钢厂ID
  factorycode: string;
  // 钢厂编号
  factoryname: string;
  // 钢厂名称
  status: number;
  // 状态。0：初始化、1：运行中、2：成功、3：异常
  cuserid: number;
  // 创建用户ID
  cdate: number;
  // 创建时间戳（毫秒）
  udate: number;
  // 更新时间戳（毫秒）

}

class AddZhiBao {
  formatid: number;
  // 格式ID
  grnos: string;
  // 资源号列表，换行符分隔
  access_token: string;
}

class ZhiBaoFormat {
  id: number;
  // 主键
  chandiid: number;
  // 产地ID
  chandi: string;
  // 产地
  gnid: number;
  // 品名ID
  gn: string;
  // 品名
  factoryid: number;
  // 钢厂ID

}
