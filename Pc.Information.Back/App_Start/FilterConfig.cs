using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Pc.Information.Back
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            //不需要輸入驗證
            filters.Add(new ValidateInputAttribute(false));
        }
    }
}
