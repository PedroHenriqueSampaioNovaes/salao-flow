import { CreateUserRequest } from '@/src/types/CreateUserRequest.js';

import { UserRepository } from '../../repositories/UserRepository.js';
import { HashRepository } from '../../repositories/HashRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class CreateUserService {
  constructor(
    private userRepository: UserRepository,
    private hashRepository: HashRepository,
  ) {}

  async execute(userData: CreateUserRequest) {
    const userAlreadyExists = await this.userRepository.findByEmail(
      userData.email,
    );

    if (userAlreadyExists) {
      throw new AppError('Este e-mail já está em uso, escolha outro.', 409);
    }

    const hashedPassword = await this.hashRepository.hash(userData.password);

    const user = {
      ...userData,
      password: hashedPassword,
    };

    await this.userRepository.create(user);

    return { message: 'Usuário cadastrado com sucesso!' };
  }
}
