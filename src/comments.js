import React from "react";

const Comments = () =>{


    return (

        <div className="comments-section">
        <h3 className="comments-heading">Comments</h3>
        {comments
          .filter((comment) => comment.postId === post.id && !comment.parentId)
          .map((comment) => (
            <div className="comment" key={comment.id}>
              <p className="comment-text">{comment.text}
              <button className="reply-button" onClick={() => setReplyToCommentId(comment.id)}>Reply</button></p>
              {replyToCommentId === comment.id && (
                <form className="reply-form" onSubmit={(event) => handleNewReplySubmit(event, comment.id)}>
                  <input className="new-reply-input" type="text" placeholder="Répondre au commentaire" value={newReplyText} onChange={(event) => setNewReplyText(event.target.value)} />
                  <button className="reply-button" type="submit">Reply</button>
                </form>
              )}

              <ul className="reply-list">
                <h4 className="replies-heading">Replies</h4>
                {comments
                  .filter((reply) => reply.comment_parent_id === comment.id)
                  .map((reply) => (
                    <li className="reply" key={reply.id}>
                      <p className="reply-text">{reply.text}</p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>




























    )

}