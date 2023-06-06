import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../comments.repository';
import { Result, ResultCode } from '../../../../helpers/contract';

export class DeleteCommentCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCases
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand): Promise<Result<boolean>> {
    const comment = await this.commentsRepository.findCommentById(command.id);
    if (!comment)
      return new Result<boolean>(
        ResultCode.NotFound,
        false,
        'Comment not found',
      );
    if (comment.userId !== command.userId)
      return new Result<boolean>(ResultCode.Forbidden, false, 'Access denied');
    await this.commentsRepository.deleteComment(command.id);
    return new Result<boolean>(ResultCode.Success, true, null);
  }
}
