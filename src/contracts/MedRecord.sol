pragma solidity ^0.5.0;

contract MedRecord {
  string public name = 'MedRecord';
  uint public fileCount = 0;
  uint256 public queryPrice = 1 ether;
  mapping(uint => File) public files;

  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    // string fileOrganizationName;
    string fileToken;
    uint uploadTime;
    address payable uploader;
  }

  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    // string fileOrganizationName,
    string fileToken,
    uint uploadTime,
    address payable uploader
  );

  event FileQueried(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    address payable uploader,
    address payable indexed querier
  );

  constructor() public {
  }

  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType,
                      string memory _fileName, string memory _fileDescription, string memory _fileToken) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);
    // Make sure file type exists
    require(bytes(_fileType).length > 0);
    // Make sure file description exists
    require(bytes(_fileDescription).length > 0);
    // Make sure file fileName exists
    require(bytes(_fileName).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));
    // Make sure file size is more than 0
    require(_fileSize>0);
    // Make sure the file token exists
    require(bytes(_fileToken).length > 0);

    // Increment file id
    fileCount ++;

    // Add File to the contract
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, _fileToken, now, msg.sender);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, _fileToken, now, msg.sender);
  }

  function getFile(uint _fileId, string memory _fileToken) public payable{
    require(msg.value >= queryPrice, "Invalid Payment");

    // Make sure the file exists
    require(_fileId > 0 && _fileId <= fileCount);

    File memory file = files[_fileId];

    // check the token
    require(keccak256(abi.encodePacked(file.fileToken)) == keccak256(abi.encodePacked(_fileToken)), "Incorrect token");


    emit FileQueried(file.fileId, file.fileHash, file.fileSize, file.fileType, file.fileName, file.fileDescription, file.uploadTime, file.uploader, msg.sender);

  }
}