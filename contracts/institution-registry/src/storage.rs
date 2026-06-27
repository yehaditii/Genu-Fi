#![no_std]

use soroban_sdk::{contracttype, Address, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct Institution {
    pub institution_id: u64,
    pub name: String,
    pub wallet_address: Address,
    pub metadata_uri: String,
    pub verified: bool,
    pub reputation_score: u32,
    pub issued_credentials_count: u32,
    pub revoked_credentials_count: u32,
    pub created_at: i64,
}

const ADMIN_KEY: Symbol = Symbol::short("admin");
const INSTITUTION_COUNTER: Symbol = Symbol::short("institution_counter");
const INSTITUTION_KEY: Symbol = Symbol::short("institution");

pub fn get_admin(env: &Env) -> Option<Address> {
    env.storage().get(&ADMIN_KEY)
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().set(&ADMIN_KEY, admin);
}

pub fn get_institution(env: &Env, wallet: &Address) -> Option<Institution> {
    env.storage().get(&(INSTITUTION_KEY, wallet.clone()))
}

pub fn institution_exists(env: &Env, wallet: &Address) -> bool {
    get_institution(env, wallet).is_some()
}

pub fn set_institution(env: &Env, wallet: &Address, institution: &Institution) {
    env.storage().set(&(INSTITUTION_KEY, wallet.clone()), institution.clone());
}

pub fn increment_institution_counter(env: &Env) -> u64 {
    let count: Option<u64> = env.storage().get(&INSTITUTION_COUNTER);
    let next = count.unwrap_or(0) + 1;
    env.storage().set(&INSTITUTION_COUNTER, next);
    next
}
