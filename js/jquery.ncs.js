
$(function() {
	if ($("[data-replace-br=Y]").length > 0) {
		$("[data-replace-br=Y]").html($("[data-replace-br=Y]").html().replace(/\n/g, "<br/>"));
	}
	
	if($(".onoffBtn").length != 0) {
		js.onoff();
	}
	
	$(window).bind("scroll", function() {
		if ($(".lnb").length > 0) {
			var top = $(window).scrollTop() - $("#header-new").height() - $(".lnb-title").height();
			var winHeight = $(window).height() - $("#FOOTER_AREA").height();
			var lnbTop = parseInt($(".lnb").css("margin-top")) + $("#header-new").height() + $(".lnb-title").height();
			var lnbBottom = $(".lnb").height() + lnbTop;
			var bottomGap = 50;
			var parentBottom = parseInt($(".lnb").parent().css("padding-bottom"));
			
			lnbTop = lnbTop ? lnbTop : 0;
			parentBottom = parentBottom ? parentBottom : 0;
			
			if (top > 0) {
				if ($(".lnb").height() < winHeight || lnbTop > $(window).scrollTop() || lnbBottom + bottomGap < $(window).scrollTop()) {
					if (top + $(".lnb").height() + bottomGap + parentBottom <= $(".col-contents").height()) {
						$(".lnb").css("margin-top", top + "px");
					} else {
						$(".lnb").css("margin-top", ($(".col-contents").height() - $(".lnb").height() - parentBottom) + "px");
					}
				}
			} else {
				$(".lnb").css("margin-top", "-20px");
			}
		}
	});
	
	$(document).on("click", "a", function() {
		if ($(this).not(".noLoadingProgress").attr("href")) {
			var hrefs = $(this).not(".noLoadingProgress").attr("href").match(/^.+\.do[?]?.*(#.+)?/);
			
			if (hrefs && hrefs.length >= 2 && hrefs[2] == undefined && !$(this).attr("target") && ($(this).attr("onclick") ? $(this).attr("onclick") : "").indexOf("window.open") == -1) {
				if (loadingProgress) {
					loadingProgress.open();
				}
			}
		}
	});
	
	$(window).bind("unload", function() {
		if (loadingProgress) {
			loadingProgress.open();
		}
	});
	
	viewTab();
	ckFn("ckTbl");

	//ie에서 초기입력시 한글 우선 모드 설정.
	$("input[type=text][name!=id],textarea").css("ime-mode", "active");
	$("input[name=search_value]").css("ime-mode", "active");
	
	//레이어 배경역 클릭 시 레이어 닫힘 기능
	$(".popBg").bind("click", function() {
		$(".layPop").hide();
		$(this).hide();
	});
	
	//LNB 배경 라인 꽉차게 처리
	$(".sub-container").css("min-height", document.body.offsetHeight - parseInt($(".header-new").css("height")));	
	window.onresize = function() {
		$(".sub-container").css("min-height", document.body.offsetHeight - parseInt($(".header-new").css("height")));
	};
	
	$(document).on("keyup",".numberOnly",function(){
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	}).on("focus",".numberOnly",function(){
		if (this.value * 1 == 0) this.value = '';
	});

	$(document).on("keyup",".digitOnly",function(){
		$(this).val($(this).val().replace(/[^0-9]/g, ''));
	});
	
	$(document).on("keyup",".realNumberOnly",function(){
		$(this).val($(this).val().replace(/[^0-9\.]/g, ''));
	}).on("focus",".realNumberOnly",function(){
		if (this.value * 1 == 0) this.value = '';
	});
	

	$(document).on("focusout",".numberOnly", function() {
		this.value = $(this).val().match(/[\d]+/) ? parseInt($(this).val()) : 0;
		var max = parseInt($(this).attr("data-number-max"));
		if (max < this.value) {
			alert("최대 값을 초과하였습니다.");
			this.value = max;
		}
	});
	
	$(document).on("focusout",".realNumberOnly", function() {
		this.value = $(this).val().match(/^[\d]+([.][\d]+)?$/) ? roundCal(this.value) : 0;
		var max = parseFloat($(this).attr("data-number-max"));
		if (max < this.value) {
			alert("최대 값을 초과하였습니다.");
			this.value = max;
		}
	});
	
	$(".hint").bind("mouseover", function(e) {
		$(this).after('<div class="hintMsg left">' + ($(this).attr("data-hint-title") ? '<p class="ico">' + $(this).attr("data-hint-title") + '</p><br/>' : '') + $(this).attr("data-hint").replace(/\n/g, '<br/>').replace(/\\n/g, '<br/>') + '</div>');
		var $hintMsg = $(this).next().filter(".hintMsg");
		$hintMsg.append('<div class="arrow"></div>');

		var thisWidth = $(this).width() + (parseInt($(this).css("padding-left")) > 0 ? parseInt($(this).css("padding-left")) : 0) + (parseInt($(this).css("padding-right")) > 0 ? parseInt($(this).css("padding-right")) : 0);
		var thisHeight = $(this).height() + (parseInt($(this).css("padding-top")) > 0 ? parseInt($(this).css("padding-top")) : 0) + (parseInt($(this).css("padding-bottom")) > 0 ? parseInt($(this).css("padding-bottom")) : 0);
		var msgWidth = $hintMsg.width() + (parseInt($hintMsg.css("padding-left")) > 0 ? parseInt($hintMsg.css("padding-left")) : 0) + (parseInt($hintMsg.css("padding-right")) > 0 ? parseInt($hintMsg.css("padding-right")) : 0);
		var msgHeight = $hintMsg.height() + (parseInt($hintMsg.css("padding-top")) > 0 ? parseInt($hintMsg.css("padding-top")) : 0) + (parseInt($hintMsg.css("padding-bottom")) > 0 ? parseInt($hintMsg.css("padding-bottom")) : 0);
		
		var t = $(this).position().top - thisHeight / 2;
		var l = $(this).position().left + thisWidth + $hintMsg.find("div.arrow").width();

		if ($(window).width() + $(window).scrollLeft() < e.pageX + msgWidth + thisWidth) {
			l = $(this).position().left - msgWidth - 5;
			$hintMsg.find("div.arrow").addClass("right");
		}

		if ($(window).height() + $(window).scrollTop() < e.pageY + msgHeight + thisHeight) {
			l = $(this).position().top - msgHeight - 3;
		}

		$hintMsg.css({"top": t, "left": l});
		$hintMsg.find("div.arrow").css("top", thisHeight / 2);
		$hintMsg.show();
	}).bind("mouseout", function() {
		$(this).next().filter(".hintMsg").remove();
	});
	

	$(".surveyInputSelector").each(function() {
		$(this).parent().addClass("noPadding");
		
		var tag = '\
<table class="subTbl surveyInputSelectorSub">\n\
<colgroup>\n';
		
		for (var i = parseInt($(this).attr("data-max")); i >= parseInt($(this).attr("data-min")); --i) {
			tag += ('		<col width="200">\n');
		}
		
		tag += ('	</colgroup>\n');
		tag += ('	<tr>\n');

		if ($(this).attr("data-ui") == "single") {
			for (var i = parseInt($(this).attr("data-max")); i >= parseInt($(this).attr("data-min")); --i) {
				tag += ('		<td class="surveySelector ' + ($(this).attr("data-bg" + i) != undefined ? $(this).attr("data-bg" + i) : '') + '" data-name="' + this.name + '" data-value="' + $(this).attr("data-value" + i) + '" data-readonly="' + ($(this).attr("data-readonly") ? $(this).attr("data-readonly") : '') + '">' + $(this).attr("data-text" + i) + '</td>\n');
			}
		} else {
			for (var i = parseInt($(this).attr("data-max")); i >= parseInt($(this).attr("data-min")); --i) {
				tag += ('		<th>' + $(this).attr("data-text" + i) + '</th>\n');
			}
			tag += ('	</tr>\n');
			tag += ('	<tr>\n');
			for (var i = parseInt($(this).attr("data-max")); i >= parseInt($(this).attr("data-min")); --i) {
				tag += ('		<td class="surveySelector ' + ($(this).attr("data-bg" + i) != undefined ? $(this).attr("data-bg" + i) : '') + '" data-name="' + this.name + '" data-value="' + $(this).attr("data-value" + i) + '" data-readonly="' + ($(this).attr("data-readonly") ? $(this).attr("data-readonly") : '') + '">' + $(this).attr("data-text" + i) + '</td>\n');
			}
		}

		tag += ('	</tr>\n\
</table>');

		$(this).after(tag);

		if ($(this).attr("data-readonly") != "true") {
			$(".surveySelector[data-name='" + this.name + "']").addClass("active");
		}

		$(this).parent().find(".surveyInputSelectorSub").each(function() {
			$(this).height($(this).closest(".noPadding").height());
		});
		
		$(".surveySelector[data-name='" + this.name + "'][data-value='" + this.value + "']").removeClass("active").addClass("selected");
	});

	$(".surveyInputCheckbox").each(function() {
		$(this).parent().addClass("noPadding");
		$(this).after('\
	<table class="subTbl surveyInputCheckboxSub">\n\
		<colgroup>\n\
			<col width="200">\n\
		</colgroup>\n\
		<tr>\n\
			<td class="surveyCheckbox ' + ($(this).attr("data-ui") ? $(this).attr("data-ui") : '') + '" data-name="' + this.name + '"></td>\n\
		</tr>\n\
	</table>');

		this.value = (this.value == "" ? $(this).attr("data-value0") : this.value);

		for (var i = parseInt($(this).attr("data-min")); i <= parseInt($(this).attr("data-max")); ++i) {
			if ($(this).attr("data-value" + i) == this.value) {
				$(".surveyCheckbox[data-name='" + this.name + "']").addClass("checked" + i);
				$(".surveyCheckbox[data-name='" + this.name + "']").html($(this).attr("data-text" + i) == "" ? "&nbsp;" : $(this).attr("data-text" + i));
				break;
			}
		}

		$(this).parent().find(".surveyInputCheckboxSub").each(function() {
			$(this).height($(this).closest(".noPadding").height());
		});
	});

	$(document).on("click",".surveySelector",function(){
		if ($(this).attr("data-readonly") == "true") {
			return;
		}

		$(this).closest("tr").find(".surveySelector").removeClass("selected").addClass("active");
		$(this).removeClass("active").addClass("selected");
		$("input[name='" + $(this).attr("data-name") + "']").val($(this).attr("data-value"));

		if ($("input[name='" + $(this).attr("data-name") + "']").attr("data-actionFn") == "true") {
			if (actionFn[$(this).closest("form").get(0).name]) {
				actionFn[$(this).closest("form").get(0).name]($(this).closest("form").get(0).name);
			}
		}
	});

	$(document).on("click",".surveyCheckbox",function(){
		var $input = $("input[name='" + $(this).attr("data-name") + "']");

		for (var i = parseInt($input.attr("data-min")); i <= parseInt($input.attr("data-max")); ++i) {
			if ($input.attr("data-value" + i) == $input.val()) {
				var next = (i + 1) > parseInt($input.attr("data-max")) ? parseInt($input.attr("data-min")) : (i + 1);
				$(this).removeClass("checked" + i).addClass("checked" + next);
				$(this).html($input.attr("data-text" + next) == "" ? "&nbsp;" : $input.attr("data-text" + next));
				$input.val($input.attr("data-value" + next));
				break;
			}
		}

		var yCnt = $(this).closest("form").find(".surveyInputCheckbox[value='" + $input.attr("data-value1") + "']").length;

		if ($(this).closest("form").find("input.cqiEval").attr("data-yn3")) {
			$(this).closest("form").find(".surveySelector").removeClass("selected");

			if ($(this).closest("form").find("input.cqiEval").attr("data-yn3") * 1 <= yCnt) {
				$(this).closest("form").find("input.cqiEval").val(3);
				$(this).closest("form").find(".surveySelector[data-value=3]").addClass("selected");
			} else if ($(this).closest("form").find("input.cqiEval").attr("data-yn2") * 1 <= yCnt) {
				$(this).closest("form").find("input.cqiEval").val(2);
				$(this).closest("form").find(".surveySelector[data-value=2]").addClass("selected");
			} else {
				$(this).closest("form").find("input.cqiEval").val(1);
				$(this).closest("form").find(".surveySelector[data-value=1]").addClass("selected");
			}
		}

		if (actionFn[$(this).closest("form").get(0).name]) {
			actionFn[$(this).closest("form").get(0).name]($(this).closest("form").get(0).name);
		}
	});
	

	
	$("input[type='hidden'][name^='self__'][name$='_temp_bodycnt']").each(function() {if ($(this).val() == 0) {$(this).next().click();}});
	

	$("tbody[data-table-merge-rows=true]").each(function() {
		$(this).find("> tr").each(function(idx) {
			$(this).attr("data-table-pos-row", idx);
			$(this).find("> td").each(function(idx2) {
				$(this).attr("data-table-pos-row", idx);
				$(this).attr("data-table-pos-col", idx2);
			});
		});
	});
	
	$(document).on("focus", "input[type=text]:not('.noFocusEvent'),input[type=password]:not('.noFocusEvent'),textarea:not('.noFocusEvent')", function() {
		$(this).attr("data-css-background-color", $(this).css("background-color"));
		$(this).attr("data-css-border-color", $(this).css("border-color"));
		$(this).css("background-color", "#ffffed");
		$(this).css("border-color", "red");
	});
	
	$(document).on("blur", "input[type=text]:not('.noFocusEvent'),input[type=password]:not('.noFocusEvent'),textarea:not('.noFocusEvent')", function() {
		$(this).css("background-color", $(this).attr("data-css-background-color"));
		$(this).css("border-color", $(this).attr("data-css-border-color"));
	});
	
	$(document).on("keyup", "textarea", function() {
		if($(this).attr("maxlength") && !isNaN($(this).attr("maxlength")) && this.value.length > $(this).attr("maxlength")) {
			alert("최대  " + $(this).attr("data-maxlength") + "자까지 입력가능합니다.");
			this.value = this.value.substring(0, $(this).attr("maxlength"));
		}
	})
	
	tableMergeRows();
});

var tableMergeRows = function() {	
	$("tbody[data-table-merge-rows=true] > tr > td").each(function() {
		var val = $(this).attr("data-table-merge-val");
		
		if (val != undefined && val != "") {
			var col = $(this).attr("data-table-pos-col") * 1;
			var $bottomTd = $(this).closest("tr").next().find("> td[data-table-pos-col=" + col + "]");
			
			while ($bottomTd.length > 0 && $bottomTd.attr("data-table-merge-val") == val) {
				$(this).attr("rowspan", ($(this).attr("rowspan") ?  $(this).attr("rowspan") * 1 : 1) + 1);
				$removeTd = $bottomTd;
				$bottomTd = $bottomTd.closest("tr").next().find("> td[data-table-pos-col=" + col + "]");
				$removeTd.remove();
			}
		}
	});
}

var realNumberOnly = function(obj){
	var value = $("input[name='" + obj + "']").val().match(/^[\d]+([.][\d]+)?$/) ? roundCal($("[name='" + obj + "']").val()) : 0;
	var max = parseFloat($("[name='" + obj + "']").attr("data-number-max"));
	
	if (max < value) {
		alert("최대 값을 초과하였습니다.");
		$("[name='" + obj + "']").val(max);
	} else {
		$("[name='" + obj + "']").val(value);
	}
}

/************************************************************
	 Common Jacascript
	 Data : 2015.04.15
	 Developer : Sung Min Chang
************************************************************/

var js = {
	nav : function(menu1, menu2, menu3){ 
		 var $menu1 = $(".subNav ul li[data-menu1-id='" + menu1 + "']");
		 $menu1.addClass("on");
		 if(menu2 != undefined){
			 var $menu2 = $menu1.find("ol li[data-menu2-id='" + menu2 + "']");
			 $menu2.addClass("on");
			 if(menu3 != undefined){
				 $menu2.find("p[data-menu3-id='" + menu3 + "']").addClass("on");
			 }
		 }
		
		/*var $nav = $(".subNav"),
			$li = $nav.find(" > ul > li"),
			now = be = (lnb != 99) ? lnb : 99,
			setTime = null;
		
		$li.eq(lnb).addClass("on").find(" > ol > li").eq(sub).addClass("on");*/
		
	},
	onoff : function(){
		
		var $inp = $(".onoffBtn"),
			agt = navigator.userAgent.toLowerCase();

		var inpPos = function(idx){
			var posVal = ["bottom", "top"];
			var posIdx = ($inp.eq(idx).find("input").is(":checked")) ? 0 : 1;
			$inp.eq(idx).find("label").css("background-position","left "+posVal[posIdx]);
		};

		$inp.each(function(idx){
			inpPos(idx);
			$(this).find("input").bind("change", function(){
				inpPos(idx);
			});
		});


	}
};



/************************************************************
	 view More Jacascript
	 Data : 2015.09.29
	 Developer : Sung Min Chang
************************************************************/

var viewTab = function(){
	
	var $viewBtn = $(".viewBtn"),
		$viewBox = $(".viewBox");

	$viewBtn.each(function(idx){

		var onOff = ($viewBox.eq(idx).css("display") != "none") ? "left top" : "left bottom";
		$(this).find("a:last-child").css("background-position" , onOff);

		$(this).find("a:last-child").unbind("click");
		$(this).find("a:last-child").bind("click", function(){
			var pos = ($viewBox.eq(idx).css("display") == "none") ? "left top" : "left bottom",
				dis = ($viewBox.eq(idx).css("display") != "none") ? "none" : "block";
			$(this).css("background-position" , pos);
			$viewBox.eq(idx).css("display", dis);

		});
	});

}



/************************************************************
	 CheckBox Jacascript
	 Data : 2015.03.19
	 Developer : Sung Min Chang
************************************************************/

var ckFn = function(obj){
	var $obj = $("."+obj),
		$allCk = $obj.find("input[name=allCk]"),
		$ck = $obj.find("input[name=ck]"),
		num = max = 0,
		ckAt = cls = null,
		max = $ck.length;

	$allCk.bind("click", function(){

		num  = ($allCk.attr("checked") == "checked") ? max : 0,
		ckAt = ($allCk.attr("checked") == "checked") ? true : false;
		
		$ck.attr("checked", ckAt);

	});

	$ck.each(function(idx){
		$(this).bind("click", function(){

			num = ($(this).attr("checked") == "checked") ? num+1 : num-1,
			ckAt = (num == max) ? true : false;

			$allCk.attr("checked", ckAt);

		});
	});

};


/************************************************************
	 Popup Jacascript
	 Data : 2014.10.29
	 Developer : Sung Min Chang
************************************************************/

var winScrollTop = 0;
var pop = {
	open : function(obj, url){
		$obj = $("#" + obj);

		if (url && $obj.find("iframe").attr("src") != url) {
			$obj.find("iframe").attr("src", url);
		}

		$obj.fadeIn(500);
		$(".popBg").fadeIn(500);
		$obj.find(".scrollBox, iframe").height($obj.height() - ($obj.find(".scrollBox, iframe").attr("data-height") ? $obj.find(".scrollBox, iframe").attr("data-height") : 200));
		winScrollTop = $(window).scrollTop();
	},
	close : function(obj) {
		if(obj == undefined){
			var $obj = $(".layPop");

			$obj.fadeOut(300);
			$(".popBg").fadeOut(300);
		}else{
			var $obj = $("#"+obj);

			$obj.fadeOut(500);
		}
		
		$(window).scrollTop(winScrollTop);
	}
};

$(window).bind("resize", function() {
	$(".layPop").find(".scrollBox, iframe").each(function() {
		var $obj = $(this).closest(".layPop");
		$obj.find(".scrollBox, iframe").height($obj.height() - ($obj.find(".scrollBox, iframe").attr("data-height") ? $obj.find(".scrollBox, iframe").attr("data-height") : 200));
	});
});


/************************************************************
Round calculation Javascript
Data : 2015.12.20
Developer : Min Wook Kim
************************************************************/
var roundCal = function(val){
	val += "";
	if(jQuery.isNumeric(val.replace(/,/gi,""))){
		value = val.replace(/,/gi,"") * 1;		
		return (Math.round(value * 10 * 10) / 100);	
	}else{
		return val;
	}	
}

var roundCal_int = function(val){
	val += "";
	if(jQuery.isNumeric(val.replace(/,/gi,""))){
		value = val.replace(/,/gi,"") * 1;		
		return (Math.round(value ) );	
	}else{
		return val;
	}	
}

/************************************************************
이벤트 실행 중지
Data : 2015.12.20
Developer : Min Wook Kim
************************************************************/
jQuery.hrefStop = function (event) {
	if (event.preventDefault) {
		event.preventDefault();
	} else if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.stop();
	}
	event.returnValue = false;
}



/************************************************************
IE8 대응
Data : 2015.12.29
Developer : Min Wook Kim
************************************************************/
if (!Array.indexOf) {
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		
		return -1;
	}
}
/************************************************************
소수점 2자리 이후 절사
Data : 2015.12.20
Developer : Min Wook Kim
************************************************************/
var floorCal = function(val){
	val += "";
	if(jQuery.isNumeric(val.replace(/,/gi,""))){
		value = val.replace(/,/gi,"") * 1;		
		return (Math.floor(value * 10 * 10) / 100);	
	}else{
		return val;
	}
}


