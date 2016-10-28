$.fn.extend({
		droreReorder: function(){
			$(window).resize(function() {
				$(".left-nav").height(document.documentElement.clientHeight)
			});
	
			var curY; //获取所选项的Top值
			var curH; //获取所选项的Height值
			var curW; //获取所选项的Width值
			var srtY; //设置提示箭头的Top值
			var srtX; //设置提示箭头的Left值
			var objL; //获取当前对象

			$("#drore-reorder").click(function() {
				$(".drore-left").toggleClass("drore-left-min");

				$(".drore-left span").show();
				$(".nav-third-level").toggleClass("nav-third-level-min");
				$(".nav-second-level").toggleClass("nav-second-level-min");
				$(".drore-left-min span").hide();
				$(".drore-main").toggleClass("drore-main-min");
				console.log(document.documentElement.clientHeight)

			})

			function setInitValue(obj) {
				curY = obj.offset().top //152
				curH = obj.height(); //46
				curW = obj.width(); //64
				srtY = curY + (curH / 2) + "px"; //设置提示箭头的Top值175
				srtX = curW + obj.offset().left + 7 + "px"; //设置提示箭头的Left值 64
			}
			$(document).on("mouseenter", ".drore-left-min li", function() {
				objL = $(this); //获取当前对象
				if($(this).find("#drore-reorder").length == 1) {
				} else {
					$("body").append("<div class='tipso_bubble  fadeIn' id='tips" + $(this).index() + "'></div>")
					setInitValue(objL); //设置当前位置
					var allY = curY + "px"; //设置提示框的Top值

					var tipsid = '#tips' + $(this).index();
					$(tipsid).text($(this).find(">a>span").text())
					$(tipsid).css({
						"top": allY,
						"left": srtX
					})

				}
			})
			$(document).on("mouseleave", ".drore-left-min li", function() {
					//设置当前所选项的鼠标移出事件
					var tipsid = '#tips' + $(this).index();
					$(tipsid).removeClass("fadeIn").addClass("animated fadeOut");
					t = setTimeout(function() {
						$(tipsid).remove()
					}, 500);

				})
		}
});
