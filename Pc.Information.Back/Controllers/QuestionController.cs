using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pc.Information.Business;
using Pc.Information.Model;

namespace Pc.Information.Back.Controllers
{
    /// <summary>
    /// Question
    /// </summary>
    public class QuestionController : AdminControllerBase
    {
        /// <summary>
        /// AddNewQuestion
        /// </summary>
        /// <returns></returns>
        [AuthorizeIgnore]
        public ActionResult AddNewQuestion()
        {
            return View();
        }

        /// <summary>
        /// Add new question info
        /// </summary>
        /// <returns></returns>
        [AuthorizeIgnore]
        public ActionResult AddQuestion(string title, string content)
        {
            var baseModel = new DataBaseModel();
            var currentModel = CurrentModel;
            if (currentModel == null || currentModel.Id < 1)
            {
                baseModel.StateCode = "0001";
                baseModel.StateDesc = "请先登陆";
            }
            else
            if (title == null)
            {
                baseModel.StateCode = "0001";
                baseModel.StateDesc = "标题为空";
            }
            else if (content == null)
            {
                baseModel.StateCode = "0001";
                baseModel.StateDesc = "内容为空";
            }
            if (baseModel.StateCode == "") return Json(baseModel, JsonRequestBehavior.AllowGet);
            Debug.Assert(currentModel != null, "currentModel != null");
            PiFQuestionInfoModel newQuestionInfo = new PiFQuestionInfoModel()
            {
                PiFQuestionTitle = title,
                PiFQuestionContent = content,
                PiFSendUserId = currentModel.Id,
                PiFSendUserName = currentModel.PiFUserName
            };
            var resulte = new QuestionBll().AddQuestion(newQuestionInfo);
            return Json(resulte, JsonRequestBehavior.DenyGet);
        }
    }
}