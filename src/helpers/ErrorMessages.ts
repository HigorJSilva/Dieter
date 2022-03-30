export const requiredMessage = 'Campo obrigatório'
export const invalidEmailMessage = 'E-mail inválido'
export const isNumericMessage = 'Campo precisa ser um número'
export const invalidMessage = 'Valor informado inválido'
export const uniqueMessage = 'Já existe um registro com esse valor'
export const existsMessage = 'Valor não encontrado'
export const arrayMessage = 'Campo não é um array'
export const notFutureDateMessage = 'Data informada não é posterior a atual'
export const voteAfterEndDate = 'Votação encerrada'
export const invalidMongoId = 'Id informado é inválido'

export const errorListUsers = 'Erro ao listar usuários'
export const errorCreateUsers = 'Erro ao cadastrar usuário'
export const errorUpdateUsers = 'Erro ao alterar usuário'
export const errorRemoveUsers = 'Erro ao remover usuário'

export const errorListVotingGroup = 'Erro ao listar grupos'
export const errorCreateVotingGroup = 'Erro ao cadastrar grupo'
export const errorUpdateVotingGroup = 'Erro ao alterar grupo'
export const errorRemoveVotingGroup = 'Erro ao remover grupo'


export const errorListSurvey = 'Erro ao listar pesquisas'
export const errorCreateSurvey = 'Erro ao cadastrar pesquisa'
export const errorUpdateSurvey = 'Erro ao alterar pesquisa'
export const errorRemoveSurvey = 'Erro ao remover pesquisa'

export const errorLogin = 'Erro ao realizar login'
export const errorListPollResult = 'Erro ao listar resultados'


export const fieldSizeMessage = (min?: number | null, max?: number) => {
    if(min && max){
        return `Este campo precisa conter entre ${min} e ${max} caracteres`
    }
    if(min){
        return `Este campo precisa conter pelo menos ${min} caracteres`
    }
    if(max){
        return `Este campo pode conter até ${max} caracteres`
    }
}