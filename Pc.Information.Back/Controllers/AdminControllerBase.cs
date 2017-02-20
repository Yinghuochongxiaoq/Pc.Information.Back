using System;
using System.Collections.Specialized;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using FreshMan.Common;
using Newtonsoft.Json;
using Pc.Information.Model;

namespace Pc.Information.Back.Controllers
{

    [AllowAnonymous]
    public abstract class AdminControllerBase : Controller
    {
        /// <summary>
        /// Cache或者Cookie的Key前缀
        /// </summary>
        protected virtual string KeyPrefix => "Context_";

        public virtual int UserExpiresHours { get; set; } = 10;

        /// <summary>
        /// 登录后用户信息
        /// </summary>
        protected virtual PiFUsersModel CurrentModel
        {
            get
            {
                var u = CookieHelper.GetCookie(KeyPrefix + "UserInfo");
                if (string.IsNullOrEmpty(u))
                {
                    return null;
                }
                var data = DesHelper.Decode(AESHelp.AESDecrypt(u), DesHelper.SECRET);
                if (string.IsNullOrEmpty(data))
                {
                    return null;
                }
                var model = JsonConvert.DeserializeObject<PiFUsersModel>(data);
                if (model != null)
                {
                    //return AccountService.GetUserInfo(model);
                    return new PiFUsersModel();
                }
                return null;
            }
        }

        /// <summary>
        /// 方法执行前，如果没有登录就调整到Passport登录页面，没有权限就抛出信息
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var noAuthorizeAttributes = filterContext.ActionDescriptor.GetCustomAttributes(typeof(AuthorizeIgnoreAttribute), false);
            if (noAuthorizeAttributes.Length > 0)
                return;
            base.OnActionExecuting(filterContext);

            if (CurrentModel == null)
            {
                filterContext.Result = RedirectToAction("Login", "Account");
            }
        }

        /// <summary>
        /// 如果是Ajax请求的话，清除浏览器缓存
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            if (filterContext.RequestContext.HttpContext.Request.IsAjaxRequest())
            {
                filterContext.HttpContext.Response.Cache.SetExpires(DateTime.UtcNow.AddDays(-1));
                filterContext.HttpContext.Response.Cache.SetValidUntilExpires(false);
                filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                filterContext.HttpContext.Response.Cache.SetNoStore();
            }

            base.OnResultExecuted(filterContext);
        }

        /// <summary>
        /// AOP拦截，在Action执行后
        /// </summary>
        /// <param name="filterContext">filter context</param>
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            if (!filterContext.RequestContext.HttpContext.Request.IsAjaxRequest() && !filterContext.IsChildAction)
                RenderViewData();
        }

        /// <summary>
        /// 初始化
        /// </summary>
        /// <param name="requestContext"></param>
        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);
            InitializeStaticResource();

        }

        /// <summary>
        /// 初始化
        /// </summary>
        private void InitializeStaticResource()
        {
            ViewBag.RootNode = ConfigHelp.GetConfigValueForNull("ReferenceKey.RootNode") ?? string.Empty;
        }

        /// <summary>
        /// 产生一些视图数据
        /// </summary>
        protected virtual void RenderViewData()
        {
        }

        /// <summary>
        /// 当前Http上下文信息，用于写Log或其他作用
        /// </summary>
        public WebExceptionContext WebExceptionContext
        {
            get
            {
                var exceptionContext = new WebExceptionContext
                {
                    RefUrl = (Request == null || Request.UrlReferrer == null) ? string.Empty : Request.UrlReferrer.AbsoluteUri,
                    IsAjaxRequest = (Request == null) ? false : Request.IsAjaxRequest(),
                    FormData = (Request == null) ? null : Request.Form,
                    QueryData = (Request == null) ? null : Request.QueryString,
                    RouteData = (Request == null || Request.RequestContext == null || Request.RequestContext.RouteData == null) ? null : Request.RequestContext.RouteData.Values
                };

                return exceptionContext;
            }
        }

        /// <summary>
        /// 发生异常写Log
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
            var e = filterContext.Exception;

            LogException(e, WebExceptionContext);
        }

        /// <summary>
        /// 日志
        /// </summary>
        /// <param name="exception"></param>
        /// <param name="exceptionContext"></param>
        protected virtual void LogException(Exception exception, WebExceptionContext exceptionContext = null)
        {
            //do nothing!
        }
    }

    public class WebExceptionContext
    {
        /// <summary>
        /// 
        /// </summary>
        public string RefUrl;

        /// <summary>
        /// 
        /// </summary>
        public bool IsAjaxRequest;

        /// <summary>
        /// 
        /// </summary>
        public NameValueCollection FormData;

        /// <summary>
        /// 
        /// </summary>
        public NameValueCollection QueryData;

        /// <summary>
        /// 
        /// </summary>
        public RouteValueDictionary RouteData;
    }
}