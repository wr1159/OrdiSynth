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
  function depositForSynth(address contractAddress, uint tokenId, uint256 erc1155Amount) public {
    SynthToken synthToken;
    IERC1155 erc1155 = IERC1155(contractAddress);
    // 1. transfer erc1155 tokens to this contract
    erc1155.safeTransferFrom(msg.sender, address(this), tokenId, erc1155Amount, "");

    // 2. set the token address to the synthByContractAddress mapping
    if (synthAddressByContractAddress[contractAddress] != address(0)) {
      synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
      
    } else {
      synthToken = new SynthToken("name", "symbol", address(this));
      synthAddressByContractAddress[contractAddress] = address(synthToken);
    }
    // 3. mint synth tokens to the user
    ownedErc1155ByContractAddress[contractAddress] += erc1155Amount;
    availableErc1155ByContractAddressAndTokenId[contractAddress][tokenId] += erc1155Amount;

    uint256 mintAmount = erc1155Amount * (10**synthToken.decimals());
    synthToken.mint(msg.sender, mintAmount);
    return;
  }

  // redeemSynth is a function that allows users to redeem synth tokens for their erc1155 tokens
  function redeemSynth(address contractAddress, uint tokenId, uint256 erc1155Amount) public {
    SynthToken synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    IERC1155 erc1155 = IERC1155(contractAddress);
    // 1. burn synth tokens from the user
    uint256 synthAmount = erc1155Amount * (10**synthToken.decimals());
    synthToken.transferFrom(msg.sender, address(this), synthAmount);
    synthToken.burn(synthAmount);

    ownedErc1155ByContractAddress[contractAddress] -= erc1155Amount;
    availableErc1155ByContractAddressAndTokenId[contractAddress][tokenId] -= erc1155Amount;
    // 2. transfer erc1155 tokens to the user
    erc1155.setApprovalForAll(msg.sender, true);
    erc1155.safeTransferFrom(address(this), msg.sender, tokenId, erc1155Amount, "");
    return;
  }

  // addLiquidityToRouter is a function that allows users to add liquidity to the uniswap pool
  function addLiquidityToRouter(address contractAddress, uint tokenId, uint256 erc1155Amount) public payable {
    SynthToken synthToken;
    IERC1155 erc1155 = IERC1155(contractAddress);
    // 1. transfer erc1155 tokens to this contract
    erc1155.safeTransferFrom(msg.sender, address(this), tokenId, erc1155Amount, "");

    // 2. set the token address to the synthByContractAddress mapping
    if (synthAddressByContractAddress[contractAddress] != address(0)) {
      synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
      
    } else {
      synthToken = new SynthToken("name", "symbol", address(this));
      synthAddressByContractAddress[contractAddress] = address(synthToken);
    }
    ownedErc1155ByContractAddress[contractAddress] += erc1155Amount;
    availableErc1155ByContractAddressAndTokenId[contractAddress][tokenId] += erc1155Amount;

    uint256 mintAmount = erc1155Amount * (10**synthToken.decimals());
    synthToken.mint(address(this), mintAmount);

    // 3. add liquidity to the uniswap pool
    synthToken.approve(address(router), mintAmount);
    router.addLiquidityETH{value: msg.value}(
      address(synthToken),
      mintAmount,
      mintAmount * 95 / 100,
      msg.value * 95 / 100,
      msg.sender,
      block.timestamp + 60
    );
    return;
  }

  // swapTokenFor1155 is a function that allows users to swap any ERC20 tokens on the uniswap pool for synth tokens
  // which will be redeemed for erc1155 tokens
  function swapTokenFor1155(address contractAddress, uint tokenId, uint256 erc1155Amount) public payable {
    SynthToken synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    IERC1155 erc1155 = IERC1155(contractAddress);
    // 1. swap tokens for synth tokens
    uint256 synthAmount = erc1155Amount * (10**synthToken.decimals());
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

    ownedErc1155ByContractAddress[contractAddress] -= erc1155Amount;
    availableErc1155ByContractAddressAndTokenId[contractAddress][tokenId] -= erc1155Amount;
    // 3. transfer erc1155 tokens to the user
    erc1155.setApprovalForAll(msg.sender, true);
    erc1155.safeTransferFrom(address(this), msg.sender, tokenId, erc1155Amount, "");
    return;
  }

  receive() external payable {}
  
}