import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  async create(
    createPropertyDto: any,
    propertyImages: string[],
    videoFiles: string[],
  ): Promise<Property> {
    createPropertyDto.propertyImages = propertyImages;
    createPropertyDto.videoFiles = videoFiles;
    createPropertyDto.amenities = JSON.parse(createPropertyDto.amenities);

    const createdProperty = new this.propertyModel(createPropertyDto);
    return createdProperty.save();
  }

  async findAll() {
    return this.propertyModel.find().exec();
  }

  async findOne(id: string) {
    const product = await this.propertyModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
