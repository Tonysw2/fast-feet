import { Module } from '@nestjs/common'
import { Encrypter } from 'src/core/cryptography/encrypter'
import { HashComparer } from 'src/core/cryptography/hash-comparer'
import { HashGenerator } from 'src/core/cryptography/hash-generator'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt'

@Module({
  providers: [
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}
