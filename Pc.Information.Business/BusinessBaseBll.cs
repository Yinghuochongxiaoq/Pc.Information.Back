#region	Vesion Info
//======================================================================
//Copyright(C) FreshMan.All right reserved.
//命名空间：Pc.Information.Business
//文件名称：BusinessBaseBll
//创 建 人：FreshMan
//创建日期：2017/2/22 15:38:54
//用    途：记录类的用途
//======================================================================
#endregion

using System;
using System.Collections.Generic;
using System.Text;
using FreshMan.Common;
using Newtonsoft.Json;
using Pc.Information.Model;

namespace Pc.Information.Business
{
    /// <summary>
    /// base business bll class
    /// </summary>
    public class BusinessBaseBll
    {
        /// <summary>
        /// Get api data
        /// </summary>
        /// <typeparam name="T">data type</typeparam>
        /// <param name="requestUrl">request url</param>
        /// <param name="paramsDic">params dictionary</param>
        /// <param name="isPost">is post way get data</param>
        /// <returns>Api data,if error return default T</returns>
        public T GetDataApi<T>(string requestUrl, IDictionary<string, object> paramsDic = null, bool isPost = false)
        {
            try
            {
                var resultStr = isPost
                    ? WebCommonHelper.CreatePostHttpResponse(requestUrl, paramsDic, 16000, null, Encoding.UTF8)
                    : WebCommonHelper.HttpGetWebRequest(requestUrl);
                if (string.IsNullOrEmpty(resultStr)) return default(T);
                var resultModel = JsonConvert.DeserializeObject<ApiResultModel<T>>(resultStr);
                if (resultModel == null) return default(T);
                return resultModel.Data;
            }
            catch (Exception)
            {
                return default(T);
            }
        }

        /// <summary>
        /// Get api data
        /// </summary>
        /// <typeparam name="T">data type</typeparam>
        /// <param name="key">request url config key</param>
        /// <param name="paramsDic">params dictionary</param>
        /// <param name="isPost">is post way get data.</param>
        /// <returns>Api data,if error return default T</returns>
        public T GetDataApiByKey<T>(string key, IDictionary<string, object> paramsDic = null, bool isPost = false)
        {
            string requestUrl = GetRequestUrlByKey(key);
            if (string.IsNullOrEmpty(requestUrl)) return default(T);
            return GetDataApi<T>(requestUrl, paramsDic, isPost);
        }

        /// <summary>
        /// base request api url
        /// </summary>
        private static readonly string BaseRequestUrl = ConfigHelp.GetConfigValue("WebApiLink");

        /// <summary>
        /// api request dictionary url
        /// </summary>
        private readonly IDictionary<string, string> _apiRequstionUrlDictionary = new Dictionary<string, string>
        {
            { "LoginApi", BaseRequestUrl+ "/LoginUser/Login" },
            {"AddQuestionInfo",BaseRequestUrl+"/Question/AddQuestionInfo" }
        };

        /// <summary>
        /// get request url by key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string GetRequestUrlByKey(string key)
        {
            if (_apiRequstionUrlDictionary.Count < 1) return string.Empty;
            if (_apiRequstionUrlDictionary.ContainsKey(key)) return _apiRequstionUrlDictionary[key];
            return string.Empty;
        }

    }
}
