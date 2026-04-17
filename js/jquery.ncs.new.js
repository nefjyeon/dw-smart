$(function(){
	$(".mobile-menu a").click(function(e){
		e.preventDefault();
		if ( $("html").hasClass("mobile-open") ){
			$("html").removeClass("mobile-open");
		}else{
			$("html").addClass("mobile-open");
		}
	});
});

var lod = {
		open : function(){
			$("body").append("<div class='loding'><img src='/images/common/ico_loding.gif' alt='' /></div>");
		},
		close : function(){
			$(".loding").remove();
		}
	}