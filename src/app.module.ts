import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true, // Makes the config globally available
    // }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // This should match the path you're trying to access in the URL
    }),
    UserModule,
    AuthModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
