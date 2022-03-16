"use strict";

let ip = [];
let cidrMask = 0;
const slider = document.querySelector(".slider");
const newIPbtn = document.querySelector(".new-ip-btn");
let mask_1 = document.querySelector(".mask-1");
let mask_2 = document.querySelector(".mask-2");
let mask_3 = document.querySelector(".mask-3");
let mask_4 = document.querySelector(".mask-4");

const octet_1 = document.querySelector(".octet-1");
const octet_2 = document.querySelector(".octet-2");
const octet_3 = document.querySelector(".octet-3");
const octet_4 = document.querySelector(".octet-4");
const octet_6 = document.querySelector(".octet-6"); // this is the mask

const totalSubnets = document.querySelector(".total-subnets");
const IPs = document.querySelector(".total-ip");
const ipClass = document.querySelector(".ip-class");
const subnetID = document.querySelector(".subnet-id");
const ipRange = document.querySelector(".ip-range");

let bits = [];
for (let i = 0; i < 32; i++) {
  bits.push(document.querySelector(`.bit-${i + 1}`));
}
// console.log(bits);
// function to generate random number
const rndGenerator = function (max) {
  return Math.trunc(Math.random() * max);
};
// function to generate a random IP address with a CIDR subnet mask
const ipGenerator = function () {
  let ip = [0, 0, 0, 0, 0];
  ip[0] = rndGenerator(33); //create mask (0 - 32 bit)
  cidrMask = ip[0]; // store mask here for slider manipulation
  ip[1] = rndGenerator(223) + 1; // IP first octet (1 - 223)
  for (let i = 2; i < ip.length; i++) {
    ip[i] = rndGenerator(256); // ip other octets (0 - 255)
  }
  return ip;
};
// create an IP address and classful mask
const classfulIpGenerator = function () {
  let ip = [0, 0, 0, 0, 0];

  ip[1] = rndGenerator(223) + 1; // IP first octet (1 - 223)
  // console.log(ip[1]);
  //check ip class and set classful mask
  if (ip[1] < 128) {
    ip[0] = 8;
  } else if (ip[1] < 192) {
    ip[0] = 16;
  } else {
    ip[0] = 24;
  }
  // ip[0] = rndGenerator(33); //create mask (0 - 32 bit)
  for (let i = 2; i < ip.length; i++) {
    ip[i] = rndGenerator(256); // ip other octets (0 - 255)
  }
  // console.log(ip);
  return ip;
};

const toggleBits = function (classBits, numberOfBits) {
  // console.log(numberOfBits);

  let clas = classBits; // hold original mask
  // reset all bits
  for (let i = 0; i < bits.length; i++) {
    bits[i].textContent = "0";
    bits[i].classList.remove("bit-on");
    bits[i].classList.remove("subnetBits-on");
  }
  for (let i = 0; i < numberOfBits; i++) {
    bits[i].textContent = "1";
    bits[i].classList.add("bit-on");
  }
  for (let i = clas; i < numberOfBits; i++) {
    bits[i].textContent = "1";
    bits[i].classList.add("subnetBits-on");
  }
};

// function to convert a cidr bit notation to a 32 binary string
const cidrToBin = function (cidr) {
  if (cidr < 0 || cidr > 32) {
    return -1;
  }
  // console.log("in cidrToBin:", cidr);
  // convert cidrMask to binary
  const maxBits = 32;
  let binMask = "";
  for (let i = 0; i < maxBits; i++) {
    if (i < cidr) {
      binMask += "1";
    } else {
      binMask += "0";
    }
  }
  return binMask;
};

// convert ipArr to binary/ I assume that ipArr[0] is the cidr mask
const ipToBin = function (ipArr) {
  let ip = ""; //holds the binary ip
  if (ipArr.length === 5) {
    ipArr = ipArr.slice(1); // remove position [0] from ipArr
  }
  for (let i = 0; i < ipArr.length; i++) {
    let temp = ipArr[i].toString(2);
    // add leading zeros
    for (let k = temp.length; k < 8; k++) {
      temp = "0" + temp;
    }
    // console.log(temp);
    ip += temp;
  }
  return ip;
};
// this function gets a 32 bit string of 1s ans 0s and returns an array containg 4 decimal values.
const binary32toDecAray = function (binStr) {
  let netArr = [];
  let tmp = "";
  for (let i = 0; i < binStr.length; i++) {
    tmp += binStr[i];
    if (tmp.length === 8) {
      netArr.push(parseInt(tmp, 2));
      tmp = "";
      // tmp += ".";
    }
  }
  // console.log(netArr);
  return netArr;
};
// update the decimal mask based on prefix
const setMask = function (numberOfBits) {
  const maskOctet = [0, 128, 192, 224, 240, 248, 252, 254, 255];
  if (numberOfBits <= 8) {
    mask_1.textContent = maskOctet[numberOfBits];
    mask_2.textContent = maskOctet[0];
    mask_3.textContent = maskOctet[0];
    mask_4.textContent = maskOctet[0];
  } else if (numberOfBits <= 16) {
    mask_1.textContent = maskOctet[8];
    mask_2.textContent = maskOctet[numberOfBits - 8];
    mask_3.textContent = maskOctet[0];
    mask_4.textContent = maskOctet[0];
  } else if (numberOfBits <= 24) {
    mask_1.textContent = maskOctet[8];
    mask_2.textContent = maskOctet[8];
    mask_3.textContent = maskOctet[numberOfBits - 16];
    mask_4.textContent = maskOctet[0];
  } else {
    mask_1.textContent = maskOctet[8];
    mask_2.textContent = maskOctet[8];
    mask_3.textContent = maskOctet[8];
    mask_4.textContent = maskOctet[numberOfBits - 24];
  }
};

