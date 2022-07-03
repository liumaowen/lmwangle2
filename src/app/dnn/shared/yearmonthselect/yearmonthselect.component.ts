import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'wisk-yearmonthselect',
  templateUrl: './yearmonthselect.component.html',
  styleUrls: ['./yearmonthselect.component.scss']
})
export class YearmonthselectComponent implements OnInit {

  // month: Date;
  value: Date = null;
  isopen:boolean = false;

  // @Input() public month: Date;
  @Input()
  get month() {
    if (this.value) {
      return this.value;
    } else {
      return null;
    }
  }
  set month(val) {
    this.value = val;
  }

  @Input() public maxDate ;
  @Input() public minDate ;
  @Output() public select = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  //选择时间
  selectionDone($event):void{
      this.select.emit($event);
      this.isopen = false;
  }

  //显示成功执行的回调
  onShown(){
    this.isopen = true;
  }

}


