#region	Vesion Info
//======================================================================
//Copyright(C) FreshMan.All right reserved.
//命名空间：Pc.Information.Model
//文件名称：ApiResultModel
//创 建 人：FreshMan
//创建日期：2017/2/22 15:35:41
//用    途：记录类的用途
//======================================================================
#endregion

namespace Pc.Information.Model
{
    /// <summary>
    /// Response data model.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ApiResultModel<T>
    {
        /// <summary>
        /// Construct
        /// </summary>
        public ApiResultModel()
        {
            RepCode = "200";
            RepMessage = "请求成功";
        }

        /// <summary>
        /// response code 
        /// </summary>
        public string RepCode { get; set; }

        /// <summary>
        /// response message
        /// </summary>
        public string RepMessage { get; set; }

        /// <summary>
        /// response data.
        /// </summary>
        public T Data { get; set; }
    }
}
