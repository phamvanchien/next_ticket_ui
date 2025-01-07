const ProjectTableHead = () => {
  return (
    <thead>
      {/* <tr>
        <th scope="col" style={{width: '3%'}}></th>
        <th scope="col" style={{width: '40%'}}>Name</th>
        <th scope="col" style={{width: '15%'}}>Created by</th>
        <th scope="col" style={{width: '15%'}}>Members</th>
        <th scope="col" style={{width: '5%'}}>Public</th>
      </tr> */}
      <tr>
        <th scope="col"></th>
        <th scope="col"></th>
        <th scope="col" style={{minWidth: 200}}>Name</th>
        <th scope="col" style={{minWidth: 150}}>Created by</th>
        <th scope="col" style={{minWidth: 200}}>Members</th>
        <th scope="col" style={{minWidth: 150}}>Public</th>
      </tr>
    </thead>
  )
}
export default ProjectTableHead;