/************************************************************
	 Page Parameter Manager Jacascript
	 Data : 2015.07.23
	 Developer : Park Ki Soon
************************************************************/

function getParams(searchData) {
	var search = searchData && searchData.search ? "?" + searchData.search : window.location.search;
	var isAlphabatCase = true;
	var isSingleCase = true;
	
	if (searchData && searchData.isAlphabatCase != undefined) {
		isAlphabatCase = searchData.isAlphabatCase;
	}
	
	if (searchData && searchData.isSingleCase != undefined) {
		isSingleCase = searchData.isSingleCase;
	}
	
	var applyKey = "\n";
	
	if (searchData) {
		for (var i = 0; i < $(searchData.form).find("input,select,textarea").length; ++i) {
			var item = $($(searchData.form).find("input,select,textarea")[i]);
			var type = item.attr("type");
			var key = item.attr("name");
			var val = item.val();
			
			if (key) {
				var param = "&" + key + "=" + encodeURIComponent(val);
	
				if (type == "checkbox" && !item.attr("checked")) {
					val = null;
				}
	
				var expStr = new RegExp("[?&](" + key + ")=([^&^#]*)", isAlphabatCase ? "g" : "gi");
				
				if (search.match(expStr) && applyKey.indexOf("\n" + key + "\n") == -1) {
					search = search.replace(expStr, "");
				}
	
				if (val != null && val != undefined) {
					search += param;
				}
				
				applyKey += (key + "\n");
			}
		}

		if (isSingleCase) {
			applyKey = "\n";
		}
		
		for (var key in searchData.params) {
			var val = searchData.params[key];
			
			if (key) {
				var param = "&" + key + "=" + encodeURIComponent(val);
		
				var expStr = new RegExp("[?&](" + key + ")=([^&^#]*)", isAlphabatCase ? "g" : "gi");
				
				if (search.match(expStr) && applyKey.indexOf("\n" + key + "\n") == -1) {
					search = search.replace(expStr, "");
				}
	
				if (val != null && val != undefined) {
					search += param;
				}
				
				applyKey += (key + "\n");
			}
		}
	}

	return (("?" + search).replace(/^[?][?&]+/, "?") + (searchData && searchData.isHash ? window.location.hash : "")).replace(/[?]$/, "");
}

function deleteParams() {
	var clsStr = "{\"params\" : {";

	for (var i = 0; i < arguments.length; ++i) {
		clsStr += (i > 0 ? ", " : "") + "\"" + arguments[i] + "\" : null";
	}
	
	clsStr += "}}";
	
	return getParams(getJSONData(clsStr));
}



function goPage(page, fieldName) {
	if (loadingProgress) {
		loadingProgress.open();
	}
	
	window.location.href = window.location.pathname + getParams(getJSONData("{\"params\" : {\"" + (fieldName ? fieldName : "page") + "\" : " + page + "}}"));
}

function changePageRowCount(rowCount, fieldName, pageFieldName) {
	if (loadingProgress) {
		loadingProgress.open();
	}
	
	window.location.href = window.location.pathname + getParams(getJSONData("{\"params\" : {\"" + (pageFieldName ? pageFieldName : "page") + "\" : 1, \"" + (fieldName ? fieldName : "rowCount") + "\" : " + rowCount + "}}"));
}

function goPageForm(formObj) {
	if (loadingProgress) {
		loadingProgress.open();
	}
	
	window.location.href = window.location.pathname + getParams({"form" : formObj});
}

function goList(url, seqName) {
	var clsStr = "{\"params\" : {";
	
	for (var i = 1; i < arguments.length; ++i) {
		clsStr += (i > 1 ? ", " : "") + "\"" + arguments[i] + "\" : null";
	}
	
	clsStr += "}}";
	
	if (loadingProgress) {
		loadingProgress.open();
	}
	
	
	window.location.href = url + getParams(getJSONData(clsStr));
}

function goAdd(url) {
	if (loadingProgress) {
		loadingProgress.open();
	}
		
	window.location.href = url + window.location.search;
}

function goDetail(url, seqName, seqValue) {
	if (loadingProgress) {
		loadingProgress.open();
	}
	
	window.location.href = url + getParams(seqName ? getJSONData("{\"params\" : {\"" + seqName + "\" : \"" + seqValue + "\"}}") : null);
}

function goDetailM(url, jsonData) {
	if (loadingProgress) {
		loadingProgress.open();
	}
	
	window.location.href = url + getParams(jsonData);
}

