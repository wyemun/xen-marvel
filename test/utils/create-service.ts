import ApiService from '../../src/services/api.service'

const createApiService = async () => {
  return new ApiService({port: 8080 })
}

export default createApiService