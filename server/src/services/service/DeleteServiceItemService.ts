import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteServiceItemService {
  async execute(serviceId: string, barbershopId: number) {
    const serviceRepository = new ServiceRepository();

    const service = await serviceRepository.getById(serviceId);

    if (!service) {
      throw new AppError('Serviço não encontrado', 404);
    }

    if (service.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para deletar este serviço',
        403,
      );
    }

    await serviceRepository.delete(serviceId);
  }
}
