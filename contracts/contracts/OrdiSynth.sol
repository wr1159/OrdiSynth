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

  event SynthDeposited(address indexed user, address indexed contractAddress, uint indexed tokenId, uint256 runeAmount, address synthTokenAddress);
  event SynthRedeemed(address indexed user, address indexed contractAddress, uint indexed tokenId, uint256 runeAmount, address synthTokenAddress);
  event LiquidityAdded(address indexed user, address indexed contractAddress, uint indexed tokenId, uint256 runeAmount, uint256 ethAmount, address synthTokenAddress);
  event TokenSwappedForRune(address indexed user, address indexed contractAddress, uint indexed tokenId, uint256 runeAmount, address synthTokenAddress);

  constructor(address _router) {
      router = IUniswapV2Router02(_router);
  }

  mapping (address => address) public synthAddressByContractAddress;
  mapping (address => uint256) public ownedRuneByContractAddress;
  mapping (address => mapping(uint => uint256)) public availableRuneByContractAddressAndTokenId;

  function depositForSynth(address contractAddress, uint tokenId, uint256 runeAmount) public {
    SynthToken synthToken;
    RuneToken rune = RuneToken(contractAddress);
    rune.safeTransferFrom(msg.sender, address(this), tokenId, runeAmount, "");

    if (synthAddressByContractAddress[contractAddress] != address(0)) {
      synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    } else {
      synthToken = new SynthToken(string.concat("synthetic", rune.getTokenInfo(tokenId, msg.sender).name), string.concat("s", rune.getTokenInfo(tokenId, msg.sender).symbol), address(this));
      synthAddressByContractAddress[contractAddress] = address(synthToken);
    }

    ownedRuneByContractAddress[contractAddress] += runeAmount;
    availableRuneByContractAddressAndTokenId[contractAddress][tokenId] += runeAmount;

    uint256 mintAmount = runeAmount * (10**synthToken.decimals());
    synthToken.mint(msg.sender, mintAmount);

    emit SynthDeposited(msg.sender, contractAddress, tokenId, runeAmount, address(synthToken));
  }

  function redeemSynth(address contractAddress, uint tokenId, uint256 runeAmount) public {
    SynthToken synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    RuneToken rune = RuneToken(contractAddress);

    uint256 synthAmount = runeAmount * (10**synthToken.decimals());
    synthToken.transferFrom(msg.sender, address(this), synthAmount);
    synthToken.burn(synthAmount);

    ownedRuneByContractAddress[contractAddress] -= runeAmount;
    availableRuneByContractAddressAndTokenId[contractAddress][tokenId] -= runeAmount;

    rune.setApprovalForAll(msg.sender, true);
    rune.safeTransferFrom(address(this), msg.sender, tokenId, runeAmount, "");

    emit SynthRedeemed(msg.sender, contractAddress, tokenId, runeAmount, address(synthToken));
  }

  function addLiquidityToRouter(address contractAddress, uint tokenId, uint256 runeAmount) public payable {
    SynthToken synthToken;
    RuneToken rune = RuneToken(contractAddress);
    rune.safeTransferFrom(msg.sender, address(this), tokenId, runeAmount, "");

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

    synthToken.approve(address(router), mintAmount);
    router.addLiquidityETH{value: msg.value}(
      address(synthToken),
      mintAmount,
      mintAmount * 95 / 100,
      msg.value * 95 / 100,
      msg.sender,
      block.timestamp + 60
    );

    emit LiquidityAdded(msg.sender, contractAddress, tokenId, runeAmount, msg.value, address(synthToken));
  }

  function swapTokenForRune(address contractAddress, uint tokenId, uint256 runeAmount) public payable {
    SynthToken synthToken = SynthToken(synthAddressByContractAddress[contractAddress]);
    RuneToken rune = RuneToken(contractAddress);

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

    synthToken.burn(synthAmount);

    ownedRuneByContractAddress[contractAddress] -= runeAmount;
    availableRuneByContractAddressAndTokenId[contractAddress][tokenId] -= runeAmount;

    rune.setApprovalForAll(msg.sender, true);
    rune.safeTransferFrom(address(this), msg.sender, tokenId, runeAmount, "");

    emit TokenSwappedForRune(msg.sender, contractAddress, tokenId, runeAmount, address(synthToken));
  }

  receive() external payable {}
}
