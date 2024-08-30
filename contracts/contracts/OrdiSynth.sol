// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./SynthToken.sol";

contract OrdiSynth is ERC1155Holder {
  IUniswapV2Router02 router;
  constructor(address _router) {
      router = IUniswapV2Router02(_router);
  }
  mapping (address => address) public synthByContractAddress;
  mapping (address => mapping(address => uint256)) public balanceOfSynthByAddress;

  // depositForSynth is a function that allows users to deposit erc1155 tokens to mint a synth
  // Ensure that the user has approved transfer
  function depositForSynth(address contractAddress, uint tokenId, uint256 amount) public {
    SynthToken synthToken;
    IERC1155 erc1155 = IERC1155(contractAddress);
    // 1. transfer erc1155 tokens to this contract
    erc1155.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

    // 2. set the token address to the synthByContractAddress mapping
    if (synthByContractAddress[contractAddress] != address(0)) {
      synthToken = SynthToken(synthByContractAddress[contractAddress]);
      
    } else {
      synthToken = new SynthToken("name", "symbol", address(this));
      synthByContractAddress[contractAddress] = address(synthToken);
    }
    // 3. mint synth tokens to the user
    synthToken.mint(msg.sender, amount);
    balanceOfSynthByAddress[contractAddress][msg.sender] += amount;
    return;
  }

  function redeemSynth() public {

  }
  
  function balanceByAddress(address contractAddress, address owner) public view returns (uint256) {
    return IERC20(contractAddress).balanceOf(owner);
  }
}