#![no_std]

use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, panic_with_error, Address,
    Env, String,
};

#[contracttype]
#[derive(Clone)]
pub struct VerificationRecord {
    pub credential_id: u64,
    pub verifier: Address,
    pub is_valid: bool,
    pub verified_at: i64,
}

#[contracttype]
pub enum DataKey {
    Verification(u64),
}

#[contracterror]
#[derive(Copy, Clone, PartialEq, Eq)]
pub enum VerificationError {
    InvalidCredentialId = 1,
    VerificationAlreadyExists = 2,
    Unauthorized = 3,
}

#[contractclient(name = "VerificationClient")]
pub trait Verification {
    fn record_verification(env: Env, credential_id: u64, verifier: Address, is_valid: bool);
    fn get_verification(env: Env, credential_id: u64) -> Option<VerificationRecord>;
}

#[contract]
pub struct VerificationContract;

#[contractimpl]
impl VerificationContract {
    pub fn name(env: Env) -> String {
        String::from_str(&env, "verification")
    }

    pub fn record_verification(env: Env, credential_id: u64, verifier: Address, is_valid: bool) {
        verifier.require_auth();
        if credential_id == 0 {
            panic_with_error!(&env, VerificationError::InvalidCredentialId);
        }
        let key = DataKey::Verification(credential_id);
        let record = VerificationRecord {
            credential_id,
            verifier,
            is_valid,
            verified_at: env.ledger().timestamp() as i64,
        };
        env.storage().persistent().set(&key, &record);
    }

    pub fn get_verification(env: Env, credential_id: u64) -> Option<VerificationRecord> {
        env.storage()
            .persistent()
            .get(&DataKey::Verification(credential_id))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn verifier_can_record_and_retrieve_result() {
        let env = Env::default();
        let contract_id = env.register(VerificationContract, ());
        let verifier = Address::generate(&env);
        env.mock_all_auths();
        let client = VerificationClient::new(&env, &contract_id);

        client.record_verification(&7, &verifier, &true);
        let record = client.get_verification(&7).unwrap();
        assert_eq!(record.credential_id, 7);
        assert_eq!(record.verifier, verifier);
        assert!(record.is_valid);
    }

    #[test]
    fn invalid_and_unauthorized_verification_fail() {
        let env = Env::default();
        let contract_id = env.register(VerificationContract, ());
        let verifier = Address::generate(&env);
        let client = VerificationClient::new(&env, &contract_id);

        assert!(client
            .try_record_verification(&0, &verifier, &true)
            .is_err());
        assert!(client
            .try_record_verification(&7, &verifier, &true)
            .is_err());
    }

    #[test]
    fn later_verification_updates_latest_result() {
        let env = Env::default();
        let contract_id = env.register(VerificationContract, ());
        let verifier = Address::generate(&env);
        env.mock_all_auths();
        let client = VerificationClient::new(&env, &contract_id);

        client.record_verification(&7, &verifier, &true);
        client.record_verification(&7, &verifier, &false);
        assert!(!client.get_verification(&7).unwrap().is_valid);
    }
}
