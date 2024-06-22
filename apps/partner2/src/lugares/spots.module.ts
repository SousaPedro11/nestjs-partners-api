import { Module } from '@nestjs/common';
import { LugaresController } from './lugares.controller';
import { SpotsCoreModule } from '@app/core/spots/spots-core.module';

@Module({
  imports: [SpotsCoreModule],
  controllers: [LugaresController],
})
export class LugaresModule {}
