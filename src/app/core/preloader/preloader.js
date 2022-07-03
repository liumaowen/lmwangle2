(function (global) {

    var counter = 0, timeout;
    var preloader = document.querySelector('.preloader');
    var progressBar = document.querySelector('.preloader-progress-bar');
    var body = document.querySelector('body');

    // if preloader not present => abort
    if (!preloader) return;

  // disables scrollbar
  body.style.overflow = 'hidden';

  timeout = setTimeout(startCounter, 20);

  // main.ts call this function once the app is boostrapped
  global.appBootstrap = function () {
    setTimeout(endCounter, 1000);
  };

  function startCounter() {
    var remaining = 100 - counter;
    counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));

    if (progressBar) progressBar.style.width = Math.round(counter) + '%';

    timeout = setTimeout(startCounter, 20);
  }

  function endCounter() {

    clearTimeout(timeout);

    if (progressBar) progressBar.style.width = '100%';

    setTimeout(function () {
      // animate preloader hiding
      removePreloader();
      // retore scrollbar
      body.style.overflow = '';
    }, 300);
  }

  function removePreloader() {
    preloader.addEventListener('transitionend', function () {
      preloader.className = 'preloader-hidden';
    });
    preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
  };

})(window);


/** 左补齐字符串
 * @param nSize  要补齐的长度
 * @param ch 要补齐的字符
 * @return
 */
String.prototype.padLeft = function (nSize, ch) {
  var len = 0;
  var s = this ? this : "";
  ch = ch ? ch : '0'; // 默认补0
  len = s.length;
  while (len < nSize) {
    s = ch + s;
    len++;
  }
  return s;
}
/** 右补齐字符串
 * @param nSize 要补齐的长度
 * @param ch 要补齐的字符
 * @return
 */
String.prototype.padRight = function (nSize, ch) {
  var len = 0;
  var s = this ? this : "";
  ch = ch ? ch : '0'; // 默认补0
  len = s.length;
  while (len < nSize) {
    s = s + ch;
    len++;
  }
  return s;
}
/** 左移小数点位置（用于数学计算，相当于除以Math.pow(10,scale)）
 * @param scale 要移位的刻度
 * @return
 */
String.prototype.movePointLeft = function (scale) {
  var s, s1, s2, ch, ps, sign;
  ch = '.';
  sign = '';
  s = this ? this : "";
  if (scale <= 0) return s;
  ps = s.split('.');
  s1 = ps[0] ? ps[0] : "";
  s2 = ps[1] ? ps[1] : "";
  if (s1.slice(0, 1) == '-') {
    s1 = s1.slice(1);
    sign = '-';
  }
  if (s1.length <= scale) {
    ch = "0.";
    s1 = s1.padLeft(scale);
  }
  return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
}
/** 右移小数点位置（用于数学计算，相当于乘以Math.pow(10,scale)）
 * @param scale 要移位的刻度
 * @return
 */
String.prototype.movePointRight = function (scale) {
  var s, s1, s2, ch, ps;
  ch = '.';
  s = this ? this : "";
  if (scale <= 0) return s;
  ps = s.split('.');
  s1 = ps[0] ? ps[0] : "";
  s2 = ps[1] ? ps[1] : "";
  if (s2.length <= scale) {
    ch = '';
    s2 = s2.padRight(scale);
  }
  return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
}
/** 移动小数点位置（用于数学计算，相当于（乘以/除以）Math.pow(10,scale)）
 * @param scale 要移位的刻度（正数表示向右移；负数表示向左移动；0返回原值）
 * @return
 */
String.prototype.movePoint = function (scale) {
  if (scale >= 0)
    return this.movePointRight(scale);
  else
    return this.movePointLeft(-scale);
}
/** 加法函数，用来得到精确的加法结果 */
Number.prototype.add = function (arg) {
  var n, n1, n2, s, s1, s2, ps;
  s1 = this.toString();
  ps = s1.split('.');
  n1 = ps[1] ? ps[1].length : 0;
  s2 = arg.toString();
  ps = s2.split('.');
  n2 = ps[1] ? ps[1].length : 0;
  n = n1 > n2 ? n1 : n2;
  s = Number(s1.movePoint(n)) + Number(s2.movePoint(n));
  s = s.toString().movePoint(-n);
  return Number(s);
}
String.prototype.add = Number.prototype.add;
/** 减法函数 */
Number.prototype.sub = function (arg) {
  var n, n1, n2, s, s1, s2, ps;
  s1 = this.toString();
  ps = s1.split('.');
  n1 = ps[1] ? ps[1].length : 0;
  s2 = arg.toString();
  ps = s2.split('.');
  n2 = ps[1] ? ps[1].length : 0;
  n = n1 > n2 ? n1 : n2;
  s = Number(s1.movePoint(n)) - Number(s2.movePoint(n));
  s = s.toString().movePoint(-n);
  return Number(s);
}
String.prototype.sub = Number.prototype.sub;
/** 乘法函数 */
Number.prototype.mul = function (arg) {
  var n, n1, n2, s, s1, s2, ps;
  s1 = this.toString();
  ps = s1.split('.');
  n1 = ps[1] ? ps[1].length : 0;
  s2 = arg.toString();
  ps = s2.split('.');
  n2 = ps[1] ? ps[1].length : 0;
  n = n1 + n2;
  s = Number(s1.replace('.', '')) * Number(s2.replace('.', ''));
  s = s.toString().movePoint(-n);
  return Number(s);
}
String.prototype.mul = Number.prototype.mul;
/** 除法 */
Number.prototype.div = function (arg) {
  var n, n1, n2, s, s1, s2, ps;
  s1 = this.toString();
  ps = s1.split('.');
  n1 = ps[1] ? ps[1].length : 0;
  s2 = arg.toString();
  ps = s2.split('.');
  n2 = ps[1] ? ps[1].length : 0;
  n = n1 - n2;
  s = Number(s1.replace('.', '')) / Number(s2.replace('.', ''));
  s = s.toString().movePoint(-n);
  return Number(s);
}
String.prototype.div = Number.prototype.div;
//千分位显示
/**
 * 将数值四舍五入后格式化.
 *
 * @param cent 要保留的小数位(Number)
 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
 * @return 格式的字符串,如'1,234,567.45'
 * @type String
 */
Number.prototype.fmoney = function (cent, isThousand) {
  var num = this.toString().replace(/\$|\,/g, '');
  // 检查传入数值为数值类型
  if (isNaN(num)) {
    num = "0";
  }
  // 获取符号(正/负数)
  var sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
  var cents = num % Math.pow(10, cent); // 求出小数位数值
  num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值
  cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度
  // 补足小数位到指定的位数
  while (cents.length < cent) {
    cents = "0" + cents;
  }
  if (isThousand) {
    // 对整数部分进行千分位格式化.
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }
  }
  if (cent > 0) {
    return (((sign) ? '' : '-') + num + '.' + cents);
  } else {
    return (((sign) ? '' : '-') + num);
  }
}
String.prototype.fmoney = Number.prototype.fmoney;
