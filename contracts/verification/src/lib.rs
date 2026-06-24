#![no_std]

use soroban_sdk::{contract, contractimpl, Env, String};

#[contract]
pub struct VerificationContract;

#[contractimpl]
impl VerificationContract {
    pub fn name(env: Env) -> String {
        String::from_str(&env, "verification")
    }
}
