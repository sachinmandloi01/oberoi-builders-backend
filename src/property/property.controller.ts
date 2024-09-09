import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath =
            file.fieldname === 'propertyImages'
              ? './uploads/images'
              : './uploads/videos';
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const filename: string = uuidv4() + path.extname(file.originalname);
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>, // Expecting an array of files
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    const propertyImages = files
      .filter((file) => file.fieldname === 'propertyImages')
      .map((file) => file.filename);
    const videoFiles = files
      .filter((file) => file.fieldname === 'videoFiles')
      .map((file) => file.filename);

    return this.propertyService.create(
      createPropertyDto,
      propertyImages,
      videoFiles,
    );
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(+id);
  }
}
