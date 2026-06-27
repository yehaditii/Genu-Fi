#![no_std]

mod events;
mod storage;

use soroban_sdk::{contract, contractimpl, contracterror, Address, Env, String};
use events::{publish_institution_registered, publish_institution_revoked, publish_institution_verified};
use storage::{get_admin, get_institution, institution_exists, increment_institution_counter, set_admin, set_institution, Institution};

#[contracterror]
pub enum InstitutionRegistryError {
    Unauthorized,
    InstitutionAlreadyRegistered,
    InstitutionNotFound,
    InvalidName,
    InvalidMetadataUri,
    AdminAlreadyInitialized,
    AdminNotInitialized,
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
            panic!(InstitutionRegistryError::AdminAlreadyInitialized);
        }
        set_admin(&env, &admin);
    }

    fn require_admin(env: &Env) {
        let invoker = env.invoker();
        let admin = get_admin(env).expect("Admin not initialized");
        if invoker != admin {
            panic!(InstitutionRegistryError::Unauthorized);
        }
    }

    pub fn register_institution(env: Env, name: String, wallet: Address, metadata_uri: String) {
        if name.is_empty() {
            panic!(InstitutionRegistryError::InvalidName);
        }
        if metadata_uri.is_empty() {
            panic!(InstitutionRegistryError::InvalidMetadataUri);
        }
        if institution_exists(&env, &wallet) {
            panic!(InstitutionRegistryError::InstitutionAlreadyRegistered);
        }

        let institution_id = increment_institution_counter(&env);
        let created_at = env.ledger().timestamp();

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
        publish_institution_registered(&env, institution_id, wallet, name, metadata_uri, created_at);
    }

    pub fn verify_institution(env: Env, wallet: Address) {
        Self::require_admin(&env);
        let mut institution = get_institution(&env, &wallet).expect("Institution not found");
        institution.verified = true;
        set_institution(&env, &wallet, &institution);
        publish_institution_verified(&env, institution.institution_id, wallet, env.ledger().timestamp());
    }

    pub fn revoke_institution(env: Env, wallet: Address) {
        Self::require_admin(&env);
        let mut institution = get_institution(&env, &wallet).expect("Institution not found");
        institution.verified = false;
        set_institution(&env, &wallet, &institution);
        publish_institution_revoked(&env, institution.institution_id, wallet, env.ledger().timestamp());
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
