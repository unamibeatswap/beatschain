use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use anchor_spl::associated_token::AssociatedToken;
use mpl_token_metadata::instruction::create_metadata_accounts_v3;
use mpl_token_metadata::state::DataV2;

declare_id!("BeatsChainSolanaProgram11111111111111111111");

#[program]
pub mod beatschain_solana {
    use super::*;

    pub fn mint_music_nft(
        ctx: Context<MintMusicNFT>,
        metadata_uri: String,
        name: String,
        symbol: String,
    ) -> Result<()> {
        // Create Metaplex metadata
        let metadata_seeds = &[
            b"metadata",
            mpl_token_metadata::id().as_ref(),
            ctx.accounts.mint.key().as_ref(),
        ];
        let (metadata_pda, _) = Pubkey::find_program_address(
            metadata_seeds,
            &mpl_token_metadata::id(),
        );

        // Create metadata instruction
        let create_metadata_ix = create_metadata_accounts_v3(
            mpl_token_metadata::id(),
            metadata_pda,
            ctx.accounts.mint.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.mint_authority.key(),
            name.clone(),
            symbol.clone(),
            metadata_uri.clone(),
            Some(vec![mpl_token_metadata::state::Creator {
                address: ctx.accounts.payer.key(),
                verified: true,
                share: 100,
            }]),
            250, // 2.5% royalty
            true,
            true,
            None,
            None,
            None,
        );

        // Execute metadata creation
        anchor_lang::solana_program::program::invoke(
            &create_metadata_ix,
            &[
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.mint_authority.to_account_info(),
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.token_metadata_program.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Mint 1 NFT to the user's token account
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            ),
            1,
        )?;

        msg!("Minted BeatsChain Music NFT: {} ({}) with URI: {}", name, symbol, metadata_uri);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintMusicNFT<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = mint_authority,
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Metadata account for Metaplex
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: Metaplex token metadata program
    pub token_metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}