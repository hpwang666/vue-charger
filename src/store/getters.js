const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  departTree: state => state.user.departTree,
  permission_routes: state => state.permission.routes,
  depart: state => state.user.depart,
  stationId: state=>state.station.stationId
}
export default getters
