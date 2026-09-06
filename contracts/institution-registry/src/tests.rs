#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn setup() -> (Env, Address, Address, Address) {
    let env = Env::default();
    let contract_id = env.register(InstitutionRegistryContract, ());
    let admin = Address::generate(&env);
    let institution = Address::generate(&env);
    (env, contract_id, admin, institution)
}

#[test]
fn registers_and_retrieves_institution() {
    let (env, contract_id, admin, institution) = setup();
    env.mock_all_auths();
    let client = InstitutionRegistryClient::new(&env, &contract_id);
    client.init_admin(&admin);
    client.register_institution(
        &String::from_str(&env, "GenuFi University"),
        &institution,
        &String::from_str(&env, "ipfs://institution"),
    );

    let stored = client.get_institution(&institution).unwrap();
    assert_eq!(stored.name, String::from_str(&env, "GenuFi University"));
    assert!(!stored.verified);
}

#[test]
fn admin_can_verify_and_revoke_institution() {
    let (env, contract_id, admin, institution) = setup();
    env.mock_all_auths();
    let client = InstitutionRegistryClient::new(&env, &contract_id);
    client.init_admin(&admin);
    client.register_institution(
        &String::from_str(&env, "GenuFi University"),
        &institution,
        &String::from_str(&env, "ipfs://institution"),
    );
    client.verify_institution(&institution);
    assert!(client.is_verified(&institution));
    client.revoke_institution(&institution);
    assert!(!client.is_verified(&institution));
}

#[test]
fn duplicate_and_unauthorized_operations_fail() {
    let (env, contract_id, admin, institution) = setup();
    let client = InstitutionRegistryClient::new(&env, &contract_id);
    assert!(client.try_init_admin(&admin).is_err());

    env.mock_all_auths();
    client.init_admin(&admin);
    client.register_institution(
        &String::from_str(&env, "GenuFi University"),
        &institution,
        &String::from_str(&env, "ipfs://institution"),
    );
    assert!(client
        .try_register_institution(
            &String::from_str(&env, "Duplicate"),
            &institution,
            &String::from_str(&env, "ipfs://duplicate"),
        )
        .is_err());
}
