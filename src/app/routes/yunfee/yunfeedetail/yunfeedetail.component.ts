import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { YunfeeapiService } from './../yunfeeapi.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yunfeedetail',
  templateUrl: './yunfeedetail.component.html',
  styleUrls: ['./yunfeedetail.component.scss']
})
export class YunfeedetailComponent implements OnInit {

  model = {};

  ists = [{ label: '请选择价格类型', value: '' }, { value: true, label: '总价' }, { value: false, label: '单价' }];

  constructor(private route: ActivatedRoute, private yunfeeApi: YunfeeapiService, private toast: ToasterService) {
    this.yunfeeApi.getone(this.route.params['value']['id']).then(data => {
      this.model = data;
    });
  }

  ngOnInit() {
  }

  // 保存修改
  saveModel() {
    if (this.model['wstart'] === '') {
      this.toast.pop('warning', '请输入运输范围的开始值！');
      return;
    }
    if (this.model['wend'] === '') {
      this.toast.pop('warning', '请输入运输范围的结束值！');
      return;
    }
    if (this.model['yunprice'] === '') {
      this.toast.pop('warning', '请输入运输价格');
      return;
    }
    console.log(this.model['ist']);
    if (this.model['ist'] === '') {
      this.toast.pop('warning', '请选择价格类型');
      return;
    }
    if (confirm('你确定要保存吗？')) {
      this.yunfeeApi.modify(this.route.params['value']['id'], this.model).then(() => {
        this.toast.pop('success', '保存成功');
      });
    }
  }

}
