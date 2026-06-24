#![no_std]

use soroban_sdk::{contract, contractimpl, Env, String};

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    pub fn name(env: Env) -> String {
        String::from_str(&env, "reputation")
    }
}
