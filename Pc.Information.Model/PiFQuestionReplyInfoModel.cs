using System;

namespace Pc.Information.Model
{
    /// <summary>
    /// Question reply model.
    /// </summary>
    public class PiFQuestionReplyInfoModel
    {
        /// <summary>
        /// Struct function
        /// </summary>
        public PiFQuestionReplyInfoModel()
        {
            PiFReplyIsBest = -1;
        }
        /// <summary>
        /// Reply id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Reply for question id.
        /// </summary>
        public int PiFQuestionId { get; set; }
        /// <summary>
        /// Reply content info.
        /// </summary>
        public string PiFReplyContent { get; set; }
        /// <summary>
        /// Is best reply.1:yes;0:no(default value is -1)
        /// </summary>
        public int PiFReplyIsBest { get; set; }
        /// <summary>
        /// Reply time.
        /// </summary>
        public DateTime PiFReplyTime { get; set; }
        /// <summary>
        /// Reply user id.
        /// </summary>
        public int PiFReplyUserId { get; set; }

        /// <summary>
        /// Reply user name
        /// </summary>
        public string PiFuserName { get; set; }

        /// <summary>
        /// Hase praised.
        /// </summary>
        public int HasePraise { get; set; }

        /// <summary>
        /// Praise number.
        /// </summary>
        public int PraisedNumber { get; set; }
    }
}
