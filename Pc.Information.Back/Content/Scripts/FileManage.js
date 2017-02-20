var hidRootUrl = $("#hidRootNode").val();
$(document).ready(function() {
    //文档类型框点击
    $("#fileClassType").click(function() {
        var ofset = $("#fileClassType").offset(),
            height = $("#fileClassType").height() - 31;
        $("#fileClassTypeList").css({ "top": (ofset.top + height) + "px", "left": ofset.left + "px" });

        var ul = $(".new");
        if (ul.css("display") == "none") {
            ul.slideDown();
        } else {
            ul.slideUp();
        }
    });
    //文件类型下拉框
    $("#fileClassTypeList li").click(function() {
        var li = $(this).text();
        $("#fileClassType").val(li);
        $(".new").hide();
        $("#fileClassType").removeClass("select");
    });

    $("#fileClassType").blur(function() {
        var ul = $(".new");
        ul.slideUp();
    });
    var ajaxUrl = hidRootUrl + "/FileManage/FileManage/UploadFileDeal/";
    var guidUrl = ajaxUrl;
    var progressUrl = ajaxUrl;
    var abortUrl = ajaxUrl;
    var target = "#guid";
    var guid = "";
    var cancel = false;
    var timer;
    setGuid(target, guidUrl);
    $("#upload_panel").draggable({ handle: "#upload_title" });
    $("#upload_choose span").hover(function() {
        $(this).css({
            "color": "#f6af3a",
            "border": "1px solid #e78f08"
        });
    }, function() {
        $(this).css({
            "color": "#1c94cd",
            "border": "1px solid #ddd"
        });
    });
    $("#upload_cancel").click(function() {
        $.ajax({
            url: abortUrl,
            data: { guid: guid, abort: true, action: "UploadFileCancel" },
            dataType: "xml",
            type: "post",
            success: function() {

                $("#upload_panel").fadeOut('fast');
                $("#back_panel").fadeOut(1000);
                window.clearInterval(timer);
            }
        });
    });
    $("#upload_submit").click(function() {
        $("#upload_panel").fadeOut('fast');
        $("#back_panel").fadeOut("1000");
    });
    $("form").submit(function() {
        guid = $(target).val();
        if ($("input[name='upload_file']").val() == "") {
            layer.msg('未指定上传文件！', { time: 3000, icon: 5 });
            return false;
        }
        if ($("#fileClassType").val() == "") {
            layer.msg('请填写文档类型！', { time: 3000, icon: 5 });
            $("#fileClassType").focus();
            return false;
        }
        $("#upload_progress").css("width", "0%");
        $("#finished_percent").html("准备上传...");
        $("#upload_speed").html("");
        $("#upload_fileName").html("");
        $("#upload_fileSize").html("");
        $("#upload_costTime").html("");
        var option = {
            url: progressUrl,
            data: { guid: guid, action: "GetFileUploadProcess" },
            dataType: "xml",
            type: "post",
            beforeSend: function() {
                $("#back_panel").fadeTo('fast', '0.5');
                $("#upload_panel").fadeIn('1000');
            },
            success: function(response) {

                if ($(response).find("root abort").text() == "true") {
                    $("#upload_panel").fadeOut('fast');
                    $("#back_panel").fadeOut(1000);
                    window.clearInterval(timer);
                } else if ($(response).find("root none").text() == "no file") {
                    window.clearInterval(timer);
                    $("#finished_percent").html("<span style='color:green;'>文件上传完成</span>");
                    $("#upload_file").val("");
                } else {
                    var percent = ($(response).find("root percent").text() * 100);
                    var speed = $(response).find("root speed").text();
                    var fileSize = $(response).find("root fileSize").text();
                    var uploadCostTime = $(response).find("root costTime").text();
                    if (parseInt(speed) < 1024) {
                        speed = toFix(speed) + "Kb";
                    } else {
                        speed = toFix(speed / 1024) + "Mb";
                    }

                    if (parseInt(fileSize) / 1024 < 1024) {
                        fileSize = toFix(fileSize / 1024) + "Kb";
                    } else if (parseInt(fileSize) / 1024 / 1024 < 1024) {
                        fileSize = toFix(fileSize / 1024 / 1024) + "Mb";
                    } else {
                        fileSize = toFix(fileSize / 1024 / 1024 / 1024) + "Gb";
                    }

                    if (uploadCostTime < 1000) {
                        uploadCostTime = uploadCostTime + "毫秒";
                    } else if (uploadCostTime / 1000 < 60) {
                        uploadCostTime = parseInt(uploadCostTime / 1000) + "秒" + uploadCostTime % 1000 + "毫秒";
                    } else {
                        uploadCostTime = parseInt(uploadCostTime / 1000 / 60) + "分" + parseInt((uploadCostTime % 60000) / 1000) + "秒" + uploadCostTime % 1000 + "毫秒";
                    }
                    $("#upload_progress").css("width", parseInt(percent) + "%");
                    $("#finished_percent").html("完成百分比：" + toFix(percent) + "%");
                    $("#upload_speed").html("上传速度：" + speed + "/sec");
                    $("#upload_fileName").html("文件名称：" + $(response).find("root fileName").text());
                    $("#upload_fileSize").html("文件大小：" + fileSize);
                    $("#upload_costTime").html("上传耗时：" + uploadCostTime);
                    if (percent >= 100) {
                        window.clearInterval(timer);
                        $("#finished_percent").html("<span style='color:green;'>文件上传完成</span>");
                        $("#upload_file").val("");
                    }
                    if (cancel) {
                        window.clearInterval(timer);
                    }
                }
            },
            error: function() {}
        };
        timer = window.setInterval(function() { $.ajax(option); }, 2000);
    });
});

