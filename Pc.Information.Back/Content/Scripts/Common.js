//选择切换函数
function SetCheckWayID(fui, obj) {
    $(fui).val($(obj).val());
}

//在父级窗口打开
function OpenSelectParentWindow(url, icon, parenttitle, title) {
    if (url != undefined && url != "") {
        var oldUrl = $("body",parent.document).find("#indexIframe").attr("src");
        if (url != oldUrl) {
            $("body", parent.document).find("#indexIframe").attr("src", url);
            $("body", parent.document).find("#Nav_icon").attr("class", icon);
            $("body", parent.document).find("#Nav_pTitle").html(parenttitle);
            $("body", parent.document).find("#Nav_subTitle").html(title);
        }
    }
}

//开启加载层
function OpenLoadLayer() {
    $(".loading-container").show();
    $(".loading-progress").show();
}

//关闭加载层
function CloseLoadLayer() {
    $(".loading-progress").hide();
    $(".loading-container").hide();
}


