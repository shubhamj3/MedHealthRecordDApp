import MedRecord from '../abis/MedRecord.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Search from './Search'
import Web3 from 'web3';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = MedRecord.networks[networkId]
    if(networkData) {
      // Assign contract
      const vault = new web3.eth.Contract(MedRecord.abi, networkData.address)
      this.setState({ medrecord: vault })
      // Get files amount
      const filesCount = await vault.methods.fileCount().call()
      this.setState({ filesCount })
      // Load files&sort by the newest
      for (var i = filesCount; i >= 1; i--) {
        const file = await vault.methods.files(i).call()
        if (file.uploader !== accounts[0]) {
          continue
        }
        this.setState({
          files: [...this.state.files, file]
        })
      }
    } else {
      window.alert('MedRecord contract not deployed to detected network.')
    }
  }

  // Get file from user
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadFile = (description, token) => {
    console.log("Submitting file to IPFS...")

    // Add file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result.size)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      // Assign value for the file without extension
      if(this.state.type === ''){
        this.setState({type: 'none'})
      }
      this.state.medrecord.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description, token).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        this.setState({loading: false})
      })
    })
  }


  queryFile = (id, token) => {
    this.setState({ queryLoading: true })
    this.state.medrecord.methods.getFile(id, token).send({ from: this.state.account,value: "1000000000000000000" }).on('transactionHash', (hash) => {
      
      this.state.medrecord.getPastEvents('FileQueried', {filter: {querier: this.state.account}}).then((result) => {
        console.log(result)
        this.setState({
          queryLoading: false,
          queriedFile: result
        })
      })


      // window.location.reload()
    }).on('error', (e) =>{
      window.alert('Error')
      this.setState({queryLoading: false})
    })

  
  }

  switchUI = () => {
    console.log(this.state.ui)
    this.setState({
      ui: this.state.ui === "Query" ? "Back to upload":"Query"
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ui: "Query",
      medrecord: null,
      files: [],
      queriedFile: [],
      loading: false,
      queryLoading: false,
      type: null,
      name: null
    }
    this.uploadFile = this.uploadFile.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.queryFile = this.queryFile.bind(this)
    this.switchUI = this.switchUI.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} ui={this.state.ui} switchUI={this.switchUI}/>
        { this.state.ui === "Query" ?
          this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
          :
          <div></div>
        }
        { 
        this.state.ui === "Back to upload" ?
        this.state.queryLoading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Search
              queryFile={this.queryFile}
              queriedFile={this.state.queriedFile}
            />
        :
        <div></div>
        }
      </div>
    );
  }
}

export default App;
