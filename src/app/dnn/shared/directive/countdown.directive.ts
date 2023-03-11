import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[countdown]'
})
export class CountdownDirective {

  constructor(private el: ElementRef) {
  }
  msg;

  @Input() set model(ele) {
    let dateend = new Date(ele['edate']);
    // 从scope中得到当前的model对象中的倒计时时间。
    // let intDiff = (dateend.getTime() - new Date().getTime()) / 1000;
    let intDiff = ele['intervaltime'] / 1000;
    if (ele['isonline']) {
      if (intDiff > 0 && ele.status === 2) {
        // 如果大于0的时候才能进行倒计时操作
        setInterval(() => {
          let day = 0, hour = 0, minute = 0, second = 0, minutes = '', seconds = ''; // 时间默认值
          day = Math.floor(intDiff / (60 * 60 * 24));
          hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
          minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
          second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
          if (minute <= 9) {
            minutes = '0' + minute;
          } else {
            minutes = minute.toString();
          };
          if (second <= 9) {
            seconds = '0' + second;
          } else {
            seconds = second.toString();
          };
          if (intDiff <= 0) {
            this.msg = '';
          } else {
            this.msg = hour + '时' + minutes + '分' + seconds + '秒';
          }
          intDiff--;
          this.el.nativeElement.innerHTML = this.msg;
        }, 1000);

        // 倒计时操作完成之后则对这个订单进行取消操作
        // 因为setInterval 是异步所以该段代码不走 注释掉
        // if (intDiff == 0 && ele.status == 2) {//这里只是针对于未付款的订单倒计时后完成的工作
        //   this.msg = null;//时间到了之后服务端进行取消操作，此处只需要将msg设置为null；并且刷新列表
        // }
      };
    } else {
      if (intDiff > 0 && !ele.isself) { // 如果大于0的时候才能进行倒计时操作
        setInterval(() => {
          let day = 0, hour = 0, minute = 0, second = 0, minutes = '', seconds = ''; // 时间默认值
          day = Math.floor(intDiff / (60 * 60 * 24));
          hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
          minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
          second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
          if (minute <= 9) {
            minutes = '0' + minute;
          } else {
            minutes = minute.toString();
          };
          if (second <= 9) {
            seconds = '0' + second;
          } else {
            seconds = second.toString();
          };
          if (intDiff <= 0) {
            this.msg = '';
          } else {
            this.msg = hour + '时' + minutes + '分' + seconds + '秒';
          }
          intDiff--;
          this.el.nativeElement.innerHTML = this.msg;
        }, 1000);
        // 倒计时操作完成之后则对这个订单进行取消操作
        // 因为setInterval 是异步所以该段代码不走 注释掉
        // if (intDiff == 0 && $scope.model.status == 2) {//这里只是针对于未付款的订单倒计时后完成的工作
        //   this.msg = null;//时间到了之后服务端进行取消操作，此处只需要将msg设置为null；并且刷新列表
        //   /* orderApi.cancel().$promise.then(function(){//这里没必要进行取消订单的操作，只需要服务端的定时器进行操作即可。})*/
        // }
      }
    }
  };



}
