#![no_std]

use soroban_sdk::{contract, contractimpl, Env, String};

#[contract]
pub struct CredentialRegistryContract;

#[contractimpl]
impl CredentialRegistryContract {
    pub fn name(env: Env) -> String {
        String::from_str(&env, "credential-registry")
    }
}
