import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { GuideService } from './../guide.service';
import { OrderapiService } from 'app/routes/order/orderapi.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
declare let $: any;

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit, AfterViewInit, OnDestroy {
  // 辅助数据：calendar：日历对象，start：页面开始日期， end：页面结束日期
  util: object = {};

  $calendar: any;

  // 事项集合
  events = [];

  // 仓库发货数据模型：id：主键，sd：开始日期，ed：结束日期，sh：开始小时，sm：开始分钟，
  // eh：结束小时，em：结束分钟，cd：点击的日期，weekend：不排除周末，action：动作（run：执行函数，add：添加，adds：批量添加，dels：批量删除）
  model = {};
  isshow: any;
  @ViewChild('showzhixiao') private showzhixiao: ModalDirective;
  //  日历对象
  @ViewChild('fullcalendar') fullcalendar: ElementRef;
  calendarOptions = {
    _this: (() => this)(),
    // 语言
    lang: 'zh-cn',
    // 时区
    timezone: 'local',
    // 事项颜色
    eventColor: '#23b7e5',
    // 事项日期格式
    timeFormat: 'HH:mm',
    // 标题日期格式
    titleFormat: 'YYYY-MM',
    // 显示事项结束日期
    displayEventEnd: true,
    // 高度
    height: this.settings.bodyHeight - 300,
    // 按钮文本
    buttonText: {
      // 今天
      today: '今天',
      // 上月
      prev: '上月',
      // 下月
      next: '下月'
    },
    // 头部
    header: {
      // 左侧（空）
      left: '',
      // 中部（标题）
      center: 'title',
      // 右侧（今天；上月，下月）
      right: 'today prev,next'
    },
    // 事项点击
    eventClick: (event) => {
      console.log(event);
      if (!confirm('确定删除【 ' + event.title + ' 】吗？')) {
        return;
      }
      // 调用删除接口
      this.guideApi.remove(event.id).then(() => {
        for (let i = 0; i < this.events.length; i++) {
          if (this.events[i].id === event.id) {
            this.events.splice(i, 1);
            break;
          }
        }
        this.$calendar.fullCalendar('removeEvents', event.id);
        this.toast.pop('success', '操作成功！你已成功删除引导页名言！');
      });
    },
    // 日期点击
    dayClick: (date) => {
      // 忽略过期日期
      if (date.isBefore(new Date(), 'day')) {
        this.toast.pop('error', `【${date.format()}】已过期！`);
        return;
      }
      // 点击的日期
      this.model['date'] = date.format();
      // 打开添加对话框
      this.showaddModal();
    },
    // 事项渲染
    eventRender: (event, element) => {
      // 设置过期事项的样式
      if ((event.end || event.start).isBefore(new Date(), 'day')) {
        element.css({
          backgroundColor: '#dde6e9',
          borderColor: '#dde6e9',
          height: '40px',
          lineHeight: '40px'
        });
      } else {
        element.css({
          height: '40px',
          lineHeight: '40px'
        });
      }
    },
    // 窗口尺寸调整
    windowResize: (view) => {
      // console.log(view);
    },
    eventSources: [
      this.events,
      {
        events: (start, end, timezone, callback) => {
          // 日历对象
          // 调用查询接口
          this.guideApi.query({ s: start.valueOf(), e: end.valueOf() }).then(data => {
            callback(data);
            [].push.apply(this.events, data);
          });
        }
      }
    ]
  };
  @ViewChild('addModal') private addModal: ModalDirective;
  constructor(public settings: SettingsService, private toast: ToasterService, private route: ActivatedRoute,
    private datePipe: DatePipe, private guideApi: GuideService, private orderapp: OrderapiService,
    private clasapi: ClassifyApiService) { }

  ngOnInit() {
    this.$calendar = $(this.fullcalendar.nativeElement);
  }
  ngAfterViewInit() {
    this.$calendar.fullCalendar(this.calendarOptions);
  }

  ngOnDestroy() {
    this.$calendar.fullCalendar('destroy');
  }
  showaddModal() {
    this.model['msg'] = '';
    this.addModal.show();
  }
  hideaddModal() {
    this.addModal.hide();
  }
  add() {
    console.log(this.model);
    if (!this.model['msg'] || this.model['msg'] === '') {
      this.toast.pop('warning', '请填写引导页内容！');
      return;
    }
    this.guideApi.save(this.model).then(data => {
      this.events.push(data.json());
      this.$calendar.fullCalendar('renderEvent', data.json(), true);
      this.hideaddModal();
    });
  }
  getState() {
    this.guideApi.query1().then(data => {
      console.log('query', data);
    });
  }
  //直销控制
  zhixiaocontrol() {
    this.clasapi.get(8807).then(data => {
      console.log(data);
      this.isshow = data['value'];
    });
    console.log(this.isshow);
    this.showzhixiao.show();
  }
  close() {
    this.showzhixiao.hide();
  }
  submitzhixiao() {
    console.log(this.isshow);
    this.orderapp.showzhixiao({ value: this.isshow }).then(() => {
      this.close();
      this.toast.pop('success', '修改成功！');
    })
  }
}
