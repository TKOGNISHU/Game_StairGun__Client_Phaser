import BaseService from './base.service'

class MatchService extends BaseService {
    constructor() {
        super('http://localhost:4000/api/matches')
    }
}

export default new MatchService()
