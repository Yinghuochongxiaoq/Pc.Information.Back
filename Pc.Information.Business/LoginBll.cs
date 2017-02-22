#region	Vesion Info
//======================================================================
//Copyright(C) FreshMan.All right reserved.
//命名空间：Pc.Information.Business
//文件名称：LoginBll
//创 建 人：FreshMan
//创建日期：2017/2/22 15:30:45
//用    途：记录类的用途
//======================================================================
#endregion

using System.Collections.Generic;
using Pc.Information.Model;

namespace Pc.Information.Business
{
    /// <summary>
    /// login business class
    /// </summary>
    public class LoginBll : BusinessBaseBll
    {
        /// <summary>
        /// User login
        /// </summary>
        /// <param name="userName">user name</param>
        /// <param name="password">password</param>
        /// <returns></returns>
        public PiFUsersModel Login(string userName, string password)
        {
            var paramsDic = new Dictionary<string, string> { { "userName", userName }, { "password", password } };
            var requestKey = "LoginApi";
            var resultModel = GetDataApiByKey<PiFUsersModel>(requestKey, paramsDic);
            return resultModel;
        }
    }
}
