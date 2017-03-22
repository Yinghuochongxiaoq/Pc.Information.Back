using System;
using System.Collections.Generic;

namespace Pc.Information.Model
{
    /// <summary>
    /// Question info model.
    /// </summary>
    public class PiFQuestionInfoModel
    {
        /// <summary>
        /// Question id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Question send user name
        /// </summary>
        public string PiFSendUserName { get; set; }
        /// <summary>
        /// Question title
        /// </summary>
        public string PiFQuestionTitle { get; set; }
        /// <summary>
        /// Question content
        /// </summary>
        public string PiFQuestionContent { get; set; }
        /// <summary>
        /// Create time
        /// </summary>
        public DateTime PiFCreateTime { get; set; }
        /// <summary>
        /// Creat question uer id
        /// </summary>
        public int PiFSendUserId { get; set; }

        /// <summary>
        /// View count
        /// </summary>
        public int? ViewCount { get; set;}
    }

    /// <summary>
    /// with reply info model list
    /// </summary>
    public class PiFQuestionInfoWithReplyModel : PiFQuestionInfoModel
    {
        /// <summary>
        /// Struct function
        /// </summary>
        public PiFQuestionInfoWithReplyModel() : base()
        {
            ReplyInfoList = new List<PiFQuestionReplyInfoModel>();
        }

        /// <summary>
        /// Question info list
        /// </summary>
        public List<PiFQuestionReplyInfoModel> ReplyInfoList { get; set; }

        /// <summary>
        /// All count reply number.
        /// </summary>
        public long CountNumber { get; set; }
    }

    /// <summary>
    /// Question view count
    /// </summary>
    public class PiFQuestionViewCountInfoModel
    {
        /// <summary>
        /// Question id
        /// </summary>
        public int PiFQuestionId { get; set; }

        /// <summary>
        /// View count
        /// </summary>
        public int ViewCount { get; set; }
    }
}
