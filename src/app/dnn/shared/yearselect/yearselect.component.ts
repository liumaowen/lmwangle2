import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'wisk-yearselect',
  templateUrl: './yearselect.component.html',
  styleUrls: ['./yearselect.component.scss']
})
export class YearselectComponent implements OnInit {

  value: Date = null;
  isopen = false;

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

  // 选择时间
  selectionDone($event): void {
      this.select.emit($event);
      this.isopen = false;
  }

  // 显示成功执行的回调
  onShown() {
    this.isopen = true;
  }

}


