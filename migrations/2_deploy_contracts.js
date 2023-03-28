const MedRecord = artifacts.require("MedRecord");

module.exports = function(deployer) {
  deployer.deploy(MedRecord);
};
