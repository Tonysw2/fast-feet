import { UseCaseError } from 'src/core/errors/use-case'

export class CourierAlreadyExists extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`Courier ${identifier} already exists.`)
	}
}
