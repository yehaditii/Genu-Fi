#![no_std]

use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, panic_with_error,
    symbol_short, Address, Env, String, Symbol,
};

const ADMIN_KEY: Symbol = symbol_short!("admin");

#[contracttype]
pub enum DataKey {
    Score(Address),
}

#[contracterror]
#[derive(Copy, Clone, PartialEq, Eq)]
pub enum ReputationError {
    AdminAlreadyInitialized = 1,
    AdminNotInitialized = 2,
    Unauthorized = 3,
    InvalidScore = 4,
}

#[contractclient(name = "ReputationClient")]
pub trait Reputation {
    fn init_admin(env: Env, admin: Address);
    fn set_score(env: Env, admin: Address, user: Address, score: u32);
    fn get_score(env: Env, user: Address) -> u32;
}

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    pub fn name(env: Env) -> String {
        String::from_str(&env, "reputation")
    }

    pub fn init_admin(env: Env, admin: Address) {
        if env.storage().persistent().has(&ADMIN_KEY) {
            panic_with_error!(&env, ReputationError::AdminAlreadyInitialized);
        }
        admin.require_auth();
        env.storage().persistent().set(&ADMIN_KEY, &admin);
    }

    pub fn set_score(env: Env, admin: Address, user: Address, score: u32) {
        admin.require_auth();
        let stored_admin: Address = env
            .storage()
            .persistent()
            .get(&ADMIN_KEY)
            .unwrap_or_else(|| panic_with_error!(&env, ReputationError::AdminNotInitialized));
        if stored_admin != admin {
            panic_with_error!(&env, ReputationError::Unauthorized);
        }
        if score > 100 {
            panic_with_error!(&env, ReputationError::InvalidScore);
        }
        env.storage()
            .persistent()
            .set(&DataKey::Score(user), &score);
    }

    pub fn get_score(env: Env, user: Address) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::Score(user))
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn admin_can_update_and_retrieve_score() {
        let env = Env::default();
        let contract_id = env.register(ReputationContract, ());
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        env.mock_all_auths();
        let client = ReputationClient::new(&env, &contract_id);

        client.init_admin(&admin);
        client.set_score(&admin, &user, &85);
        assert_eq!(client.get_score(&user), 85);
    }

    #[test]
    fn unauthorized_and_invalid_score_updates_fail() {
        let env = Env::default();
        let contract_id = env.register(ReputationContract, ());
        let admin = Address::generate(&env);
        let other = Address::generate(&env);
        let user = Address::generate(&env);
        env.mock_all_auths();
        let client = ReputationClient::new(&env, &contract_id);

        client.init_admin(&admin);
        assert!(client.try_set_score(&other, &user, &50).is_err());
        assert!(client.try_set_score(&admin, &user, &101).is_err());
    }
}
