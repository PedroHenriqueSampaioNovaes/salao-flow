import { LoginRequest } from '@sistema-barbearia/validators';

import { UserRepository } from '../../repositories/UserRepository.js';
import { HashRepository } from '../../repositories/HashRepository.js';
import { TokenRepository } from '../../repositories/TokenRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class LoginUserService {
  constructor(
    private userRepository: UserRepository,
    private hashRepository: HashRepository,
    private tokenRepository: TokenRepository,
  ) {}

  async execute(loginData: LoginRequest) {
    const user = await this.userRepository.findByEmail(loginData.email);

    if (!user) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const passwordMatch = await this.hashRepository.compare(
      loginData.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const token = this.tokenRepository.sign({ id: user.id }, '7d');

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    };
  }
}
