using System;

namespace Pc.Informastion.Model
{
    /// <summary>
    /// Praised info model.
    /// </summary>
    public class PiFReplyPraisedInfoModel
    {
        /// <summary>
        /// Construct function.
        /// </summary>
        public PiFReplyPraisedInfoModel()
        {
            PiFPraisedType = 1;
        }

        /// <summary>
        /// Primary key.
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// user id.
        /// </summary>
        public int PiFUerId { get; set; }
        /// <summary>
        /// Praised time.
        /// </summary>
        public DateTime PiFPraisedTime { get; set; }
        /// <summary>
        /// Praised for reply id
        /// </summary>
        public int PiFReplyId { get; set; }
        /// <summary>
        /// Praise type.1:good gay(default);0:bad.
        /// </summary>
        public int PiFPraisedType { get; set; }

    }
}
