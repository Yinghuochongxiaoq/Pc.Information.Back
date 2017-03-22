#region	Vesion Info
//======================================================================
//Copyright(C) FreshMan.All right reserved.
//命名空间：Pc.Information.Business
//文件名称：QuestionBll
//创 建 人：FreshMan
//创建日期：2017/3/22 20:52:11
//用    途：记录类的用途
//======================================================================
#endregion
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FreshMan.Common;
using Pc.Information.Model;

namespace Pc.Information.Business
{
    /// <summary>
    /// Question info bll
    /// </summary>
    public class QuestionBll : BusinessBaseBll
    {
        /// <summary>
        /// Add question info.
        /// </summary>
        /// <returns></returns>
        public DataBaseModel AddQuestion(PiFQuestionInfoModel newQuestionInfo)
        {
            var paramsDic = EntityConvertHelper.EntityToDictionary(newQuestionInfo);
            var requestKey = "AddQuestionInfo";
            var resultModel = GetDataApiByKey<DataBaseModel>(requestKey, paramsDic, true);
            return resultModel;
        }
    }
}
