import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { KnowledgeBaseService } from './knowledge-base.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';
import { KnowledgeBaseResponseDto } from './dto/knowledge-base-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateKnowledgeBaseMultipartDto } from './dto/create-knowledge-base-multipart.dto';
import { UpdateKnowledgeBaseMultipartDto } from './dto/update-knowledge-base-multipart.dto';


@ApiTags('Knowledge Base')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(
    private readonly knowledgeBaseService: KnowledgeBaseService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new knowledge base' })
  @ApiResponse({ 
    status: 201, 
    description: 'Knowledge base created successfully',
    type: KnowledgeBaseResponseDto 
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createKnowledgeBaseDto: CreateKnowledgeBaseMultipartDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
  
    return this.knowledgeBaseService.create(createKnowledgeBaseDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all knowledge bases' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all knowledge bases',
    type: [KnowledgeBaseResponseDto] 
  })
  findAll() {
    return this.knowledgeBaseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get knowledge base by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'Knowledge base found',
    type: KnowledgeBaseResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Knowledge base not found' })
  findOne(@Param('id') id: string) {
    return this.knowledgeBaseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update knowledge base' })
  @ApiResponse({ 
    status: 200, 
    description: 'Knowledge base updated successfully',
    type: KnowledgeBaseResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Knowledge base not found' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string, 
    @Body() updateKnowledgeBaseDto: UpdateKnowledgeBaseMultipartDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.knowledgeBaseService.update(id, updateKnowledgeBaseDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete knowledge base' })
  @ApiResponse({ status: 200, description: 'Knowledge base deleted successfully' })
  @ApiResponse({ status: 404, description: 'Knowledge base not found' })
  remove(@Param('id') id: string) {
    return this.knowledgeBaseService.remove(id);
  }


}