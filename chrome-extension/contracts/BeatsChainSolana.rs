use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use anchor_spl::metadata::{
    create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata as MetaplexMetadata,
};
use mpl_token_metadata::types::{DataV2, Creator, Collection, Uses};

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
        // Mint token to user
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            ),
            1, // Amount: 1 NFT
        )?;

        // Create metadata
        let creator = vec![Creator {
            address: ctx.accounts.mint_authority.key(),
            verified: true,
            share: 100,
        }];

        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    mint_authority: ctx.accounts.mint_authority.to_account_info(),
                    update_authority: ctx.accounts.mint_authority.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            DataV2 {
                name,
                symbol,
                uri: metadata_uri,
                seller_fee_basis_points: 250, // 2.5% royalty
                creators: Some(creator),
                collection: None,
                uses: None,
            },
            true, // is_mutable
            true, // update_authority_is_signer
            None, // collection_details
        )?;

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
    
    /// CHECK: Metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, MetaplexMetadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}