/** 检索数组元素（ 原型扩展或重载）
	* @param {
		o
	}
被检索的元素值
	* @type int * @returns 元素索引 */   
Array.prototype.contains = function(o) {
	var index = -1;
	for (var i = 0; i < this.length; i++) {
		if (this[i] == o) {
			index = i;
			break;
		}
	}
	return index;
}

/**  
 * 日期格式化（原型扩展或重载）  
 * 格式 YYYY/yyyy/YY/yy 表示年份  
 * MM/M 月份  
 * W/w 星期  
 * dd/DD/d/D 日期  
 * hh/HH/h/H 时间  
 * mm/m 分钟  
 * ss/SS/s/S 秒  
 * @param {formatStr} 格式模版  
 * @type string  
 * @returns 日期字符串  
 */
Date.prototype.format = function(formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
	str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	str = str.replace(/M/g, this.getMonth());
	str = str.replace(/w|W/g, Week[this.getDay()]);
	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());
	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());
	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());
	return str;
}

/**  
 * 比较日期差（原型扩展或重载）  
 * @param {strInterval} 日期类型：'y、m、d、h、n、s、w'  
 * @param {dtEnd} 格式为日期型或者 有效日期格式字符串  
 * @type int  
 * @returns 比较结果  
 */
Date.prototype.dateDiff = function(strInterval, dtEnd) {
	var dtStart = this;
	if (typeof dtEnd == 'string') { //如果是字符串转换为日期型   
		dtEnd = StringToDate(dtEnd);
	}
	switch (strInterval) {
		case 's':
			return parseInt((dtEnd - dtStart) / 1000);
		case 'n':
			return parseInt((dtEnd - dtStart) / 60000);
		case 'h':
			return parseInt((dtEnd - dtStart) / 3600000);
		case 'd':
			return parseInt((dtEnd - dtStart) / 86400000);
		case 'w':
			return parseInt((dtEnd - dtStart) / (86400000 * 7));
		case 'm':
			return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
		case 'y':
			return dtEnd.getFullYear() - dtStart.getFullYear();
	}
}

/**  
 * 日期计算（原型扩展或重载）  
 * @param {strInterval} 日期类型：'y、m、d、h、n、s、w'  
 * @param {Number} 数量  
 * @type Date  
 * @returns 计算后的日期  
 */
Date.prototype.dateAdd = function(strInterval, Number) {
	var dtTmp = this;
	switch (strInterval) {
		case 's':
			return new Date(Date.parse(dtTmp) + (1000 * Number));
		case 'n':
			return new Date(Date.parse(dtTmp) + (60000 * Number));
		case 'h':
			return new Date(Date.parse(dtTmp) + (3600000 * Number));
		case 'd':
			return new Date(Date.parse(dtTmp) + (86400000 * Number));
		case 'w':
			return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
		case 'q':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		case 'm':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		case 'y':
			return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	}
}

/**  
 * 取得日期数据信息（原型扩展或重载）  
 * @param {interval} 日期类型：'y、m、d、h、n、s、w'  
 * @type int  
 * @returns 指定的日期部分  
 */
Date.prototype.datePart = function(interval) {
	var myDate = this;
	var partStr = '';
	var Week = ['日', '一', '二', '三', '四', '五', '六'];
	switch (interval) {
		case 'y':
			partStr = myDate.getFullYear();
			break;
		case 'm':
			partStr = myDate.getMonth() + 1;
			break;
		case 'd':
			partStr = myDate.getDate();
			break;
		case 'w':
			partStr = Week[myDate.getDay()];
			break;
		case 'ww':
			partStr = myDate.WeekNumOfYear();
			break;
		case 'h':
			partStr = myDate.getHours();
			break;
		case 'n':
			partStr = myDate.getMinutes();
			break;
		case 's':
			partStr = myDate.getSeconds();
			break;
	}
	return partStr;
}

/**  
 * 把日期分割成数组（原型扩展或重载）  
 * @type array  
 * @returns 日期数组  
 */
Date.prototype.toArray = function() {
	var myDate = this;
	var myArray = Array();
	myArray[0] = myDate.getFullYear();
	myArray[1] = myDate.getMonth() + 1;
	myArray[2] = myDate.getDate();
	myArray[3] = myDate.getHours();
	myArray[4] = myDate.getMinutes();
	myArray[5] = myDate.getSeconds();
	return myArray;
}

/**  
 * 取得当前月份的天数（原型扩展或重载）  
 * @type int  
 * @returns 天数  
 */
Date.prototype.daysOfMonth = function() {
	var myDate = this;
	var ary = myDate.toArray();
	var date1 = (new Date(ary[0], ary[1] + 1, 1));
	var date2 = date1.dateAdd('m', 1);
	var result = daysDiff(date1.format('yyyy-MM-dd'), date2.format('yyyy-MM-dd'));
	return result;
}

/**  
 * 判断闰年（原型扩展或重载）  
 * @type boolean  
 * @returns 是否为闰年 true/false  
 */
Date.prototype.isLeapYear = function() {
	return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));
}