var printPop = function(page, param) {
	window.open(page + window.location.search + (param ? param : ""), "print", "width=910,height=600,scrollbars=1");
}


//평가 제외 alert
var exceptMsg = function(){
	alert("평가 제외된 학생입니다.\n종합평가에서 평가제외 해제 후 이용해주세요.");
}

/*
var printScreen = function() {
	//$("textarea.noPrint|input[type!=radio][type!=checkbox][type!=hidden].noPrint").each(function() {
	$("#inputBody textarea").each(function() {
		if ($(this).parent().find(".inputPrint").length == 0) {
			$(this).before('<div class="inputPrint left printOnly"></div>');
		}
		
		$(this).parent().find(".inputPrint").html(this.value.replace(/</g, "&lt;").replace(/\n/g, "<br/>"));
	});
	$("#inputBody input[type!=radio][type!=checkbox][type!=hidden]").each(function() {
		if ($(this).parent().find(".inputPrint").length == 0) {
			$(this).before('<div class="inputPrint left printOnly"></div>');
		}
		
		$(this).parent().find(".inputPrint").html(this.value.replace(/</g, "&lt;").replace(/\n/g, "<br/>"));
	});
	window.print();
}*/


var lod = {
	open : function(){
		$("body").append("<div class='loding'><img src='/images/common/ico_loding.gif' alt='' /></div>");
	},
	close : function(){
		$(".loding").remove();
	}
}

