using System.Web.Mvc;
using FreshMan.Common;
using Newtonsoft.Json;
using Pc.Information.Business;

namespace Pc.Information.Back.Controllers
{
    [Authorize]
    public class AccountController : AdminControllerBase
    {
        /// <summary>
        /// GET: /Account/Login
        /// </summary>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [AuthorizeIgnore]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        /// <summary>
        /// login post
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [HttpPost]
        [AuthorizeIgnore]
        public ActionResult Login(string username, string password)
        {
            var loginInfo = new LoginBll().Login(username, password);

            if (loginInfo != null && loginInfo.Id > 0)
            {
                string data = JsonConvert.SerializeObject(loginInfo);
                CookieHelper.SetCookie("Context_UserInfo", AESHelp.AESEncrypt(DesHelper.Encode(data, DesHelper.SECRET)));
                return Redirect(ViewBag.RootNode + "/Home/Index");
            }
            ModelState.AddModelError("error", "用户名或密码错误");
            return View();
        }

        /// <summary>
        /// logout
        /// </summary>
        /// <returns></returns>
        [AuthorizeIgnore]
        public ActionResult Logout()
        {
            CookieHelper.DeleteCookies("Context_UserInfo");
            return RedirectToAction("Login");
        }
    }
}