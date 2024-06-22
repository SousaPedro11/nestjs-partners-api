import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpotsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async validateEventExists(eventId: string) {
    const event = await this.prismaService.event.findFirst({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }
  }

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    await this.validateEventExists(createSpotDto.eventId);

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.AVAILABLE,
      },
    });
  }

  async findAll(eventId: string) {
    await this.validateEventExists(eventId);

    return this.prismaService.spot.findMany({
      where: { eventId: eventId },
    });
  }

  async findOne(eventId: string, spotId: string) {
    await this.validateEventExists(eventId);

    return this.prismaService.spot
      .findUniqueOrThrow({
        where: { eventId: eventId, id: spotId },
      })
      .catch(() => {
        throw new NotFoundException('Spot not found');
      });
  }

  async update(
    spotId: string,
    updateSpotDto: UpdateSpotDto & { eventId: string },
  ) {
    await this.validateEventExists(updateSpotDto.eventId);

    return this.prismaService.spot.update({
      where: { eventId: updateSpotDto.eventId, id: spotId },
      data: updateSpotDto,
    });
  }

  async remove(eventId: string, spotId: string) {
    await this.validateEventExists(eventId);

    return this.prismaService.spot.delete({
      where: { eventId: eventId, id: spotId },
    });
  }
}