//팝업 기능 추가
var winPop = function(url,name,opt){
	window.open(url, name, opt);
}


var goLnb = function(obj, s_seq, sbj_no) {
	var seqName1 = "s_seq", seqName2 = "sbj_no";
	
	if (obj.id == "lnbEduSelect") {
		seqName1 = "em_seq";
		seqName2 = "em_seq";
	}
	
	if ($(obj).val() == "#noStep") {
		alert("이전단계가 완료되지 않아서 이용할 수 없습니다.");
	} else if ($(obj).val() == "#noOper") {
		alert("교육정보 운영 입력을 완료 후 이용할 수 있습니다.");
	} else if ($(obj).val() == "#noSbj") {
		alert("등록 후 이용할 수 있습니다.");
	} else if ($(obj).val() == "subject.do") {
		goDetail($(obj).val(), seqName2, sbj_no);
	} else {
		goDetail($(obj).val(), seqName1, s_seq);
	}
}






/*************************************************************************************
 * *********************************프린트******************************************
 *************************************************************************************/
var GoogleChart = 0 ;	//구글 차트용 변수


var printScreen = function() {
	var params = window.location.search + (window.location.search.indexOf("?") >=0 ? "&" : "?") + "isPrint=Y";
	window.open(location.pathname + params, "print", "width=890,height=600,scrollbars=1");
}
var SETINTERVALPrint;
$(function(){
	if(location.search.indexOf("isPrint=Y") >= 0){
		$("header,footer,nav").remove();
		$(".noPrint").remove();
		$("[id='FOOTER_AREA']").remove();
		$(".col-lnb").remove();
		$(".tabBox").css("padding-bottom","20px");
		$("table th").css("padding","10px 5px");
		
		$("textarea").each(function(){
			var textTag = $(this).val().replace(/\r\n/g,'<br/>').replace(/\r/g,'<br/>').replace(/\n/g,'<br/>');
			$("<span>" + textTag + "</span>").insertAfter(this);
		});
		$("textarea").remove();
		
		$("select").each(function(){
			$("<span>" + $(this).find("option:selected").text() + "</span>").insertAfter($(this));	
		});
		$("select").remove();
		
		if (typeof(GoogleChart) == "undefined" || (typeof(GoogleChart) != "undefined" && GoogleChart <= 0)) {
			window.print();
		} else {
			SETINTERVALPrint = setInterval(chartPrint, 1050);
		}
	}
});

