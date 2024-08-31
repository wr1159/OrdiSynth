// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./RuneToken.sol";
import "./SynthToken.sol";

contract OrdiSynth is ERC1155Holder {
  IUniswapV2Router02 router;
  constructor(address _router) {
      router = IUniswapV2Router02(_router);
  }
  mapping (address => address) public synthAddressByContractAddress;
  mapping (address => uint256) public ownedRuneByContractAddress;
  // used to keep track of what is available to be redeemed
  mapping (address => mapping(uint => uint256)) public availableRuneByContractAddressAndTokenId;

  // depositForSynth is a function that allows users to deposit rune tokens to mint a synth
  // Ensure that the user has approved transfer
  function depositForSynth(address contractAddress, uint tokenId, uint256 runeAmount) public {
    SynthToken synthToken;
    RuneToken rune = RuneToken(contractAddress);
    // 1. transfer rune tokens to this contract
    rune.safeTransferFrom(msg.sender, address(this), tokenId, runeAmount, "");

    // 2. set the token address to the synthByContractAddress mapping
    if (synthAddressByContractAddress[contractAddress] != address(0)) {
      synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    } else {
      synthToken = new SynthToken(string.concat("synthetic", rune.getTokenInfo(tokenId, msg.sender).name), string.concat("s", rune.getTokenInfo(tokenId, msg.sender).symbol), address(this));
      synthAddressByContractAddress[contractAddress] = address(synthToken);
    }
    // 3. mint synth tokens to the user
    ownedRuneByContractAddress[contractAddress] += runeAmount;
    availableRuneByContractAddressAndTokenId[contractAddress][tokenId] += runeAmount;

    uint256 mintAmount = runeAmount * (10**synthToken.decimals());
    synthToken.mint(msg.sender, mintAmount);
    return;
  }

  // redeemSynth is a function that allows users to redeem synth tokens for their rune tokens
  function redeemSynth(address contractAddress, uint tokenId, uint256 runeAmount) public {
    SynthToken synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    RuneToken rune = RuneToken(contractAddress);
    // 1. burn synth tokens from the user
    uint256 synthAmount = runeAmount * (10**synthToken.decimals());
    synthToken.transferFrom(msg.sender, address(this), synthAmount);
    synthToken.burn(synthAmount);

    ownedRuneByContractAddress[contractAddress] -= runeAmount;
    availableRuneByContractAddressAndTokenId[contractAddress][tokenId] -= runeAmount;
    // 2. transfer rune to the user
    rune.setApprovalForAll(msg.sender, true);
    rune.safeTransferFrom(address(this), msg.sender, tokenId, runeAmount, "");
    return;
  }

  // addLiquidityToRouter is a function that allows users to add liquidity to the uniswap pool
  function addLiquidityToRouter(address contractAddress, uint tokenId, uint256 runeAmount) public payable {
    SynthToken synthToken;
    RuneToken rune = RuneToken(contractAddress);
    // 1. transfer erc1155 tokens to this contract
    rune.safeTransferFrom(msg.sender, address(this), tokenId, runeAmount, "");

    // 2. set the token address to the synthByContractAddress mapping
    if (synthAddressByContractAddress[contractAddress] != address(0)) {
      synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
      
    } else {
      synthToken = new SynthToken(string.concat("synthetic", rune.getTokenInfo(tokenId, msg.sender).name), string.concat("s", rune.getTokenInfo(tokenId, msg.sender).symbol), address(this));
      synthAddressByContractAddress[contractAddress] = address(synthToken);
    }
    ownedRuneByContractAddress[contractAddress] += runeAmount;
    availableRuneByContractAddressAndTokenId[contractAddress][tokenId] += runeAmount;

    uint256 mintAmount = runeAmount * (10**synthToken.decimals());
    synthToken.mint(address(this), mintAmount);

    // 3. add liquidity to the uniswap pool
    synthToken.approve(address(router), mintAmount);
    router.addLiquidityETH{value: msg.value}(
      address(synthToken),
      mintAmount,
      mintAmount,
      msg.value,
      msg.sender,
      block.timestamp + 60
    );
    return;
  }

  // swapTokenForRune is a function that allows users to swap any rBTC on the uniswap pool for synth tokens
  // which will be redeemed for rune tokens
  function swapTokenForRune(address contractAddress, uint tokenId, uint256 runeAmount) public payable {
    SynthToken synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    RuneToken rune = RuneToken(contractAddress);
    // 1. swap tokens for synth tokens
    uint256 synthAmount = runeAmount * (10**synthToken.decimals());
    address[] memory path = new address[](2);
    path[0] = router.WETH();
    path[1] = address(synthToken);
    router.swapETHForExactTokens{value: msg.value}(
      synthAmount,
      path,
      address(this),
      block.timestamp + 60
    );

    // 2. burn synth tokens 
    synthToken.burn(synthAmount);

    ownedRuneByContractAddress[contractAddress] -= runeAmount;
    availableRuneByContractAddressAndTokenId[contractAddress][tokenId] -= runeAmount;
    // 3. transfer erc1155 tokens to the user
    rune.setApprovalForAll(msg.sender, true);
    rune.safeTransferFrom(address(this), msg.sender, tokenId, runeAmount, "");
    return;
  }

  receive() external payable {}
  
}