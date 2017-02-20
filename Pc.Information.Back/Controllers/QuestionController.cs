using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
    }
}