var chartPrint = function(){
	if (typeof(GoogleChart) != "undefined" && GoogleChart <= 0){
		$("div[id^=piechart").each(function(){
			$(this).css("height",$(this).prop("scrollHeight"));
			var img = $(this).find("img");
			$(img).prop("height",$(img).height());
		});
		var heightP = ($("div[class='subBox'] h2").length > 0 ? $("div[class='subBox'] h2").height() : 0) + ($("div[class='subBox'] h3").length > 0 ? $("div[class='subBox'] h3").height() : 0);
		$("div[class='table-responsive']").children("div,table,form").each(function(){
			if(heightP + $(this).outerHeight() > 1080){
				$("<div class=\"pagePut\"></div>").insertBefore($(this));
				heightP = $(this).outerHeight();
			}else{
				heightP += $(this).outerHeight()
			}
		});
		window.print();	
		clearInterval(SETINTERVALPrint);
	}
}



var addRow = function(obj, bodyName, sampleName) {
	var html = $(obj).closest('.tabBox').find('tbody.' + (sampleName ? sampleName : 'dataSample')).html()
		.replace(/{data-no}/g, $(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataFinishLine").not(".dataNoCount").last().attr("data-no") * 1 > 0 ? $(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataFinishLine").not(".dataNoCount").last().attr("data-no") * 1 + 1 : 1)
		.replace(/{no[+]1}/g, $(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataNoCount").length + 2)
		.replace(/{no}/g, $(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataNoCount").length + 1)
		.replace(/ disabled/g, '');
	
	if ($(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' tr.dataFinishLine').length > 0) {
		$(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' tr.dataFinishLine').before(html);
	} else {
		$(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody')).append(html);
	}
	
	if (actionFn[$(obj).closest(".tabBox").get(0).name]) {
		actionFn[$(obj).closest(".tabBox").get(0).name]($(obj).closest(".tabBox").get(0).name);
	}
	
	$(obj).closest(".tabBox" + (bodyName ? " ." + bodyName : '')).find(".temp_bodycnt").val($(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataFinishLine").not(".dataNoCount").length);
	
	return true;
}

var delRow = function(obj, isUnlimited, bodyName) {
	if (!isUnlimited && $(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').last().attr("data-no") * 1 == 1) {
		alert("이미 삭제 가능한 항목이 모두 삭제되었습니다.");
		return false;
	}
	
	var delObj = $(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr[data-no=' + ($(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataFinishLine").last().attr("data-no") * 1) + ']');
	
	if (delObj.length > 0) {
		$(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr[data-no=' + ($(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataFinishLine").last().attr("data-no") * 1) + ']').remove();
		$(obj).closest(".tabBox" + (bodyName ? " ." + bodyName : '')).find(".temp_bodycnt").val($(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataFinishLine").not(".dataNoCount").length);
		return true;
	} else {
		$(obj).closest(".tabBox" + (bodyName ? " ." + bodyName : '')).find(".temp_bodycnt").val($(obj).closest('.tabBox').find('tbody.' + (bodyName ? bodyName : 'dataBody') + ' > tr').not(".dataFinishLine").not(".dataNoCount").length);
		return false;		
	}
}


var toString = function(str, reStr) {
	if (str == undefined || str == null) {
		return reStr == undefined ? "" : reStr;
	} else {
		return str;
	}
}

var showNCSModule = function(cd, cd1, cd2, cd3, cd4, cd5) {
	cd1 = cd && cd.length >= 10 ? cd.substr(0, 2) : cd1;
	cd2 = cd && cd.length >= 10 ? cd.substr(2, 2) : cd2;
	cd3 = cd && cd.length >= 10 ? cd.substr(4, 2) : cd3;
	cd4 = cd && cd.length >= 10 ? cd.substr(6, 2) : cd4;
	cd5 = cd && cd.length >= 10 ? cd.substr(8, 2) : cd5;

	window.open("https://www.ncs.go.kr/unity/th03/ncsResultSearch.do?ncsLclasCd=" + cd1 + "&ncsMclasCd=" + cd2 + "&ncsSclasCd=" + cd3 + "&ncsSubdCd=" + cd4 + "&ncsCompeUnitCd=" + cd5 + "&ncsClCd=" + cd + "&doCompeUnit=true");
}

var ajaxLoginAfterObj = null;
var ajaxLoginAfterOption = null;
var ajaxLoginSubmit = function() {
	if (!$("form[name=loginLayerFrm] #id").val()) {
		alert("아이디를 입력하세요.");
		$("form[name=loginLayerFrm] #id").focus();
		return false;
	}

	if (!$("form[name=loginLayerFrm] #password").val()) {
		alert("비밀번호를 입력하세요.");
		$("form[name=loginLayerFrm] #password").focus();
		return false;
	}
	
	$.ajax({
		url : "/member/ajax_login_proc.do",
		dataType : "json",
		type : "post",
		data : $("form[name=loginLayerFrm]").serialize(),
		async : true,
		success : function(result) {
			if (result.isLogin == "Y") {
				if (ajaxLoginAfterObj) {
					if (confirm("로그인 되었습니다.\n내용을 서버로 다시 전송하시겠습니까?\n")) {
						$(ajaxLoginAfterObj).fn_ajaxSubmit(ajaxLoginAfterOption);
					}
				} else if (ajaxLoginAfterOption) {
					if (confirm("로그인 되었습니다.\n내용을 서버로 다시 전송하시겠습니까?\n")) {
						$.ajax(ajaxLoginAfterOption);
					}
				} else {
					alert("로그인 되었습니다.");
				}
				
				pop.close();
			} else {
				alert(result.msg.message);
			}
		}
	});
	
	return false;
};
var ajaxLoginCheck = function(formObj, formOptions) {
	var isLogin = false;
	
	$.ajax({
		url : "/loginStatus.do?timestamp=" + encodeURIComponent(new Date().getTime()),
		dataType : "json",
		type : "post",
		async : false,
		success : function(result) {
			isLogin = result.isLogin == "Y";

			if(!isLogin){
				ajaxLoginShow(formObj, formOptions);
			}
		},
		error : function() {
			alert("서버와 통신이 원활하지 않습니다.\n\n잠시 후 다시 이용하여 주세요.");
		}
	});
	
	return isLogin;
};
var ajaxLoginShow = function(formObj, formOptions, thisFunction) {
	var loginHtml = '\
		<div class="layPop" id="loginLayer">\n\
			<div class="tit">다시 로그인 하기</div>\n\
			<div class="box listPop">\n\
				<p>\n\
					로그인이 종료되어 다시 로그인이 필요합니다.<br/>\n\
					작성하신 내용은 그대로 유지됩니다.<br/>\n\
					로그인 후 이어서 계속 하실 수 있습니다.<br/><br/><br/>\n\
				</p>\n\
				<div class="loginCon">\n\
				<form name="loginLayerFrm" method="post" action="/member/login_proc.do" onsubmit="return ajaxLoginSubmit();">\n\
					<input type="hidden" id="refer" name="refer" value="${param.refer}" />\n\
					<input type="hidden" id="manager" name="manager" value="${params.manager}"/>\n\
					<div class="inp">\n\
						<p><label><strong>아이디</strong><input type="text" id="id" name="id" value="" /></label></p>\n\
						<p><label><strong>비밀번호</strong><input type="password" id="password" name="password" value="" /></label></p>\n\
					</div>\n\
					<div class="submit"><a href="login" onclick="ajaxLoginSubmit(); return false;">로그인</a></div>\n\
				</form>\n\
				</div>\n\
			</div>\n\
			<div class="close"><a href="#none" onclick="pop.close()"><img src="/images/btn/btn_close.gif" alt="닫기"></a></div>\n\
		</div>';
	if ($("loginLayer").length == 0) {
		$("body").append(loginHtml);
		$("#loginLayer .inp input").each(function(idx){
			$(this).bind({
				focusin : function(){
					$(this).closest(".inp").find("strong").eq(idx).css("display" , "none");
				},
				focusout : function(){
					var dis = $(this).val() != "" ? "none" : "inline-block";
					$(this).closest(".inp").find("strong").eq(idx).css("display" , dis);
				}
			});
		}).bind("keyup", function(event) {
			if (event.keyCode == 13) {
				ajaxLoginSubmit();
			}
		});
	}
	
	pop.open("loginLayer");
	
	ajaxLoginAfterObj = formObj;
	ajaxLoginAfterOption = formOptions;
};

var fn_ajaxSubmit_ing = true;
$.fn.fn_ajaxSubmit = function(options) {
	if(!fn_ajaxSubmit_ing){
		alert("잠시만 기다려 주세요.");
		return;
	}
	
	if (!ajaxLoginCheck(this, options)) {
		return false;
	}
	
	//optinos setting
	options = options || {};
	var fn_default = ajaxSubmitForm_default;
	for (var prop in fn_default)  {
		options[prop] = typeof options[prop] !== 'undefined' ? options[prop] : ajaxSubmitForm_default[prop];
	}
	
	$(this).ajaxSubmit({
		url : options.url
		, type : 'post'
		, data : $(this).serialize()
		, dataType : 'json'
		, beforeSubmit: function (data,form,option) {
			if(options.beforeSubmit != ''){
				return eval(options.beforeSubmit);
			}
            return true;
        }
		, beforeSend : function (xhr) {
			if (loadingProgress) {
				loadingProgress.open();
			}
			
			fn_ajaxSubmit_ing = false;
		}
		, success : function (result, textStatus) {
			
			if( result.result > 0 ){
				
				if(result.returnMsg != null && result.returnMsg != ''){
					alert(result.returnMsg);
				} else if (options.returnMsg != null && options.returnMsg != ''){
					alert(options.returnMsg);
				} else{
					alert("저장 하였습니다.");
				}
				
				if(options.returnUrl == 'N'){
				}else if(options.returnUrl != ''){
//					location.replace(options.returnUrl);
					document.location.href = options.returnUrl;
				}else if(result.returnUrl != null && result.returnUrl != ''){
					document.location.href = result.returnUrl;
				}else{
					location.reload();
				}
			}else{
				alert("저장에 실패하였습니다.");
			}
			
		}
		, error : function (xhr, ajaxOptions, thrownError) {
			alert("저장 중 오류가 발생하였습니다.");
		}
		, complete : function (xhr, textStatus) {
			if (loadingProgress) {
				loadingProgress.close();
			}
			
			fn_ajaxSubmit_ing = true;
		}
	});
	
	return this;
};

var ajaxSubmitForm_default = {
	url: ''
	, beforeSubmit: ''
	, returnUrl: ''
};



function addParagraph(obj) {
	var cnt = $(obj).closest(".textParagraphGroup").find(".textParagraph").length;
	$(obj).closest(".textParagraphGroup").find(".textParagraph:last").after(
			'<div class="textParagraph" data-ord="' + (++cnt) + '">\n' + $(obj).closest(".textParagraphGroup").find(".textParagraph:first").html() + '\n</div>'
		);
	
	refreshParagraph($(obj).closest(".textParagraphGroup"), "add");
}

function delParagraph(obj) {
	var cnt = $(obj).closest(".textParagraphGroup").find(".textParagraph").length;
	
	if (cnt == 1) {
		alert("마지막 단락은 삭제할 수 없습니다.\n\n현재 단락을 삭제하고 싶은 경우 새 단락을 추가한 후 삭제하여 주세요.");
		return;
	}
	
	if (!confirm("단락을 삭제하시겠습니까?")) {
		return;
	}
	
	var groupObj = $(obj).closest(".textParagraphGroup");
	$(obj).closest(".textParagraph").remove();
	
	refreshParagraph(groupObj);
}

function refreshParagraph(groupObj, status) {
	var cnt = $(groupObj).find(".textParagraph").length;
	
	$(groupObj).find(".textParagraph").each(function(idx) {
		var ord = idx + 1;
		$(this).attr("data-ord", ord);
		$(this).find(".ptitle").text("단락" + ord);
		$(this).find("select,textarea").each(function() {
			$(this).attr("name", $(this).attr("data-name-base") + ord);
			if (status == "add" && ord == cnt) {
				$(this).val("");
			}
		});
	});
	
	$(groupObj).find("input[type=hidden].temp_paragraphcnt").val(cnt);
}