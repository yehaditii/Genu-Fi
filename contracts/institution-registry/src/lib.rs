#![no_std]

mod events;
mod storage;

use events::{
    publish_institution_registered, publish_institution_revoked, publish_institution_verified,
};
use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, panic_with_error, Address, Env, String,
};
use storage::{
    get_admin, get_institution, increment_institution_counter, institution_exists, set_admin,
    set_institution, Institution,
};

#[contracterror]
#[derive(Copy, Clone, PartialEq, Eq)]
pub enum InstitutionRegistryError {
    Unauthorized = 1,
    InstitutionAlreadyRegistered = 2,
    InstitutionNotFound = 3,
    InvalidName = 4,
    InvalidMetadataUri = 5,
    AdminAlreadyInitialized = 6,
    AdminNotInitialized = 7,
}

#[contractclient(name = "InstitutionRegistryClient")]
pub trait InstitutionRegistry {
    fn init_admin(env: Env, admin: Address);
    fn register_institution(env: Env, name: String, wallet: Address, metadata_uri: String);
    fn verify_institution(env: Env, wallet: Address);
    fn revoke_institution(env: Env, wallet: Address);
    fn get_institution(env: Env, wallet: Address) -> Option<Institution>;
    fn is_verified(env: Env, wallet: Address) -> bool;
}

#[contract]
pub struct InstitutionRegistryContract;

#[contractimpl]
impl InstitutionRegistryContract {
    pub fn name(env: Env) -> String {
        String::from_str(&env, "institution-registry")
    }

    pub fn init_admin(env: Env, admin: Address) {
        if get_admin(&env).is_some() {
            panic_with_error!(&env, InstitutionRegistryError::AdminAlreadyInitialized);
        }
        admin.require_auth();
        set_admin(&env, &admin);
    }

    fn require_admin(env: &Env) {
        let admin = get_admin(env).unwrap_or_else(|| {
            panic_with_error!(env, InstitutionRegistryError::AdminNotInitialized)
        });
        admin.require_auth();
    }

    pub fn register_institution(env: Env, name: String, wallet: Address, metadata_uri: String) {
        wallet.require_auth();
        if name.is_empty() {
            panic_with_error!(&env, InstitutionRegistryError::InvalidName);
        }
        if metadata_uri.is_empty() {
            panic_with_error!(&env, InstitutionRegistryError::InvalidMetadataUri);
        }
        if institution_exists(&env, &wallet) {
            panic_with_error!(&env, InstitutionRegistryError::InstitutionAlreadyRegistered);
        }

        let institution_id = increment_institution_counter(&env);
        let created_at = env.ledger().timestamp() as i64;
        let institution = Institution {
            institution_id,
            name: name.clone(),
            wallet_address: wallet.clone(),
            metadata_uri: metadata_uri.clone(),
            verified: false,
            reputation_score: 0,
            issued_credentials_count: 0,
            revoked_credentials_count: 0,
            created_at,
        };

        set_institution(&env, &wallet, &institution);
        publish_institution_registered(
            &env,
            institution_id,
            wallet,
            name,
            metadata_uri,
            created_at,
        );
    }

    pub fn verify_institution(env: Env, wallet: Address) {
        Self::require_admin(&env);
        let mut institution = get_institution(&env, &wallet).unwrap_or_else(|| {
            panic_with_error!(&env, InstitutionRegistryError::InstitutionNotFound)
        });
        institution.verified = true;
        set_institution(&env, &wallet, &institution);
        publish_institution_verified(
            &env,
            institution.institution_id,
            wallet,
            env.ledger().timestamp() as i64,
        );
    }

    pub fn revoke_institution(env: Env, wallet: Address) {
        Self::require_admin(&env);
        let mut institution = get_institution(&env, &wallet).unwrap_or_else(|| {
            panic_with_error!(&env, InstitutionRegistryError::InstitutionNotFound)
        });
        institution.verified = false;
        set_institution(&env, &wallet, &institution);
        publish_institution_revoked(
            &env,
            institution.institution_id,
            wallet,
            env.ledger().timestamp() as i64,
        );
    }

    pub fn get_institution(env: Env, wallet: Address) -> Option<Institution> {
        get_institution(&env, &wallet)
    }

    pub fn is_verified(env: Env, wallet: Address) -> bool {
        get_institution(&env, &wallet)
            .map(|institution| institution.verified)
            .unwrap_or(false)
    }
}

#[cfg(test)]
mod tests;
