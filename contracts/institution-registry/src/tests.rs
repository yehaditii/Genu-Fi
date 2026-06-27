#![cfg(test)]

use super::*;
use soroban_sdk::{Address, Env, String, Symbol};

fn random_address(env: &Env) -> Address {
    // Deterministically derived address for SDK22 test compatibility.
    Address::from_str(
        env,
        "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    )
}

#[test]
fn test_register_and_get_institution() {
    let env = Env::default();
    let contract_id = env.register_contract(None, InstitutionRegistryContract);
    let wallet = random_address(&env);

    env.invoke_contract(
        &contract_id,
        &symbol_short!("register_institution"),
        (&String::from_str(&env, "GenuFi University"), wallet.clone(), &String::from_str(&env, "https://genu.fi/institution.json")),
    );

    let result: Option<Institution> = env.invoke_contract(
        &contract_id,
        &symbol_short!("get_institution"),
        (wallet.clone(),),
    );

    assert!(result.is_some());
    let institution = result.unwrap();
    assert_eq!(institution.name, String::from_str(&env, "GenuFi University"));
    assert_eq!(institution.wallet_address, wallet);
    assert!(!institution.verified);
}

#[test]
fn test_verify_institution() {
    let env = Env::default();
    let contract_id = env.register_contract(None, InstitutionRegistryContract);
    let wallet = random_address(&env);

    env.invoke_contract(
        &contract_id,
        &symbol_short!("register_institution"),
        (&String::from_str(&env, "GenuFi University"), wallet.clone(), &String::from_str(&env, "https://genu.fi/institution.json")),
    );

    env.invoke_contract(
        &contract_id,
        &symbol_short!("verify_institution"),
        (wallet.clone(),),
    );
    let is_verified: bool = env.invoke_contract(
        &contract_id,
        &symbol_short!("is_verified"),
        (wallet.clone(),),
    );

    assert!(is_verified);
}

#[test]
fn test_revoke_institution() {
    let env = Env::default();
    let contract_id = env.register_contract(None, InstitutionRegistryContract);
    let wallet = random_address(&env);

    env.invoke_contract(
        &contract_id,
        &symbol_short!("register_institution"),
        (&String::from_str(&env, "GenuFi University"), wallet.clone(), &String::from_str(&env, "https://genu.fi/institution.json")),
    );

    env.invoke_contract(
        &contract_id,
        &symbol_short!("verify_institution"),
        (wallet.clone(),),
    );
    env.invoke_contract(
        &contract_id,
        &symbol_short!("revoke_institution"),
        (wallet.clone(),),
    );

    let is_verified: bool = env.invoke_contract(
        &contract_id,
        &symbol_short!("is_verified"),
        (wallet.clone(),),
    );
    assert!(!is_verified);
}