//文件类型判断
function JudgeFileType(intput) {
    var ajaxUrl = hidRootUrl + "/FileManage/FileManage/UploadFileDeal/";
    var fileName = intput.value;
    var mime = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
    if (mime != ".doc" &&
        mime != ".docx" &&
        mime != ".xls" &&
        mime != ".xlsx" &&
        mime != ".pdf" &&
        mime != ".ppt" &&
        mime != ".pptx" &&
        mime != ".vsd" &&
        mime != ".xmind" &&
        mime != ".rar" &&
        mime != ".zip" &&
        mime != ".rars" &&
        mime != ".tar.gz") {
        layer.msg('请选择指定格式文件！', { time: 3000, icon: 5 });
        ClreaFileValue(intput);
        return false;
    }
    var data = {};
    data.action = "CheckFileInfo";
    data.fileName = fileName.substr(fileName.lastIndexOf("\\") + 1);
    if ($.trim(data.fileName) == "") {
        ClreaFileValue(intput);
        return false;
    }
    $.ajax({
        url: ajaxUrl,
        data: data,
        type: "Post",
        success: function(data) {
            if (data && data.ReCode != 0 && data.ReCode != 1) {
                layer.msg(data.ReMsg, { time: 3000, icon: 5 });
                ClreaFileValue(intput);
            } else if (data && data.ReCode == 0) {
                layer.msg('文件可用', { time: 3000, icon: 1 });
            } else if (data && data.ReCode == 1) {
                layer.confirm(data.ReMsg, {
                    btn: ['覆盖', '取消'] //按钮
                }, function() {
                    layer.msg('奇葩，你牛逼', { icon: 1 });
                }, function() {
                    ClreaFileValue(intput);
                });
            } else {
                layer.msg('文件检测失败，请重试！', { time: 3000, icon: 5 });
                ClreaFileValue(intput);
            }
        }
    });
}

//清空file的值
function ClreaFileValue(intput) {
    if (intput.outerHTML) {
        intput.outerHTML = intput.outerHTML;
    } else {
        intput.value = "";
    }
}

//获得GUID
function setGuid(target, url) {
    var data = {};
    data.action = "GetFileGuId";
    var option = {
        url: url,
        data: data,
        dataType: "xml",
        type: "post",
        success: function(response) {
            $(target).val($(response).find("root guid").text());
        }
    };
    $.ajax(option);
}

//鼠标事件
var _pos_global = { "top": 0, "left": 0 };

