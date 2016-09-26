$(function(){
	//头部导航点击切换
	$(".drore-top-nav li").click(function(){			
		$(this).addClass("active").siblings().removeClass("active");
	})
	
	$(".left-nav-btn").click(function() {
		$(".drore-left").toggleClass("smal-left-nav")
        $(".drore-main").toggleClass("smal-main")
        
    })
	
   
	function init(){
	$(".drore-left,.drore-main").height($(document).height());
//	$("[name=main]").height($(window).height()-60);
	$(".drore-main").height($(window).height()-60)
//	$(".drore-main").width($(window).width()-240)
 if($(window).width()<800){
 	$(".drore-left").addClass("smal-left-nav")
 	$(".drore-main").addClass("smal-main")
 	
 }else{
 		$(".drore-left").removeClass("smal-left-nav")
 		$(".drore-main").removeClass("smal-main")
 	
 };
 
$(".drore-left").click(function(){		
	$(".drore-left").removeClass("smal-left-nav")
	$(".drore-main").removeClass("smal-main")
})
	};
	
	init();
	$(window).resize(function(){
		init();
		
	});
	
	
	
	
	
})
	function iFrameHeight() {
				var ifm = document.getElementById("con_iframe");
				var subWeb = document.frames ? document.frames["con_iframe"].document : ifm.contentDocument;
				if (ifm != null && subWeb != null) {
					ifm.height = subWeb.body.scrollHeight;
					ifm.width = subWeb.body.scrollWidth;
					ifm.style.height = subWeb.body.scrollHeight+"px";
					ifm.style.width = subWeb.body.scrollWidth+"px";
					
				}
			}
	
			function addClass(obj,className){
				if(obj.className){
					if(!new RegExp(className).test(obj.className))obj.className+=' '+className;
				}else{
					obj.className=className;
				}
			}
			function deleteClass(obj,className){
				if(new RegExp(className,'g').test(obj.className)){
					obj.className=obj.className.replace(new RegExp('\\b'+className+'\\b','g'),'')
					if(new RegExp(/^ /g).test(obj.className))obj.className=obj.className.replace(/^ /g,'')
					if(new RegExp(/ $/g).test(obj.className))obj.className=obj.className.replace(/ $/g,'')
				}
			}
			function getByClass(oParent,sClass){
				var elements=oParent.getElementsByTagName('*');
				var result=[];
				for(var i=0;i<elements.length;i++){
					if(new RegExp('\\b'+sClass+'\\b').test(elements[i].className)){
						result.push(elements[i]);
					}
				}
				return result;
			}
			function getStyle(obj,attr){
				if(obj.currentStyle)
				{
					return obj.currentStyle[attr]
				}
				else
				{
					return getComputedStyle(obj,false)[attr]
				}
			}
			function startMove(obj,json,fn){
				clearInterval(obj.timer)
				obj.timer=setInterval(function(){
					var bStop=true;
					for(var attr in json)
					{
						var cur;
						if(attr=='opacity')
						{
							cur=Math.round(parseFloat(getStyle(obj,attr))*100)
						}
						else if (attr == 'scale') {
							cur = obj.scale
						}
						else
						{
							cur=parseInt(getStyle(obj,attr));
						}
						var speed=(json[attr]-cur)/8;
						speed=speed>0?Math.ceil(speed):Math.floor(speed);
						if(json[attr]!=cur)
						bStop=false
						if(attr=='opacity')
						{
							obj.style.filter='alpha(opacity:'+(cur+speed)+')';
							obj.style.opacity=(cur+speed)/100
						}
						else if (attr == 'scale') {
							obj.style.webkitTransform = obj.style.transform = 'scale(' + (cur + speed) / 100 + ')';
							obj.scale = cur + speed;
						}
						else
						{
							obj.style[attr]=cur+speed+'px'
						}
					}
					if(bStop)
					{
						clearInterval(obj.timer)
						if(fn)fn()
					}
				}, 16)
			}
			window.onload=function(){				
				var btns=$(".left-nav a")
				for(var i=0;i<btns.length;i++){
					if(btns[i].parentNode.children[1]){
						btns[i].parentNode.children[1].style.height='auto';
						btns[i].parentNode.children[1].setAttribute('originHeight',btns[i].parentNode.children[1].offsetHeight);
						btns[i].parentNode.children[1].style.height='0';
					}
					btns.index=i;
					btns[i].onclick=function(){
						if(/active/.test(this.parentNode.className)){
							if(this.parentNode.children[1])
								startMove(this.parentNode.children[1],{height:0});
							deleteClass(this.parentNode,'active');
						}else{
							for(var i=0;i<this.parentNode.parentNode.getElementsByTagName('a').length;i++){
								if(this.parentNode.parentNode.getElementsByTagName('a')[i].parentNode.className&&/active/.test(this.parentNode.parentNode.getElementsByTagName('a')[i].parentNode.className)){
									if(this.parentNode.parentNode.getElementsByTagName('a')[i].parentNode.children[1])
									startMove(this.parentNode.parentNode.getElementsByTagName('a')[i].parentNode.children[1],{height:0});
									deleteClass(this.parentNode.parentNode.getElementsByTagName('a')[i].parentNode,'active');
								}
							}
							if(this.parentNode.children[1]){
								var _this=this;
								startMove(this.parentNode.children[1],{height:_this.parentNode.children[1].getAttribute('originHeight')},function(){_this.parentNode.children[1].style.height='auto'});
							}
							addClass(this.parentNode,'active');
						}
					}
				}
			}
			






//	//原始模板通用效果
//	function $childNode(o) {
//		return window.frames[o]
//	}
//	function animationHover(o, e) {
//		o = $(o),
//			o.hover(function() {
//				o.addClass("animated " + e)
//			}, function() {
//				window.setTimeout(function() {
//					o.removeClass("animated " + e)
//				}, 2e3)
//			})
//	}
//	
//	function WinMove() {
//		var o = "[class*=col]",
//			e = ".ibox-title",
//			i = "[class*=col]";
//		$(o).sortable({
//			handle: e,
//			connectWith: i,
//			tolerance: "pointer",
//			forcePlaceholderSize: !0,
//			opacity: .8
//		}).disableSelection()
//	}
//	var $parentNode = window.parent.document;
//	if ($(".tooltip-demo").tooltip({
//			selector: "[data-toggle=tooltip]",
//			container: "body"
//		}),
//		$(".modal").appendTo("body"),
//		$("[data-toggle=popover]").popover(),
//		$(".collapse-link").click(function() {
//			var o = $(this).closest("div.ibox"),
//				e = $(this).find("i"),
//				i = o.find("div.ibox-content");
//			i.slideToggle(200),
//				e.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),
//				o.toggleClass("").toggleClass("border-bottom"),
//				setTimeout(function() {
//					o.resize(),
//						o.find("[id^=map-]").resize()
//				}, 50)
//		}),
//		$(".close-link").click(function() {
//			var o = $(this).closest("div.ibox");
//			o.remove()
//		}),
//		top == this) {
//		var gohome = '<div class="gohome"><a class="animated bounceInUp" href="index.html?v=4.0" title="返回首页"><i class="fa fa-home"></i></a></div>';
//		$("body").append(gohome)
//	}
	
	
















 