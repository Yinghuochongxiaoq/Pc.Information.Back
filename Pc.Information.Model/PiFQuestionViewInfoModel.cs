using System;

namespace Pc.Information.Model
{
    /// <summary>
    /// PiFQuestionViewInfo model
    /// </summary>
    public class PiFQuestionViewInfoModel
    {
        /// <summary>
        /// PreMary key
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// PiFQuestionId
        /// </summary>
        public int PiFQuestionId { get; set; }

        /// <summary>
        /// user id
        /// </summary>
        public int PiFUserId { get; set;}

        /// <summary>
        /// visit time
        /// </summary>
        public DateTime PiFVisitTime { get; set; }
    }
}
