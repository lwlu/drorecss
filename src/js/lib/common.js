//板块title右侧按钮
function $childNode(o) {
	return window.frames[o]
}
function animationHover(o, e) {
	o = $(o),
		o.hover(function() {
			o.addClass("animated " + e)
		}, function() {
			window.setTimeout(function() {
				o.removeClass("animated " + e)
			}, 2e3)
		})
}

function WinMove() {
	var o = "[class*=col]",
		e = ".ibox-title",
		i = "[class*=col]";
	$(o).sortable({
		handle: e,
		connectWith: i,
		tolerance: "pointer",
		forcePlaceholderSize: !0,
		opacity: .8
	}).disableSelection()
}
var $parentNode = window.parent.document;
if ($(".tooltip-demo").tooltip({
		selector: "[data-toggle=tooltip]",
		container: "body"
	}),
	$(".modal").appendTo("body"),
	$("[data-toggle=popover]").popover(),
	$(".collapse-link").click(function() {
		var o = $(this).closest("div.ibox"),
			e = $(this).find("i"),
			i = o.find("div.ibox-content");
		i.slideToggle(200),
			e.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),
			o.toggleClass("").toggleClass("border-bottom"),
			setTimeout(function() {
				o.resize(),
					o.find("[id^=map-]").resize()
			}, 50)
	}),
	$(".close-link").click(function() {
		var o = $(this).closest("div.ibox");
		o.remove()
	}),
	top == this) {
	var gohome = '<div class="gohome"><a class="animated bounceInUp" href="index.html?v=4.0" title="返回首页"><i class="fa fa-home"></i></a></div>';
	$("body").append(gohome)
}
	
	
//init
//(Switchery.init)
var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

elems.forEach(function(html) {
    var switchery = new Switchery(html);

});

var blue = document.querySelector('.js-switch-blue');
var switchery = new Switchery(blue, { color: '#41b7f1' });

var pink = document.querySelector('.js-switch-pink');
var switchery = new Switchery(pink, { color: '#ff7791' });

var teal = document.querySelector('.js-switch-teal');
var switchery = new Switchery(teal, { color: '#3cc8ad' });

var red = document.querySelector('.js-switch-red');
var switchery = new Switchery(red, { color: '#db5554' });

var yellow = document.querySelector('.js-switch-yellow');
var switchery = new Switchery(yellow, { color: '#fec200' });


//minimal

$(function(){
    "use strict";
    $('.minimal input').iCheck({
        checkboxClass: 'icheckbox_minimal',
        radioClass: 'iradio_minimal',
        increaseArea: '20%' // optional
    });
});


$(function(){
    $('.minimal-red input').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.minimal-green input').iCheck({
        checkboxClass: 'icheckbox_minimal-green',
        radioClass: 'iradio_minimal-green',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.minimal-blue input').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.minimal-yellow input').iCheck({
        checkboxClass: 'icheckbox_minimal-yellow',
        radioClass: 'iradio_minimal-yellow',
        increaseArea: '20%' // optional
    });
});


$(function(){
    $('.minimal-purple input').iCheck({
        checkboxClass: 'icheckbox_minimal-purple',
        radioClass: 'iradio_minimal-purple',
        increaseArea: '20%' // optional
    });
});





//square


$(function(){
    $('.square input').iCheck({
        checkboxClass: 'icheckbox_square',
        radioClass: 'iradio_square',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.square-red input').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.square-green input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.square-blue input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.square-yellow input').iCheck({
        checkboxClass: 'icheckbox_square-yellow',
        radioClass: 'iradio_square-yellow',
        increaseArea: '20%' // optional
    });
});

$(function(){
    $('.square-purple input').iCheck({
        checkboxClass: 'icheckbox_square-purple',
        radioClass: 'iradio_square-purple',
        increaseArea: '20%' // optional
    });
});



//flat

$(function(){
    $('.flat-red input').iCheck({
        checkboxClass: 'icheckbox_flat-red',
        radioClass: 'iradio_flat-red'
    });
});


$(function(){
    $('.flat-grey input').iCheck({
        checkboxClass: 'icheckbox_flat-grey',
        radioClass: 'iradio_flat-grey'
    });
});

$(function(){
    $('.flat-green input').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
});

$(function(){
    $('.flat-blue input').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });
});

$(function(){
    $('.flat-yellow input').iCheck({
        checkboxClass: 'icheckbox_flat-yellow',
        radioClass: 'iradio_flat-yellow'
    });
});

$(function(){
    $('.flat-purple input').iCheck({
        checkboxClass: 'icheckbox_flat-purple',
        radioClass: 'iradio_flat-purple'
    });
});

//tag input

function onAddTag(tag) {
    alert("Added a tag: " + tag);
}
function onRemoveTag(tag) {
    alert("Removed a tag: " + tag);
}

function onChangeTag(input,tag) {
    alert("Changed a tag: " + tag);
}

$(function() {

    $('#tags_1').tagsInput({width:'auto'});
    $('#tags_2').tagsInput({
        width: '250',
        onChange: function(elem, elem_tags)
        {
            var languages = ['php','ruby','javascript'];
            $('.tag', elem_tags).each(function()
            {
                if($(this).text().search(new RegExp('\\b(' + languages.join('|') + ')\\b')) >= 0)
                    $(this).css('background-color', 'yellow');
            });
        }
    });

    // Uncomment this line to see the callback functions in action
    //			$('input.tags').tagsInput({onAddTag:onAddTag,onRemoveTag:onRemoveTag,onChange: onChangeTag});

    // Uncomment this line to see an input with no interface for adding new tags.
    //			$('input.tags').tagsInput({interactive:false});
});

//图表
(function(){
	// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('world-map'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
})()







 