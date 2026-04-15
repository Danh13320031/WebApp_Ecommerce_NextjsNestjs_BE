import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  LIMIT_REQUEST_APP,
  TTL_THROTTLE_REQUEST_APP,
} from './common/constants/app.constant';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([
      {
        ttl: TTL_THROTTLE_REQUEST_APP, // Số giây để reset lại số lần yêu cầu
        limit: LIMIT_REQUEST_APP, // Số lần yêu cầu tối đa trong khoảng thời gian ttl
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