function drag(target, handle) {
    var getMousePostion = function(event) {
        event = event || window.event;
        var top = 0,
            left = 0;
        if (event.pageX && event.pageY) {
            left = event.pageX;
            top = event.pageY;
        } else if (event.clientX && event.clientY) {
            left = event.clientX + document.body.scrollLeft - document.body.clientLeft;
            top = event.clientY + document.body.scrollTop - document.body.clientY;
        } else {
            return;
        }
        return { x: left, y: top };
    };
    var offsetLeft = 0,
        offsetTop = 0;
    var doDrag = function() {
        $(handle).mousemove(function(event) {
            var pos = getMousePostion(event);
            $(target).css({
                "position": "absolute",
                "top": (parseInt(pos.y) - offsetTop) + "px",
                "left": (parseInt(pos.x) - offsetLeft) + "px"
            });
        });
    };
    var startDrag = function(event) {
        doDrag();
    };
    var stopDrag = function() {
        $(handle).unbind("mousemove", null);
    };
    $(handle).mousedown(function(event) {
        var targetDoc = document.getElementById(target.replace("#", ""));
        _pos_global = { "top": 0, "left": 0 };
        while (targetDoc.offsetParent) {
            _pos_global.top += targetDoc.offsetTop;
            _pos_global.left += targetDoc.offsetLeft;
            targetDoc = targetDoc.offsetParent;
        }
        _pos_global.top += targetDoc.offsetTop;
        _pos_global.left += targetDoc.offsetLeft;
        offsetLeft = getMousePostion(event).x - _pos_global.left;
        offsetTop = getMousePostion(event).y - _pos_global.top;
        startDrag();
    });
    $(handle).mouseup(function() {
        stopDrag();
    });

}

//移动
function toFix(target) {
    if (parseFloat(target) == target) {
        return Math.round(target * 100) / 100;
    } else {
        return target;
    }
}

//分享文件类型判定
function JudgeShareFileType(intput) {
    var ajaxUrl = hidRootUrl + "/FileManage/FileManage/UploadFileDeal/";
    var fileName = intput.value;
    var mime = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
    if (mime != ".rar" &&
        mime != ".zip" &&
        mime != ".iso" &&
        mime != ".rz" &&
        mime != ".tlz") {
        layer.msg('请选择指定格式文件！', { time: 3000, icon: 5 });
        ClreaFileValue(intput);
        return false;
    }
    var data = {};
    data.action = "CheckFileInfo";
    data.fileName = fileName.substr(fileName.lastIndexOf("\\") + 1);
    if ($.trim(data.fileName) == "") {
        ClreaFileValue(intput);
        return false;
    }
    $.ajax({
        url: ajaxUrl,
        data: data,
        type: "Post",
        success: function(data) {
            if (data && data.ReCode != 0 && data.ReCode != 1) {
                layer.msg(data.ReMsg, { time: 3000, icon: 5 });
                ClreaFileValue(intput);
            } else if (data && data.ReCode == 0) {
                layer.msg('文件可用', { time: 3000, icon: 1 });
            } else if (data && data.ReCode == 1) {
                layer.confirm(data.ReMsg, {
                    btn: ['覆盖', '取消'] //按钮
                }, function() {
                    layer.msg('奇葩，你牛逼', { icon: 1 });
                }, function() {
                    ClreaFileValue(intput);
                });
            } else {
                layer.msg('文件检测失败，请重试！', { time: 3000, icon: 5 });
                ClreaFileValue(intput);
            }
        }
    });
}

