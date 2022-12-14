class Conta {

    private _numero: string
    private _saldo: number
    constructor(numero: string, saldo: number) {
        this._numero = numero
        this._saldo = saldo
    }

    depositar(valor: number): void {
        if (valor > 0) {
            this._saldo += valor
        } else {
            console.log("Erro, insira um valor positivo para deposito..")
        }
    }

    sacar(valor: number): boolean {

        if (this._saldo >= valor && valor > 0) {
            this._saldo -= valor
        } else {
            return false
        }
        return true
    }

    get saldo(): number {
        return this._saldo
    }

    get numero(): string {
        return this._numero
    }


    transferir(conta: Conta, valor: number): boolean {
        if (this.sacar(valor)) {
            conta.depositar(valor)
        } else {
            return false
        }
        return true
    }

    informacoes_da_conta(): string {
        const retorno: string = `
----- Informações da conta -----
Número da conta: ${this._numero}
saldo atual: ${this._saldo.toFixed(3)}
`
        return retorno
    }
}

class Poupanca extends Conta {
    private _taxaJuros: number;
    constructor(numero: string, saldo: number, taxaJuros: number) {
        super(numero, saldo)
        this._taxaJuros = taxaJuros;
    }

    render_juros(): void {
        super.depositar(this.saldo + (this.saldo * this._taxaJuros / 100));
    }

    informacoes_da_conta(): string {
        let info = super.informacoes_da_conta();
        info += `Taxa de Juros: ${this.taxaJuros}%
Tipo da Conta: Conta Poupaça
`
        return info
    }

    get taxaJuros(): number {
        return this._taxaJuros;
    }

}

class ContaImposto extends Conta {
    private _taxaImposto: number;
    constructor(numero: string, saldo: number, taxaImposto: number) {
        super(numero, saldo)
        this._taxaImposto = taxaImposto;
    }

    sacar(valor: number): boolean {
        const valor_saque = valor + (valor * this.taxaImposto / 100);
        return super.sacar(valor_saque);
    }

    informacoes_da_conta(): string {
        let info = super.informacoes_da_conta();
        info += `Taxa de Imposto: ${this.taxaImposto}%
Tipo da Conta: Conta Imposto
`
        return info
    }

    get taxaImposto(): number {
        return this._taxaImposto;
    }

}


class Banco {
    private contas: Conta[] = []

    inserir(conta: Conta): void {
        if (!this.consultar_conta(conta.numero)) {
            this.contas.push(conta)
        } else {
            console.log("Erro, já existe uma conta com esse número cadastrada!!!")
        }
    }

    consultar_conta(numero: string): Conta {
        let conta!: Conta

        for (let i = 0; i < this.contas.length; i++) {
            if (this.contas[i].numero == numero) {
                conta = this.contas[i]
                break
            }
        }

        return conta
    }

    private consultar_index_conta(numero: string): number {
        let index: number = -1

        for (let i = 0; i < this.contas.length; i++) {
            if (this.contas[i].numero == numero) {
                index = i
                break
            }
        }

        return index
    }

    alterar_conta(conta: Conta): boolean {
        let index: number = this.consultar_index_conta(conta.numero)

        if (index != -1) {
            this.contas[index] = conta
            return true
        }

        return false
    }

    excluir_conta(conta: Conta): boolean {
        let index: number = this.consultar_index_conta(conta.numero)

        if (index != -1) {
            for (let i = index; i < this.contas.length - 1; i++) {
                this.contas[i] = this.contas[i + 1]
            }
            this.contas.pop()

            return true

        }

        return false
    }

    depositar(numero: string, quantia: number): boolean {
        let conta: Conta = this.consultar_conta(numero)

        if (conta) {
            if (quantia > 0) {
                conta.depositar(quantia)
                return true
            } else {
                console.log("Valor de deposito inválido!!")
            }
        }
        return false
    }

    sacar(numero: string, quantia: number): boolean {
        let conta: Conta = this.consultar_conta(numero)

        if (conta) {
            return conta.sacar(quantia)
        }
        return false
    }

    transferir(numero_conta_1: string, numero_conta_2: string, quantia: number): boolean {
        let conta_manda: Conta = this.consultar_conta(numero_conta_1)
        let conta_recebe: Conta = this.consultar_conta(numero_conta_2)

        if (conta_manda && conta_recebe) {
            return conta_manda.transferir(conta_recebe, quantia)
        }

        return false
    }

    renderJuros(numero: string): boolean {
        const conta: Conta = this.consultar_conta(numero)

        if (conta instanceof Poupanca) {
            conta.render_juros();
            return true
        }
        return false
    }

    qtd_contas(): number {
        return this.contas.length
    }

    Soma_saldo(): number {
        let valor: number = 0

        for (let conta of this.contas) {
            valor += conta.saldo
        }

        return valor
    }

    media_saldo(): number {
        let media: number = (this.Soma_saldo()) / (this.qtd_contas())

        return media
    }

}

export { Conta, Banco, Poupanca, ContaImposto }