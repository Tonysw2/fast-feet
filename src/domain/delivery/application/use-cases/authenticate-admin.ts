import { Injectable } from '@nestjs/common'
import { Encrypter } from 'src/core/cryptography/encrypter'
import { HashComparer } from 'src/core/cryptography/hash-comparer'
import { Either, left, right } from 'src/core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials'

interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private readonly adminsRepo: AdminsRepository,
    private readonly comparer: HashComparer,
    private readonly jwt: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepo.findByCPF(cpf)

    if (!admin) {
      return left(new InvalidCredentialsError())
    }

    const isValidPassword = await this.comparer.compare(
      password,
      admin.password,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.jwt.encrypt({
      sub: admin.id.toString(),
      role: admin.role,
    })

    return right({ accessToken })
  }
}