/**
 * 服务端工作
using Framework.Utility;
using System;
using System.IO;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using System.Xml.Linq;
using Newtonsoft.Json;
using Tc.Cruise.FrontEnd.Entity.Activity;
using Tc.Cruise.FrontEnd.Enum.Account;
using Tc.Cruise.FrontEnd.Enum.FileManage;
using Tc.Cruise.FrontEnd.Service.FileManage;
using Tc.Cruise.FrontEnd.Web.Controllers;

namespace Tc.Cruise.FrontEnd.Web.Areas.FileManage.Controllers
{
    /// <summary>
    /// 文件管理
    /// </summary>
    [Permission(EnumBusinessPermission.FileManage)]
    public class FileManageController : AdminControllerBase
    {
        #region [1、全局变量]

        /// <summary>
        /// 文件存储路径
        /// </summary>
        string _saveFilePath = EnumHelper.GetEnumDescription(FileManageEnum.FileRoutUrl) + DateTime.Now.Year + "/" + DateTime.Now.Month + "/";
        /// <summary>
        /// 流读取器
        /// </summary>
        private Stream _reader;
        /// <summary>
        /// 文件流读取器
        /// </summary>
        private FileStream _fStream;
        /// <summary>
        /// 缓冲器大小
        /// </summary>
        private const int Buffersize = 10000;
        #endregion

        #region [2、输出]

        /// <summary>
        /// 输出方法
        /// </summary>
        /// <param name="content"></param>
        private void ResponseAjaxContent(string content)
        {
            Response.Clear();
            Response.ContentType = "application/json;charset=utf-8";
            Response.Write(content);
            Response.End();
        }
        #endregion

        #region [3、文档集合列表]
        /// <summary>
        /// 文件管理集合页面
        /// </summary>
        /// <returns></returns>
        [Permission(EnumBusinessPermission.FileManageIndex)]
        public ActionResult FileManageIndex()
        {
            var fileServer = new FileManageService();
            var fileTypeEnum = FileType.None;
            var fileType = WebRequestHelper.GetStringFromParameters("fileType");
            var fileClassName = WebRequestHelper.GetStringFromParameters("className");
            if (!string.IsNullOrEmpty(fileType))
            {
                fileTypeEnum = fileServer.ChangeFileExtType(fileType);
            }
            var typeList = fileServer.GetAllTypeList();
            var classNameList = fileServer.GetAllFileClassName();
            var ifileList = fileServer.GetAllTypeFileList(fileType: fileTypeEnum, fileClassName: fileClassName);
            ViewBag.TypeList = typeList;
            ViewBag.ClassNameList = classNameList;
            ViewBag.PostFileType = fileType;
            ViewBag.PostClassName = fileClassName;
            return View(ifileList);
        }
        #endregion

        #region [4、excl文件预览]
        /// <summary>
        /// excel文件预览
        /// </summary>
        /// <author>FreshMan</author>
        /// <creattime>2015-11-19</creattime>
        /// <returns></returns>
        [Permission(EnumBusinessPermission.FileManageIndex)]
        public ActionResult ExcelFilePreView()
        {
            var filePath = WebRequestHelper.GetStringFromParameters("filePath");
            filePath = Server.MapPath(filePath);
            if (!string.IsNullOrEmpty(filePath) && System.IO.File.Exists(filePath))
            {
                var npoi = new NpoiHelper(filePath);
                string massege;
                var data = npoi.ExcelToDataTable(0, false, out massege);
                ViewBag.Data = data;
            }
            return PartialView();
        }
        #endregion

        #region [5、文件上传页面]
        /// <summary>
        /// 文件上传页面
        /// </summary>
        /// <returns></returns>
        [Permission(EnumBusinessPermission.FileUpload)]
        public ActionResult FileUpload()
        {
            var classNameList = new FileManageService().GetAllFileClassName();
            ViewBag.ClassNameList = classNameList;
            return View();
        }
        #endregion

        #region [6、文件上传处理]
        /// <summary>
        /// 文件上传处理
        /// </summary>
        /// <author>FreshMan</author>
        /// <creattime>2015-11-21</creattime>
        [Permission(EnumBusinessPermission.FileUpload)]
        public void UploadFileDeal()
        {
            //操作
            string action = WebRequestHelper.GetStringFromParameters("action");
            if (!string.IsNullOrEmpty(action))
            {
                switch (action)
                {
                    //获得文件的唯一GUID
                    case "GetFileGuId":
                        GetFileGuId(ControllerContext.HttpContext);
                        break;
                    //文件上传
                    case "UploadFile":
                        UploadFile();
                        break;
                    //获得文件上传进度
                    case "GetFileUploadProcess":
                        GetFileUploadProcess(ControllerContext.HttpContext);
                        break;
                    //取消上传文件
                    case "UploadFileCancel":
                        UploadFileCancel(ControllerContext.HttpContext);
                        break;
                    //检测文件类型和文件是否存在
                    case "CheckFileInfo":
                        CheckFileInfo();
                        break;

                }
            }
        }

        /// <summary>
        /// 获得上传文件的GUID
        /// </summary>
        /// <param name="context">当前请求实体</param>
        /// <creattime>2015-06-28</creattime>
        /// <author>FreshMan</author>
        private void GetFileGuId(HttpContextBase context)
        {
            context.Response.Charset = "utf-8";
            context.Response.ContentType = "application/xml";
            var guid = Guid.NewGuid().ToString();
            var doc = new XDocument();
            var root = new XElement("root");

            var xGuid = new XElement("guid", guid);
            root.Add(xGuid);
            doc.Add(root);
            context.Response.Write(doc.ToString());
            context.Response.End();
        }

        /// <summary>
        /// 文件上传
        /// </summary>
        [Permission(EnumBusinessPermission.FileUpload)]
        public void UploadFile()
        {
            //文件处理服务类
            var fileManageServer = new FileManageService();
            var userName = string.Empty;
            var jobNumber = string.Empty;
            if (CurrentModel != null)
            {
                userName = CurrentModel.TrueName;
                jobNumber = CurrentModel.LoginName;
            }
            #region 获得上传文件
            string guid = WebRequestHelper.GetStringFromParameters("guid");
            var fileClassName = WebRequestHelper.GetStringFromParameters("fileClassType");
            HttpPostedFileBase postedFile = Request.Files["upload_file"];
            if (postedFile == null || string.IsNullOrEmpty(postedFile.FileName))
            {
                return;
            }
            #endregion

            #region 文件格式检测
            var fileExtIndex = postedFile.FileName.LastIndexOf(".", StringComparison.Ordinal);
            if (fileExtIndex <= 0 || fileExtIndex >= (postedFile.FileName.Length - 1)) return;
            var fileExt = postedFile.FileName.Substring(fileExtIndex);
            if (!fileManageServer.JudgeFileType(fileExt)) return;
            #endregion

            #region 创建上传目录设置缓存对象
            bool abort = false;
            _saveFilePath = _saveFilePath + fileExt.Substring(1) + "/";
            string rootFileUrl = Server.MapPath(_saveFilePath);
            //按照后缀名新建目录
            string uploadFilePath = rootFileUrl;
            if (!Directory.Exists(uploadFilePath))
            {
                Directory.CreateDirectory(uploadFilePath);
            }
            string uploadFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + fileExt;
            DownloadingFileInfoModel info = new DownloadingFileInfoModel(uploadFileName, postedFile.ContentLength, postedFile.ContentType);
            object fileObj = ControllerContext.HttpContext.Cache[guid];
            if (fileObj != null)
            {
                ControllerContext.HttpContext.Cache.Remove(guid);
            }
            ControllerContext.HttpContext.Cache.Add(guid, info, null, DateTime.Now.AddDays(1), TimeSpan.Zero, CacheItemPriority.AboveNormal, null);
            #endregion

            #region 读取文件流并写入缓存
            DateTime begin = DateTime.Now.ToLocalTime();
            var absoluteFilePath = uploadFilePath + uploadFileName;
            _fStream = new FileStream(absoluteFilePath, FileMode.Create);
            _reader = postedFile.InputStream;
            byte[] buffer = new byte[Buffersize];
            int len = _reader.Read(buffer, 0, Buffersize);

            while (len > 0 && !abort)
            {
                _fStream.Write(buffer, 0, len);
                DateTime end = DateTime.Now.ToLocalTime();
                info.CostTime = (long)(end - begin).TotalMilliseconds;
                info.FileFinished += len;

                ControllerContext.HttpContext.Cache[guid] = info;
                abort = ((DownloadingFileInfoModel)ControllerContext.HttpContext.Cache[guid]).Abort;
                len = _reader.Read(buffer, 0, Buffersize);
            }

            _reader.Close();
            _fStream.Close();
            #endregion

            #region 是否取消上传文件
            if (abort)
            {
                if (System.IO.File.Exists(absoluteFilePath))
                {
                    System.IO.File.Delete(absoluteFilePath);
                }
                return;
            }
            #endregion

            //文件后续处理
            fileManageServer.DealFileInfo(uploadFilePath, _saveFilePath + uploadFileName, postedFile.FileName, uploadFileName, fileExt, fileClassName,userName,jobNumber);
        }

        /// <summary>
        /// 获得上传文件的进度
        /// </summary>
        /// <param name="context">当前请求实体</param>
        /// <creattime>2015-06-28</creattime>
        /// <author>FreshMan</author>
        private void GetFileUploadProcess(HttpContextBase context)
        {
            context.Response.ContentType = "application/xml";
            context.Response.Charset = "utf-8";
            var guid = context.Request.Form["guid"];
            var info = context.Cache[guid] as DownloadingFileInfoModel;
            var doc = new XDocument();
            var root = new XElement("root");
            if (info != null)
            {
                var fileName = new XElement("fileName", info.FileName);
                var fileFinished = new XElement("fileFinished", info.FileFinished);
                var fileSize = new XElement("fileSize", info.FileSize);
                var costTime = new XElement("costTime", info.CostTime);
                var fileState = new XElement("fileState", info.FileState);
                var speed = new XElement("speed", info.Speed);
                var percent = new XElement("percent", info.Percent);
                var abort = new XElement("abort", false);
                root.Add(fileName);
                root.Add(fileFinished);
                root.Add(fileSize);
                root.Add(costTime);
                root.Add(fileState);
                root.Add(speed);
                root.Add(percent);
                if (info.Abort)
                {
                    abort.Value = info.Abort.ToString();
                    context.Cache.Remove(guid);
                }
                if (info.FileState == "finished")
                {
                    context.Cache.Remove(guid);
                }
            }
            else
            {
                var none = new XElement("none", "no file");
                root.Add(none);
            }
            doc.Add(root);
            context.Response.Write(doc.ToString());
            context.Response.End();
        }

        /// <summary>
        /// 取消上传处理程序
        /// </summary>
        /// <param name="context">当前请求实体</param>
        /// <creattime>2015-06-28</creattime>
        /// <author>FreshMan</author>
        private void UploadFileCancel(HttpContextBase context)
        {
            context.Response.ContentType = "application/xml";
            context.Response.Charset = "utf-8";
            var guid = context.Request.Form["guid"];
            var abort = !string.IsNullOrEmpty(context.Request.Form["abort"]);
            var info = context.Cache[guid] as DownloadingFileInfoModel;
            if (info != null)
            {
                info.Abort = abort;
                context.Cache[guid] = info;
            }
            var doc = new XDocument();
            var root = new XElement("root");
            var flag = new XElement("flag", info == null ? "false" : "true");
            root.Add(flag);
            doc.Add(root);
            context.Response.Write(doc.ToString());
            context.Response.End();
        }

        /// <summary>
        /// 验证文件是否已经存在
        /// </summary>
        private void CheckFileInfo()
        {
            var fileName = WebRequestHelper.GetStringFromParameters("fileName");
            var responseModel = new FileManageService().CheckFileExisets(fileName);
            ResponseAjaxContent(JsonConvert.SerializeObject(responseModel));
        }
        #endregion

        #region [7、图片上传页面]
        /// <summary>
        /// 图片上传页面
        /// </summary>
        /// <returns></returns>
        [Permission(EnumBusinessPermission.FileUpload)]
        public ActionResult PicUpload()
        {
            return View();
        }

        public JsonResult PicFileUpload()
        {
            //var oFile = Request.Files["txt_file"];

            //var oStream = oFile.InputStream;

            //得到了文件的流对象，我们不管是用NPOI、GDI还是直接保存文件都不是问题了吧。。。。

            //后台TODO
            HttpRequest request = System.Web.HttpContext.Current.Request;

            int c = request.Files.Count;

            //接收上传的数据并保存到服务器
            for (int i = 0; i < c; i++)
            {
                HttpPostedFile file = request.Files[i];

                string fileName = WebRequestHelper.GetStringFromParameters("fileName");
                if (string.IsNullOrEmpty(fileName)) fileName = Path.GetFileName(file.FileName);

                string path = HttpContext.Server.MapPath(_saveFilePath + "/pic/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                file.SaveAs(path + fileName);
            }
            //此处返回的JSON字符串为手动拼接,未处理字符串转义等特殊情况,仅作演示
            string json = "\"time\":\"" + DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss") + "\"";
            Finish("{" + json + "}");




            return Json(new { }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 完成上传
        /// </summary>
        /// <param name="json">回调函数参数</param>
        private void Finish(string json)
        {
            HttpResponse response = System.Web.HttpContext.Current.Response;

            response.Write(json);
            response.End();
        }
        #endregion

        #region [8、文件下载]

        /// <summary>
        /// 文件下载异步
        /// </summary>
        /// <returns></returns>
        public void GetFilePathResult()
        {
            string filePath = WebRequestHelper.GetStringFromParameters("filePath");
            string fileName = WebRequestHelper.GetStringFromParameters("fileName");
            if (string.IsNullOrEmpty(filePath) || string.IsNullOrEmpty(fileName)) return;
            //filePath = Server.MapPath("/csearchlight/Uploadfile/2016/1/xmind/20160104172638.xmind");
            filePath = Server.MapPath(filePath);
            //文件存在与否判断
            if (!System.IO.File.Exists(filePath)) return;

            _fStream = new FileStream(filePath, FileMode.Open);
            byte[] buffer = new byte[_fStream.Length];
            _fStream.Read(buffer, 0, buffer.Length);
            _fStream.Close();
            Response.Charset = "UTF-8";
            Response.ContentEncoding = System.Text.Encoding.GetEncoding("UTF-8");
            Response.ContentType = "application/octet-stream";
            Response.AddHeader("Content-Disposition", "attachment; filename=" + Server.UrlEncode(fileName));
            Response.BinaryWrite(buffer);
            Response.Flush();
            Response.End();
        }
        #endregion
    }
    /// <summary>
    /// 文件下载实体
    /// </summary>
    public class DownloadingFileInfoModel
    {
        /// <summary>
        /// 构造方法
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="fileSize"></param>
        /// <param name="fileType"></param>
        public DownloadingFileInfoModel(string fileName, Int64 fileSize, string fileType)
        {
            _fileName = fileName;
            _fileSize = fileSize;
            _fileType = fileType;
            FileState = "开始上传";
        }

        private double _speed;

        /// <summary>
        /// 速度
        /// </summary>
        public double Speed
        {
            get
            {
                _speed = Math.Abs(_costTime) <= 0 ? 0 : _fileFinished / _costTime;
                return _speed;
            }
        }

        private readonly string _fileType;

        /// <summary>
        /// 文件类型
        /// </summary>
        public string FileType
        {
            get { return _fileType; }

        }

        private readonly string _fileName;

        /// <summary>
        /// 文件名称
        /// </summary>
        public string FileName
        {
            get { return _fileName; }

        }
        private readonly double _fileSize;

        /// <summary>
        /// 文件大小
        /// </summary>
        public double FileSize
        {
            get { return _fileSize; }

        }
        private double _fileFinished;

        /// <summary>
        /// 完成上传量
        /// </summary>
        public double FileFinished
        {
            get { return _fileFinished; }
            set { _fileFinished = value; }
        }
        private double _costTime;

        /// <summary>
        /// 耗时
        /// </summary>
        public double CostTime
        {
            get { return _costTime; }
            set { _costTime = value; }
        }
        private string _fileState;

        /// <summary>
        /// 文件状态
        /// </summary>
        public string FileState
        {
            get
            {
                if (Math.Abs(_fileFinished) < 0)
                {
                    _fileState = "preparing";
                }
                else if (_fileFinished > 0 && _fileFinished < _fileSize)
                {
                    _fileState = "uploading";
                }
                else
                {
                    _fileState = "finished";
                }
                return _fileState;

            }
            private set { _fileState = value; }
        }

        private double _percent;

        /// <summary>
        /// 进度
        /// </summary>
        public double Percent
        {
            get
            {
                _percent = _fileFinished / _fileSize;
                return _percent;
            }

        }

        /// <summary>
        /// 是否取消
        /// </summary>
        public bool Abort
        {
            get { return _abort; }
            set { _abort = value; }
        }
        private bool _abort;
    }
}
 */