#![no_std]

use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, panic_with_error, Address,
    Env, String,
};

#[contracttype]
#[derive(Clone)]
pub struct Credential {
    pub credential_id: u64,
    pub issuer: Address,
    pub recipient: Address,
    pub credential_hash: String,
    pub credential_type: String,
    pub metadata_uri: String,
    pub issued_at: i64,
    pub revoked: bool,
}

#[contracterror]
#[derive(Copy, Clone, PartialEq, Eq)]
pub enum CredentialRegistryError {
    InvalidCredentialId = 1,
    InvalidCredentialHash = 2,
    InvalidCredentialType = 3,
    InvalidMetadataUri = 4,
    CredentialAlreadyExists = 5,
    CredentialNotFound = 6,
    Unauthorized = 7,
    CredentialAlreadyRevoked = 8,
}

#[contracttype]
pub enum DataKey {
    Credential(u64),
}

#[contractclient(name = "CredentialRegistryClient")]
pub trait CredentialRegistry {
    fn issue_credential(
        env: Env,
        credential_id: u64,
        issuer: Address,
        recipient: Address,
        credential_hash: String,
        credential_type: String,
        metadata_uri: String,
    );
    fn get_credential(env: Env, credential_id: u64) -> Option<Credential>;
    fn is_valid(env: Env, credential_id: u64) -> bool;
    fn revoke_credential(env: Env, credential_id: u64, issuer: Address);
}

#[contract]
pub struct CredentialRegistryContract;

#[contractimpl]
impl CredentialRegistryContract {
    pub fn name(env: Env) -> String {
        String::from_str(&env, "credential-registry")
    }

    pub fn issue_credential(
        env: Env,
        credential_id: u64,
        issuer: Address,
        recipient: Address,
        credential_hash: String,
        credential_type: String,
        metadata_uri: String,
    ) {
        issuer.require_auth();

        if credential_id == 0 {
            panic_with_error!(&env, CredentialRegistryError::InvalidCredentialId);
        }
        if credential_hash.is_empty() {
            panic_with_error!(&env, CredentialRegistryError::InvalidCredentialHash);
        }
        if credential_type.is_empty() {
            panic_with_error!(&env, CredentialRegistryError::InvalidCredentialType);
        }
        if metadata_uri.is_empty() {
            panic_with_error!(&env, CredentialRegistryError::InvalidMetadataUri);
        }
        if env
            .storage()
            .persistent()
            .has(&DataKey::Credential(credential_id))
        {
            panic_with_error!(&env, CredentialRegistryError::CredentialAlreadyExists);
        }

        let credential = Credential {
            credential_id,
            issuer,
            recipient,
            credential_hash,
            credential_type,
            metadata_uri,
            issued_at: env.ledger().timestamp() as i64,
            revoked: false,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Credential(credential_id), &credential);
    }

    pub fn get_credential(env: Env, credential_id: u64) -> Option<Credential> {
        env.storage()
            .persistent()
            .get(&DataKey::Credential(credential_id))
    }

    pub fn is_valid(env: Env, credential_id: u64) -> bool {
        Self::get_credential(env, credential_id)
            .map(|credential| !credential.revoked)
            .unwrap_or(false)
    }

    pub fn revoke_credential(env: Env, credential_id: u64, issuer: Address) {
        issuer.require_auth();
        let key = DataKey::Credential(credential_id);
        let mut credential: Credential =
            env.storage().persistent().get(&key).unwrap_or_else(|| {
                panic_with_error!(&env, CredentialRegistryError::CredentialNotFound)
            });

        if credential.issuer != issuer {
            panic_with_error!(&env, CredentialRegistryError::Unauthorized);
        }
        if credential.revoked {
            panic_with_error!(&env, CredentialRegistryError::CredentialAlreadyRevoked);
        }

        credential.revoked = true;
        env.storage().persistent().set(&key, &credential);
    }
}

#[cfg(test)]
mod test;
