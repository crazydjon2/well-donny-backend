import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('/create')
  createFolder(
    @UserId() userId: string,
    @Body() body: { name: string; categories: string[] },
  ) {
    return this.folderService.createFolder(userId, body);
  }

  @Get()
  getFolders(@UserId() userId: string) {
    return this.folderService.getFolders(userId);
  }
}