const totalIPs = function (prefixBits) {
  // return 2 ** (32 - prefixBits);
  IPs.textContent = `Number of IP addreses per subnet: ${new Intl.NumberFormat().format(
    2 ** (32 - prefixBits)
  )}`;
  // console.log(2 ** (32 - prefixBits));
};
const numberOfSubnets = function (classBits, subnetBits) {
  // console.log(2 ** (subnetBits - classBits));
  if (subnetBits >= classBits) {
    totalSubnets.textContent = `Number of subnetts: ${new Intl.NumberFormat().format(
      2 ** (subnetBits - classBits)
    )}`;
  } else {
    totalSubnets.textContent = `This is a supernet. IP aggrigation.`;
  }
};

// sets the IP calss on the HTML page
const setIPclass = function (ipFirstOctet) {
  // console.log(ipFirstOctet);
  if (ipFirstOctet < 128) {
    ipClass.textContent = `IP Class: A`;
  } else if (ipFirstOctet < 192) {
    ipClass.textContent = `IP Class: B`;
  } else {
    ipClass.textContent = `IP Class: C`;
  }
};

// function to find the subnet that the IP belongs to
// might convert all to binary to calculate this.
// ipArr is the ip[0,0,0,0,0] = position [0] is the mask
const getSubnetId = function (ipArr, cidrMask) {
  // convert cidrMask to binary
  const maxBits = 32;
  let binMask = "";
  for (let i = 0; i < maxBits; i++) {
    if (i < cidrMask) {
      binMask += "1";
    } else {
      binMask += "0";
    }
  }
  // let binMask = cidrToBin(ip[0]);
  // convert ipArr to binary
  let ip = ""; //holds the binary ip
  ipArr = ipArr.slice(1); // remove position [0] from ipArr
  for (let i = 0; i < ipArr.length; i++) {
    let temp = ipArr[i].toString(2);
    // add leading zeros
    for (let k = temp.length; k < 8; k++) {
      temp = "0" + temp;
    }
    // console.log(temp);
    ip += temp;
  }

  // find net ID (in binary form)
  let netID = "";
  for (let i = 0; i < ip.length; i++) {
    if (binMask[i] === "1") {
      netID += ip[i];
    } else {
      netID += "0";
    }
  }
  // use function to convert binary 32 bits to decimal aray
  let subnet = binary32toDecAray(netID);
  // console.log(subnet);
  // update the HTML page
  // subnetID.textContent = `IP belongs to subnet: ${subnet[0]}.${subnet[1]}.${subnet[2]}.${subnet[3]}`;
  return subnet;
};
// sets the subnet ID on the HTML page
const setSubnetId = function (subnet) {
  subnetID.textContent = `IP belongs to subnet: ${subnet[0]}.${subnet[1]}.${subnet[2]}.${subnet[3]}`;
};

// get ip address range in a subnet
const getIPrangeInSubnet = function (subnetArr, cidr) {
  // console.log(cidr);
  let binSubnet = ipToBin(subnetArr);
  let binCidr = cidrToBin(cidr);
  // console.log(binSubnet);
  // console.log(binCidr);
  let ipRange = subnetArr.slice();
  // console.log(ipRange);
  // calculat binary last address
  let lastIP = "";
  for (let i = 0; i < binSubnet.length; i++) {
    if (binCidr[i] === "1") {
      lastIP += binSubnet[i];
    } else if (binCidr[i] === "0") {
      lastIP += "1";
    }
  }
  let tmpArr = binary32toDecAray(lastIP);
  // console.log(lastIP);
  // console.log(tmpArr);
  ipRange = ipRange.concat(tmpArr);
  // console.log(ipRange);
  return ipRange;
};

const setIPrangeInSubnet = function (ipAdrRange) {
  // console.log(ipAdrRange);
  // console.log();
  ipRange.textContent = `IP range in the subnet: ${ipAdrRange[0]}.${ipAdrRange[1]}.${ipAdrRange[2]}.${ipAdrRange[3]} - ${ipAdrRange[4]}.${ipAdrRange[5]}.${ipAdrRange[6]}.${ipAdrRange[7]}`;
};

const init = function () {
  // ip = ipGenerator();
  ip = classfulIpGenerator();
  // console.log(ip[0]);
  octet_1.textContent = ip[1];
  octet_2.textContent = ip[2];
  octet_3.textContent = ip[3];
  octet_4.textContent = ip[4];
  octet_6.textContent = ip[0];
  slider.value = ip[0];

  toggleBits(ip[0], ip[0]);
  setMask(ip[0]);
  totalIPs(ip[0]);
  numberOfSubnets(ip[0], ip[0]);
  setIPclass(ip[1]);
  // let subnet = getSubnetId(ip, ip[0]);
  let subnet = getSubnetId(ip, ip[0]);
  setSubnetId(subnet);
  let ipAddressRange = getIPrangeInSubnet(subnet, ip[0]);
  setIPrangeInSubnet(ipAddressRange);
  // console.log(ipAddressRange);
};
// slider functions
slider.oninput = function () {
  // mask_1.textContent = this.value;
  octet_6.textContent = this.value;

  toggleBits(ip[0], this.value);
  // toggleSubnetBits(this.value);
  setMask(this.value);
  totalIPs(this.value);
  numberOfSubnets(ip[0], this.value);
  let subnet = getSubnetId(ip, this.value);
  setSubnetId(subnet);
  let ipAddressRange = getIPrangeInSubnet(subnet, this.value);
  // console.log(ipAddressRange);
  setIPrangeInSubnet(ipAddressRange);
};
// console.log(ipGenerator());

init();

newIPbtn.addEventListener("click", function () {
  init();
});
