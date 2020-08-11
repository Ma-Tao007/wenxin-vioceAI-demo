import api from '@/api'
import { axios } from '@/utils/request'

export default api
const wxcpnfig = {
    getSDK:'/wxconfig/getSDK',
}

export function getSDK (parameter) {
  return axios({
    url: api.wx+wxcpnfig.getSDK,
    method: 'get',
    params: parameter
  })
}
