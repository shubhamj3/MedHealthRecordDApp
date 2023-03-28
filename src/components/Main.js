import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5 text-center" >
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1224px', minWidth: '1200px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <div className="card mb-3 mx-auto bg-transparent " style={{ maxWidth: '600px' }}>
                <h2 className="text-dark text-monospace bg-warning bg-transparent"><b>Upload Medical Records</b></h2>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const description = this.fileDescription.value
                    // const organizationName = this.fileOrganizationName.value
                    const fileToken = this.fileToken.value
                    this.props.uploadFile(description, fileToken)
                  }} >
                      <div className="form-group">
                        <br></br>
                          <input
                            id="fileDescription"
                            type="text"
                            ref={(input) => { this.fileDescription = input }}
                            className="form-control bg-transparent font-italic"
                            placeholder="Enter file description here"
                            required />
                        {/* <br></br>
                          <input
                            id="fileOrganizationName"
                            type="text"
                            ref={(input) => { this.fileOrganizationName = input }}
                            className="form-control text-monospace"
                            placeholder="organization name"
                            required /> */}
                        <br></br>
                          <input
                            id="fileToken"
                            type="password"
                            ref={(input) => { this.fileToken = input }}
                            className="form-control  bg-transparent font-italic "
                            placeholder="Enter password here"
                            required />                          
                      </div>
                    <input type="file" onChange={this.props.captureFile} className="text-dark text-monospace"/>
                    <p>&nbsp;</p>
                    <button type="submit" className="btn btn-outline-primary btn-block"><b>Click here to upload the file</b></button>
                  </form>
              </div>
              <p>&nbsp;</p>
              <div className="card mb-3 mx-auto">
              <table className="table-sm table-bordered text-monospace" style={{ width: '1.24', maxHeight: '450px'}}>
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className="bg-info text-white">
                    <th scope="col" style={{ width: '10px'}}>ID</th>
                    <th scope="col" style={{ width: '200px'}}>File name</th>
                    <th scope="col" style={{ width: '90px'}}>Upload Date</th>
                    <th scope="col" style={{ width: '120px'}}>IPFS Hash</th>
                    <th scope="col" style={{ width: '120px'}}>File description</th>
                    {/* <th scope="col" style={{ width: '120px'}}>Organization</th> */}
                    <th scope="col" style={{ width: '120px'}}>File password</th>
                    <th scope="col" style={{ width: '120px'}}>File preview</th>
                  </tr>
                </thead>
                { this.props.files.map((file, key) => {
                  return(
                    <thead style={{ 'fontSize': '12px' }} key={key}>
                      <tr>
                        <td>{file.fileId}</td>
                        <td>{file.fileName}</td>
                        <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                        <td>{file.fileHash}</td>
                        <td>{file.fileDescription}</td>
                        {/* <td>{file.fileOrganizationName}</td> */}
                        <td>{file.fileToken}</td>
                        <td><a target="_blank" rel="noopener noreferrer" href={"http://ipfs.infura.io/ipfs/"+file.fileHash}>link</a></td>
                      </tr>
                    </thead>
                  )
                })}
              </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;