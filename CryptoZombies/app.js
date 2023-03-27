var cryptoZombies;
var userAccount;

var showZombieButton, createzombieButton, levelupButton, homeView, appView, zombieInput;


function startApp() {
  //ZombieOwnership contratc address
  var cryptoZombiesAddress = "0xFf1e23854A37920Bc2a781c74A9057f40fE0Bf9b";

  cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);


  //the following code from Lesson 6, chapter 5 is obsolete
  //     var accountInterval = setInterval(function () {

  //      if (web3.eth.accounts[0] !== userAccount) {
  //userAccount = web3.eth.accounts[0];

  //     getZombiesByOwner(userAccount)
  //      .then(displayZombies);
  //  }
  // }, 100);

  cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
    .on("data", function (event) {
      let data = event.returnValues;
      getZombiesByOwner(userAccount).then(displayZombies);
    }).on("error", console.error);
}

function displayZombies(ids) {
  $("#zombies").empty();
  for (id of ids) {

    getZombieDetails(id)
      .then(function (zombie) {
        var hash = hashString(zombie.dna);
        var src = `./src/zombies/zombie${(hash)}.png`;
        $("#zombies").append(`<div class="zombie">
              <div class="d-flex mt-1">
              <img src=${src} class="zombie-photo" alt="logo" />
              <ul>
                <li>Name: ${zombie.name}</li>
                <li>DNA: ${zombie.dna}</li>
                <li>Level: ${zombie.level}</li>
                <li>Wins: ${zombie.winCount}</li>
                <li>Losses: ${zombie.lossCount}</li>
                <li>Ready Time: ${zombie.readyTime}</li>
              </ul>
              
              </div>
              
            </div>`);
      });
  }

}

function createRandomZombie(name) {


  $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");

  return cryptoZombies.methods.createRandomZombie(name)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Successfully created " + name + "!");

      getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {

      $("#txStatus").text(error);
    });
}

function feedOnKitty(zombieId, kittyId) {
  $("#txStatus").text("Eating a kitty. This may take a while...");
  return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
      getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });
}

function levelUp(zombieId) {
  $("#txStatus").text("Leveling up your zombie...");
  return cryptoZombies.methods.levelUp(zombieId)
    .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });
}

function getZombieDetails(id) {
  return cryptoZombies.methods.zombies(id).call()
}

function zombieToOwner(id) {
  return cryptoZombies.methods.zombieToOwner(id).call()
}

function getZombiesByOwner(owner) {
  return cryptoZombies.methods.getZombiesByOwner(owner).call()
}

window.addEventListener('load', () => {
  homeView = document.querySelector('.homeView');
  appView = document.querySelector('.appView');
  homeView.style.display = 'block';
  appView.style.display = 'none';
});

function onLoad() {
  appView.style.display = 'block';
  homeView.style.display = 'none';
  setTimeout(async () => {
    showZombieButton = document.querySelector('.showZombieButton');
    createzombieButton = document.querySelector('.createzombieButton');
    levelupButton = document.querySelector('.levelupButton');

    createzombieButton.addEventListener('click', () => {
      const myModal = document.getElementById('myModal');
      const zombieName = document.getElementById('zombieName');
      myModal.addEventListener('shown.bs.modal', () => {
        zombieName.focus();
      });
    });

    showZombieButton.addEventListener('click', () => {
      getZombiesByOwner(userAccount)
        .then(displayZombies);
    });

    levelupButton.addEventListener('click', () => {
      getZombiesByOwner(userAccount)
        .then(levelUp);
    });
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        const accounts = await ethereum.enable();
        // Acccounts now exposed
        userAccount = accounts[0];
        startApp()
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      userAccount = web3.eth.accounts[0];
      startApp()
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    ethereum.on('accountsChanged', (accounts) => {
      window.location.reload();
    });

    ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }, 3000);

}

function createZombie() {
  const zombieName = document.getElementById('zombieName');
  createRandomZombie(zombieName.value);
}

async function attackZombie() {
  var attackeeName = document.getElementById('attackeeName').value;
  //$("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");

  const userId = await getZombiesByOwner(userAccount).then(async (userId) => {
    return userId;
  });

  const attackeeId = await getZombiesByOwner(attackeeName).then(async (attackeeId) => {
    return attackeeId;
  });

  const attackObject = await cryptoZombies.methods.attack(userId, attackeeId);

  attackObject
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Successfully attacked " + attackeeName + "!");

      //getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });

}

async function kittyContract() {
  var kittyContractAddress = document.getElementById('kittyAddress').value;
  //$("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
  const kittyObject = await cryptoZombies.methods.setKittyContractAddress(kittyContractAddress);
  // kittyObject
  // .send({ from: userAccount })
  // .on("receipt", function (receipt) {
  //   $("#txStatus").text("Kitty Contract Set Successfully!!");
  // })
  // .on("error", function (error) {
  //   $("#txStatus").text(error);
  // });
  kittyObject
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      console.log("---", receipt);
      $("#txStatus").text("Kitty Contract Set Successfully!!");
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });
}

function attackZombieHelper() {
}

async function changeZombieName() {
  var newName = document.getElementById('zombieNewName').value;
  const zombieId = await getZombiesByOwner(userAccount).then(async (userId) => {
    return userId;
  });
  return cryptoZombies.methods.changeName(zombieId, newName)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      $("#txStatus").text("Zombie name changed successfully.");
    })
    .on("error", function (error) {
      $("#txStatus").text(error);
    });
}

function hashString(string) {
  //set variable hash as 0
  var hash = 0;
  // if the length of the string is 0, return 0
  if (string.length == 0) return hash;
  for (i = 0; i < string.length; i++) {
    ch = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
  }
  if(hash < 0) {
    hash = (-hash);
  }
  return (hash%5)+1;
}

//the following code from Lesson 6, chapter 2 is obsolete
//metamask no longer inject web3 since early 2021
//window.addEventListener('load', function () {

//    if (typeof web3 !== 'undefined') {
//     web3js = new Web3(web3.currentProvider);
//   } else {

//  }


//  startApp()

//  }) 