using System.Web.Mvc;
using FreshMan.Common;
using Newtonsoft.Json;
using Pc.Information.Model;

namespace Pc.Information.Back.Controllers
{
    public class HomeController : AdminControllerBase
    {
        /// <summary>
        /// Home page.
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            var welGeekModel = new WelComeGeekModel();
            var geekStr = WebCommonHelper.HttpGetWebRequest("http://geek.csdn.net/service/news/get_news_list?size=20&type=HackCount");
            if (!string.IsNullOrEmpty(geekStr))
            {
                welGeekModel = JsonConvert.DeserializeObject<WelComeGeekModel>(geekStr);
            }
            ViewBag.Html = welGeekModel.html;
            return View();
        }
    }
}