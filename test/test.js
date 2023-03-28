const MedRecord = artifacts.require('./MedRecord.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('MedRecord', ([deployer, uploader]) => {
  let vault

  before(async () => {
    vault = await MedRecord.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await vault.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await vault.name()
      assert.equal(name, 'MedRecord')
    })
  })

  describe('file', async () => {
    let result, fileCount
    const fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileSize = '1'
    const fileType = 'TypeOfTheFile'
    const fileName = 'NameOfTheFile'
    const fileDescription = 'DescriptionOfTheFile'
    // const fileOrganizationName = 'NYIT'
    const fileToken = '123456789'

    before(async () => {
      result = await vault.uploadFile(fileHash, fileSize, fileType, fileName,
        fileDescription, fileOrganizationName, fileToken, { from: uploader })
      fileCount = await vault.fileCount()
    })

    //check event
    it('upload file', async () => {
      // SUCESS
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id is correct')
      assert.equal(event.fileHash, fileHash, 'Hash is correct')
      assert.equal(event.fileSize, fileSize, 'Size is correct')
      assert.equal(event.fileType, fileType, 'Type is correct')
      assert.equal(event.fileName, fileName, 'Name is correct')
      assert.equal(event.fileDescription, fileDescription, 'Description is correct')
      // assert.equal(event.fileOrganizationName, fileOrganizationName, 'Description is correct')
      assert.equal(event.fileToken, fileToken, 'Description is correct')
      assert.equal(event.uploader, uploader, 'Uploader is correct')

      // FAILURE: File must have hash
      await vault.uploadFile('', fileSize, fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have size
      await vault.uploadFile(fileHash, '', fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;
      
      // FAILURE: File must have type
      await vault.uploadFile(fileHash, fileSize, '', fileName, fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have name
      await vault.uploadFile(fileHash, fileSize, fileType, '', fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have description
      await vault.uploadFile(fileHash, fileSize, fileType, fileName, '', { from: uploader }).should.be.rejected;
    })

    //check from Struct
    it('lists file', async () => {
      const file = await vault.files(fileCount)
      assert.equal(file.fileId.toNumber(), fileCount.toNumber(), 'id is correct')
      assert.equal(file.fileHash, fileHash, 'Hash is correct')
      assert.equal(file.fileSize, fileSize, 'Size is correct')
      assert.equal(file.fileName, fileName, 'Size is correct')
      assert.equal(file.fileDescription, fileDescription, 'description is correct')
      assert.equal(file.uploader, uploader, 'uploader is correct')
    })
  })
})