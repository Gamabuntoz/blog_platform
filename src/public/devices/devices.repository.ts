import { Injectable } from '@nestjs/common';
import { Devices } from './applications/devices.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(Devices)
    private readonly dbDevicesRepository: Repository<Devices>,
  ) {}

  async findAllUserDevices(currentUserId: string) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .where({ userId: currentUserId });
    return queryBuilder.getMany();
  }

  async findDeviceByDateAndUserId(issueAt: number, userId: string) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .where({ issueAt: issueAt, userId: userId });
    return queryBuilder.getOne();
  }

  async findDeviceByDeviceId(deviceId: string) {
    return this.dbDevicesRepository.findOne({
      where: { id: deviceId },
      relations: ['user'],
    });
  }

  async insertDeviceInfo(device: Devices) {
    await this.dbDevicesRepository.insert(device);
    return device;
  }

  async updateDeviceInfo(
    oldIssueAt: number,
    userId: string,
    newIssueAt: number,
  ) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .update()
      .set({ issueAt: newIssueAt })
      .where({ issueAt: oldIssueAt, userId: userId });
    return queryBuilder.execute();
  }

  async deleteAllDevicesExceptCurrent(issueAt: number, userId: string) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .delete()
      .where('issueAt != :issueAt AND userId = :userId', {
        issueAt,
        userId,
      });
    return queryBuilder.execute();
  }

  async deleteDevice(issueAt: number, userId: string) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .delete()
      .where({ issueAt: issueAt, userId: userId });
    return queryBuilder.execute();
  }

  async deleteDeviceById(deviceId: string) {
    return this.dbDevicesRepository.delete({ id: deviceId });
  }
}
