#![no_std]

use soroban_sdk::{contract, contractimpl, Env, String};

#[contract]
pub struct InstitutionRegistryContract;

#[contractimpl]
impl InstitutionRegistryContract {
    pub fn name(_env: Env) -> String {
        String::from_str(&_env, "institution-registry")
    }
}