function goDelete(url, seqName, seqValue) {
	if (loadingProgress) {
		loadingProgress.open();
	}
	
	window.location.href = url + "?" + seqName + "=" + escape(seqValue) + "&searchLocation=" + escape(getParams(getJSONData("{\"params\" : {\"" + seqName + "\" : null}}")));
}



function getJSONData(parseData) {
	var jsonData = "";

	try {
		jsonData = JSON.parse(parseData);
	} catch(e) {
		eval("jsonData = " + parseData);
	}
	
	return jsonData;
}

//문서별 확장자
var ImageExt = new Array('jpg', 'png', 'gif', 'jpeg', 'bmp');
var MovieExt = new Array('mp4', 'mp3');
var DocExt = new Array('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp');
var OtherExt = new Array();
//첨부파일 확장자 확인
function fn_ExtType(FileName) {
	var AllType = new Array();
	AllType[0] = { fileType: "IMAGE", Ext: "\\.(" + ImageExt.join("|") + ")$" };
	AllType[1] = { fileType: "MOVIE", Ext: "\\.(" + MovieExt.join("|") + ")$" };
	AllType[2] = { fileType: "DOC", Ext: "\\.(" + DocExt.join("|") + ")$" };
	if (OtherExt.length > 0) {
		AllType[3] = { fileType: "OTHER", Ext: "\\.(" + OtherExt.join("|") + ")$" };
	}

	for (jj = 0; jj < AllType.length; jj++) {
		if ((new RegExp(AllType[jj].Ext, "i")).test(FileName)) return AllType[jj].fileType;
	}
	return "";
}

function fn_fileReset(obj){
	if ($.browser.msie) {
		// ie 일때 input[type=file] init.
		$(obj).replaceWith( $(obj).clone(true) );
	} else {
		// other browser 일때 input[type=file] init.
		$(obj).val("");
	}	
}


/**
 * td row 합치기
 */
function fn_datarow_backup(){
	$("[data-rowarea]").each(function(){
		var $area = $(this);
		var td = $(this).find("[data-rowdata]");
		$(this).find("tr").first().find("td,th").each(function(){
			var tdIndex = $(this).index();
			
			$(td).each(function(idx){
				if(tdIndex == $(this).index()){
					var org = $(this);
					var rowCnt = 1;
					var orgIdx = idx;
					var orgIndex = $(this).index();
					$(td).each(function(idx){
						var minusIndex = 0;
						//합치기 영역 확인(colspan 영역 확인)
						$(this).prevAll("td,th").each(function(){
							if($(this).attr("colspan") != undefined){
								minusIndex += (parseInt($(this).attr("colspan")) - 1);
							}
						});
						
						//같은 노드확인 후 합치기
						if(orgIdx < idx && (tdIndex - minusIndex) == $(this).index()){
							if(org.attr("data-rowdata") == $(this).attr("data-rowdata") && $(this).attr("data-rowdata") != "" && $(this).attr("data-rowdata") != undefined){
								$(this).attr("data-remove",true);
								rowCnt++;
							}
						}
					});
					$(this).attr("rowspan",rowCnt);
				}
			});
		});
		
	});
	$("[data-remove='true']").remove();
}

function fn_datarow(){
	$("[data-rowarea]").each(function(){
		var $area = $(this);
		var td = $(this).find("[data-rowdata]");
			
		$(td).each(function(idx){
			var org = $(this);
			var rowCnt = 1;
			if(!isNaN(parseInt($(this).attr("rowspan")))){
				rowCnt = parseInt($(this).attr("rowspan"));
			}
			var orgIdx = idx;
			var orgIndex = $(this).index();
			$(td).each(function(idx){
				
				//해당 오브젝트 이후의 것만 검사
				if(orgIdx < idx){
					if(org.attr("data-rowdata") == $(this).attr("data-rowdata") && $(this).attr("data-rowdata") != "" && $(this).attr("data-rowdata") != undefined){
						$(this).attr("data-remove",true);
						rowCnt++;
					}
				}
			});
			$(this).attr("rowspan",rowCnt);
		});
		
	});
	$("[data-remove='true']").remove();
}

function roundVal(value,e){
	return +(Math.round(value + ("e+"+e)) + ("e-"+e));
}


var loadingProgress = {
	status : false,
	open : function(){
		if (this.status) {
			return;
		}
		$("body").append("<div class='loadingProgress'><img src='/images/common/ico_loding.gif' alt='' /><img src='/images/common/ico_loding.gif' alt='' /><p>데이터를 조회 중 입니다.</p></div>");
		this.status = true;
	},
	close : function(){
		$(".loadingProgress").remove();
		this.status = false;
	}
}