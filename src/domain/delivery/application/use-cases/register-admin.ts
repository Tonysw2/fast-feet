import { Injectable } from '@nestjs/common'
import { HashGenerator } from 'src/core/cryptography/hash-generator'
import { Either, left, right } from 'src/core/either'
import { Admin } from '../../enterprise/entities/admin'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { AdminsRepository } from '../repositories/admins-repository'
import { AdminAlreadyExistsError } from './errors/admin-already-exists'

interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  { admin: Admin }
>

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private readonly hasher: HashGenerator,
    private readonly adminsRepo: AdminsRepository,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminExists = await this.adminsRepo.findByCPF(cpf)

    if (adminExists) {
      return left(new AdminAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hasher.hash(password)

    const admin = Admin.create({
      name,
      password: hashedPassword,
      cpf: CPF.create(cpf),
    })

    await this.adminsRepo.create(admin)

    return right({ admin })
  }
}
