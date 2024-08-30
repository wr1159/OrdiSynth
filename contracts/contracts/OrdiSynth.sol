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
  mapping (address => address) public synthAddressByContractAddress;
  mapping (address => uint256) public ownedErc1155ByContractAddress;
  // used to keep track of what is available to be redeemed
  mapping (address => mapping(uint => uint256)) public availableErc1155ByContractAddressAndTokenId;

  // depositForSynth is a function that allows users to deposit erc1155 tokens to mint a synth
  // Ensure that the user has approved transfer
  function depositForSynth(address contractAddress, uint tokenId, uint256 amount) public {
    SynthToken synthToken;
    IERC1155 erc1155 = IERC1155(contractAddress);
    // 1. transfer erc1155 tokens to this contract
    erc1155.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

    // 2. set the token address to the synthByContractAddress mapping
    if (synthAddressByContractAddress[contractAddress] != address(0)) {
      synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
      
    } else {
      synthToken = new SynthToken("name", "symbol", address(this));
      synthAddressByContractAddress[contractAddress] = address(synthToken);
    }
    // 3. mint synth tokens to the user
    synthToken.mint(msg.sender, amount);
    ownedErc1155ByContractAddress[contractAddress] += amount;
    availableErc1155ByContractAddressAndTokenId[contractAddress][tokenId] += amount;
    return;
  }

  // redeemSynth is a function that allows users to redeem synth tokens for their erc1155 tokens
  function redeemSynth(address contractAddress, uint tokenId, uint256 amount) public {
    SynthToken synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    IERC1155 erc1155 = IERC1155(contractAddress);
    // 1. burn synth tokens from the user
    synthToken.transferFrom(msg.sender, address(this), amount);
    synthToken.burn(amount);
    ownedErc1155ByContractAddress[contractAddress] -= amount;
    availableErc1155ByContractAddressAndTokenId[contractAddress][tokenId] -= amount;
    // 2. transfer erc1155 tokens to the user
    erc1155.setApprovalForAll(msg.sender, true);
    erc1155.safeTransferFrom(address(this), msg.sender, tokenId, amount, "");
    return;
  }
  
}