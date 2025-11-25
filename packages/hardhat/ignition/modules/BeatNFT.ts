import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const BeatNFTModule = buildModule('BeatNFTModule', (m) => {
  // Use your super admin wallet as owner and fee recipient
  const initialOwner = m.getParameter('initialOwner', '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10')
  const platformFeeRecipient = m.getParameter('platformFeeRecipient', '0xc84799A904EeB5C57aBBBc40176E7dB8be202C10')

  const beatNFT = m.contract('BeatNFT', [initialOwner, platformFeeRecipient])

  return { beatNFT }
})

export default BeatNFTModule