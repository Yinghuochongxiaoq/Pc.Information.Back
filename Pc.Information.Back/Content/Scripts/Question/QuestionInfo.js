var baseApiUrl = "";
function AddQuestionInfo() {
    var data = {};
    data.content = UE.getEditor('shareContent').getContent();
    data.title = $("#shareTheme").val();
    data.time = $("#shearTime").val();
    $.ajax({
        url: baseApiUrl + '/Question/AddQuestion',
        type: 'post',
        data: data,
        success: function (data) {
            if (!data || data.StateCode != "0000") {
                layer.msg(data.StateDesc, { time: 3000, icon: 5 });
                return;
            }
            layer.msg(data.StateDesc, { time: 3000, icon: 1 });
        },
        error: function (err) { }
    });
};