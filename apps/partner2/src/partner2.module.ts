import { PrismaModule } from '@app/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventosModule } from './eventos/eventos.module';
import { LugaresModule } from './lugares/spots.module';
import { AuthModule } from '@app/core/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    PrismaModule,
    AuthModule,
    EventosModule,
    LugaresModule,
  ],
})
export class Partner2Module {}
