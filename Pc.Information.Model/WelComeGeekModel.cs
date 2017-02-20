#region	Vesion Info
//======================================================================
//Copyright(C) FreshMan.All right reserved.
//命名空间：Pc.Information.Model
//文件名称：WelComeGeekModel
//创 建 人：FreshMan
//创建日期：2017/2/11 14:45:32
//用    途：记录类的用途
//======================================================================
#endregion

namespace Pc.Information.Model
{
    /// <summary>
    /// 极客异步实体
    /// </summary>
    public class WelComeGeekModel
    {
        /// <summary>
        /// 状态
        /// </summary>
        public int status { get; set; }

        public string error { get; set; }

        public string data { get; set; }

        public string from { get; set; }

        public string has_more { get; set; }

        /// <summary>
        /// 文章内容
        /// </summary>
        public string html { get; set; }
    }
}
