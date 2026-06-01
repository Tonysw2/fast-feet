import { Injectable } from '@nestjs/common'
import { Encrypter } from 'src/core/cryptography/encrypter'
import { HashComparer } from 'src/core/cryptography/hash-comparer'
import { Either, left, right } from 'src/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials'

interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<
  InvalidCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateCourierUseCase {
  constructor(
    private readonly couriersRepo: CouriersRepository,
    private readonly comparer: HashComparer,
    private readonly jwt: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepo.findByCPF(cpf)

    if (!courier) {
      return left(new InvalidCredentialsError())
    }

    const isValidPassword = await this.comparer.compare(
      password,
      courier.password,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.jwt.encrypt({
      sub: courier.id.toString(),
      role: courier.role,
    })

    return right({ accessToken })
  }
}
