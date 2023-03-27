var ClockAuction = artifacts.require("./ClockAuction.sol");
var ClockAuctionBase = artifacts.require("./ClockAuctionBase.sol");
var ERC721 = artifacts.require("./ERC721.sol");
var ERC721Metadata = artifacts.require("./ERC721Metadata.sol");
var GeneScience = artifacts.require("./GeneScience.sol");
var GeneScienceInterface = artifacts.require("./GeneScienceInterface.sol");
var KittyAccessControl = artifacts.require("./KittyAccessControl.sol");
var KittyAuction = artifacts.require("./KittyAuction.sol");
var KittyBase = artifacts.require("./KittyBase.sol");
var KittyBreeding = artifacts.require("./KittyBreeding.sol");
var KittyCore = artifacts.require("./KittyCore.sol");
var KittyMinting = artifacts.require("./KittyMinting.sol");
var KittyOwnership = artifacts.require("./KittyOwnership.sol");
var Migrations = artifacts.require("./Migrations.sol");
var Ownable = artifacts.require("./Ownable.sol");
var Pausable = artifacts.require("./Pausable.sol");
var SaleClockAuction = artifacts.require("./SaleClockAuction.sol");
var SiringClockAuction = artifacts.require("./SiringClockAuction.sol");



module.exports = function(deployer) {

    //deployer.deploy(ClockAuction);
    //deployer.deploy(ClockAuctionBase);
    deployer.deploy(ERC721Metadata);
    deployer.deploy(GeneScience);
    deployer.deploy(KittyAccessControl);
    deployer.deploy(KittyAuction);
    deployer.deploy(KittyBase);
    deployer.deploy(KittyBreeding);
    deployer.deploy(KittyCore);
    deployer.deploy(KittyMinting);
    deployer.deploy(KittyOwnership);
    deployer.deploy(Migrations);
    deployer.deploy(Ownable);
    deployer.deploy(Pausable);
    //deployer.deploy(SaleClockAuction);
    //deployer.deploy(SiringClockAuction);

   
}