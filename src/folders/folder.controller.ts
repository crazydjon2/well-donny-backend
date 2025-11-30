import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { EditFolderDto } from './dto/edit-folder.dto';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('/create')
  createFolder(@UserId() userId: string, @Body() body: CreateFolderDto) {
    return this.folderService.createFolder(userId, body);
  }

  @Put('/edit')
  editFolder(@UserId() userId: string, @Body() body: EditFolderDto) {
    return this.folderService.editFolder(userId, body);
  }

  @Delete('/:id')
  deleteFolder(@Param('id') id: string) {
    return this.folderService.deleteFolder(id);
  }

  @Get('/:id')
  getFolder(@Param('id') id: string) {
    return this.folderService.getFolder(id);
  }

  @Get()
  getFolders(@UserId() userId: string) {
    return this.folderService.getFolders(userId);
  }
}
