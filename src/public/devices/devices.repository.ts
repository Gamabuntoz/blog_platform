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
    return this.dbDevicesRepository.find({ where: { user: currentUserId } });
  }

  async findDeviceByDateAndUserId(issueAt: number, userId: string) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .where({ 'd.issueAt': issueAt, 'd.userId': userId });
    return queryBuilder.getOne();
  }

  async findDeviceByDeviceId(deviceId: string) {
    return this.dbDevicesRepository.findOne({ where: { id: deviceId } });
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
      .where({ 'd.issueAt': oldIssueAt, 'd.userId': userId });
    return queryBuilder.execute();
  }

  async deleteAllDevicesExceptCurrent(issueAt: number, userId: string) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .where('d.issueAt != :issueAt AND d.userId = :userId', {
        issueAt,
        userId,
      });
    return queryBuilder.delete();
  }

  async deleteDevice(issueAt: number, userId: string) {
    const queryBuilder = await this.dbDevicesRepository
      .createQueryBuilder('d')
      .where({ 'd.issueAt': issueAt, 'd.userId': userId });
    return queryBuilder.delete();
  }

  async deleteDeviceById(deviceId: string) {
    return this.dbDevicesRepository.delete({ id: deviceId });
  }
}
