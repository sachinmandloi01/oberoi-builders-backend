import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  propertyName: string;

  @Prop({ required: true })
  propertyType: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  contactName: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop()
  propertyDescription: string;

  @Prop()
  numberOfRooms: number;

  @Prop()
  roomTypes: string;

  @Prop()
  capacity: number;

  @Prop()
  amenities: string[];

  @Prop()
  pricing: string;

  @Prop()
  propertyImages: string[];

  @Prop()
  videoFiles: string[];

  @Prop()
  youtubeLinks: string;

  @Prop()
  propertyOwnership: string;

  @Prop()
  licensesAndPermits: string;

  @Prop()
  targetAudience: string;

  @Prop()
  uniqueSellingPoints: string;

  @Prop()
  nearbyAttractions: string;

  @Prop()
  socialMediaHandles: string;

  @Prop()
  websiteLink: string;

  @Prop()
  emergencyContactInfo: string;

  @Prop()
  activities: string;

  @Prop()
  rules: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
