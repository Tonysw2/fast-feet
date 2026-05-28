export class CPF {
	private readonly _value: string

	get value() {
		return this._value
	}

	get formatted() {
		return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
	}

	private constructor(value: string) {
		this._value = value
	}

	static create(cpf: string): CPF {
		const digits = cpf.replace(/\D/g, '')
		return new CPF(digits)
	}
}
