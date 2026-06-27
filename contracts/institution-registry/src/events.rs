#![no_std]

use soroban_sdk::{Address, Env, i128, String};

pub fn publish_institution_registered(env: &Env, institution_id: u64, wallet: Address, name: String, metadata_uri: String, created_at: i64) {
    env.events().publish(
        ("institution_registered",),
        (institution_id, wallet, name, metadata_uri, created_at),
    );
}

pub fn publish_institution_verified(env: &Env, institution_id: u64, wallet: Address, verified_at: i64) {
    env.events().publish(
        ("institution_verified",),
        (institution_id, wallet, verified_at),
    );
}

pub fn publish_institution_revoked(env: &Env, institution_id: u64, wallet: Address, revoked_at: i64) {
    env.events().publish(
        ("institution_revoked",),
        (institution_id, wallet, revoked_at),
    );
}
