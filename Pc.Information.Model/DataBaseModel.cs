#region	Vesion Info
//======================================================================
//Copyright(C) FreshMan.All right reserved.
//命名空间：Pc.Information.Model
//文件名称：DataBaseModel
//创 建 人：FreshMan
//创建日期：2017/3/22 20:56:34
//用    途：记录类的用途
//======================================================================
#endregion
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pc.Information.Model
{
    /// <summary>
    /// Base data model
    /// </summary>
    public class DataBaseModel
    {
        /// <summary>
        /// State code
        /// </summary>
        public string StateCode { get; set; }

        /// <summary>
        /// Data state description
        /// </summary>
        public string StateDesc { get; set; }
    }
}