/**  
 * 比较两个日期的天数差（自定义）  
 * @param {DateOne} 日期一  
 * @param {DateOne} 日期二  
 * @type int  
 * @returns 比较结果  
 */
function daysDiff(DateOne, DateTwo) {
	var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
	var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
	var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

	var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
	var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
	var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

	var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
	return Math.abs(cha);
}

/**  
 * 日期计算（自定义）  
 * @param {strInterval} 日期类型：'y、m、d、h、n、s、w'  
 * @param {Number} 数量  
 * @param {prmDate} 原日期  
 * @type Date  
 * @returns 计算后的日期  
 */
function dateAdd(interval, number, prmDate) {
	number = parseInt(number);
	if (typeof(prmDate) == "string") {
		prmDate = prmDate.split(/\D/);
		--prmDate[1];
		eval("var prmDate = new Date(" + prmDate.join(",") + ")");
	}
	if (typeof(prmDate) == "object") {
		var prmDate = prmDate
	}
	switch (interval) {
		case "y":
			prmDate.setFullYear(prmDate.getFullYear() + number);
			break;
		case "m":
			prmDate.setMonth(prmDate.getMonth() + number);
			break;
		case "d":
			prmDate.setDate(prmDate.getDate() + number);
			break;
		case "w":
			prmDate.setDate(prmDate.getDate() + 7 * number);
			break;
		case "h":
			prmDate.setHours(prmDate.getHour() + number);
			break;
		case "n":
			prmDate.setMinutes(prmDate.getMinutes() + number);
			break;
		case "s":
			prmDate.setSeconds(prmDate.getSeconds() + number);
			break;
		case "l":
			prmDate.setMilliseconds(prmDate.getMilliseconds() + number);
			break;
	}
	return prmDate;
}

/**  
 * 获取字符串长度（原型扩展或重载）  
 * @type int  
 * @returns 字符串长度  
 */
String.prototype.len = function() {
	var arr = this.match(/[^\x00-\xff]/ig);
	return this.length + (arr == null ? 0 : arr.length);
}

/**  
 * 字符串左取指定个数的字符（原型扩展或重载）  
 * @param {num} 获取个数  
 * @type string  
 * @returns 匹配的字符串  
 */
String.prototype.left = function(num, mode) {
	if (!/\d+/.test(num)) return (this);
	var str = this.substr(0, num);
	if (!mode) return str;
	var n = str.len() - str.length;
	num = num - parseInt(n / 2);
	return this.substr(0, num);
}

/**  
 * 字符串右取指定个数的字符（原型扩展或重载）  
 * @param {num} 获取个数  
 * @type string  
 * @returns 匹配的字符串  
 */
String.prototype.right = function(num, mode) {
	if (!/\d+/.test(num)) return (this);
	var str = this.substr(this.length - num);
	if (!mode) return str;
	var n = str.len() - str.length;
	num = num - parseInt(n / 2);
	return this.substr(this.length - num);
}

/**  
 * 字符串包含（原型扩展或重载）  
 * @param {string: str} 要搜索的子字符串  
 * @param {bool: mode} 是否忽略大小写  
 * @type int  
 * @returns 匹配的个数  
 */
String.prototype.matchCount = function(str, mode) {
	return eval("this.match(/(" + str + ")/g" + (mode ? "i" : "") + ").length");
}

/**  
 * 去除左右空格（原型扩展或重载）  
 * @type string  
 * @returns 处理后的字符串  
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**  
 * 去除左空格（原型扩展或重载）  
 * @type string  
 * @returns 处理后的字符串  
 */
String.prototype.lTrim = function() {
	return this.replace(/(^\s*)/g, "");
}

/**  
 * 去除右空格（原型扩展或重载）  
 * @type string  
 * @returns 处理后的字符串  
 */
String.prototype.rTrim = function() {
	return this.replace(/(\s*$)/g, "");
}

/**  
 * 字符串转换为日期型（原型扩展或重载）  
 * @type Date  
 * @returns 日期  
 */
String.prototype.toDate = function() {
		var converted = Date.parse(this);
		var myDate = new Date(converted);
		if (isNaN(myDate)) {
			var arys = this.split('-');
			myDate = new Date(arys[0], --arys[1], arys[2]);
		}
		return myDate;
	}
	/**
	 * //两种调用方式 
	var template1="我是{0}，今年{1}了"; 
	var template2="我是{name}，今年{age}了"; 
	var result1=template1.format("loogn",22); 
	var result2=template1.format({name:"loogn",age:22}); 
	//两个结果都是"我是loogn，今年22了"
	 * @param {Object} args
	 */
String.prototype.format = function(args) {
	if (arguments.length > 0) {
		var result = this;
		if (arguments.length == 1 && typeof(args) == "object") {
			for (var key in args) {
				var reg = new RegExp("({" + key + "})", "g");
				result = result.replace(reg, args[key]);
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] == undefined) {
					return "";
				} else {
					var reg = new RegExp("({[" + i + "]})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
		return result;
	} else {
		return this;
	}
}