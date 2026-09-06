#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn setup() -> (Env, Address, Address, Address) {
    let env = Env::default();
    let contract_id = env.register(CredentialRegistryContract, ());
    let issuer = Address::generate(&env);
    let recipient = Address::generate(&env);
    (env, contract_id, issuer, recipient)
}

fn issue(env: &Env, contract_id: &Address, issuer: &Address, recipient: &Address, id: u64) {
    let client = CredentialRegistryClient::new(env, contract_id);
    client.issue_credential(
        &id,
        issuer,
        recipient,
        &String::from_str(env, "sha256:credential"),
        &String::from_str(env, "course"),
        &String::from_str(env, "ipfs://metadata"),
    );
}

#[test]
fn creates_and_retrieves_credential() {
    let (env, contract_id, issuer, recipient) = setup();
    env.mock_all_auths();
    issue(&env, &contract_id, &issuer, &recipient, 1);

    let credential = CredentialRegistryClient::new(&env, &contract_id).get_credential(&1);

    assert!(credential.is_some());
    let credential = credential.unwrap();
    assert_eq!(credential.issuer, issuer);
    assert_eq!(credential.recipient, recipient);
    assert!(!credential.revoked);
}

#[test]
fn invalid_and_duplicate_credentials_fail() {
    let (env, contract_id, issuer, recipient) = setup();
    env.mock_all_auths();
    let client = CredentialRegistryClient::new(&env, &contract_id);

    assert!(client
        .try_issue_credential(
            &0,
            &issuer,
            &recipient,
            &String::from_str(&env, "hash"),
            &String::from_str(&env, "course"),
            &String::from_str(&env, "metadata"),
        )
        .is_err());

    issue(&env, &contract_id, &issuer, &recipient, 2);
    assert!(client
        .try_issue_credential(
            &2,
            &issuer,
            &recipient,
            &String::from_str(&env, "hash"),
            &String::from_str(&env, "course"),
            &String::from_str(&env, "metadata"),
        )
        .is_err());
}

#[test]
fn unauthorized_issuer_cannot_create_credential() {
    let (env, contract_id, issuer, recipient) = setup();
    let client = CredentialRegistryClient::new(&env, &contract_id);
    assert!(client
        .try_issue_credential(
            &1,
            &issuer,
            &recipient,
            &String::from_str(&env, "hash"),
            &String::from_str(&env, "course"),
            &String::from_str(&env, "metadata"),
        )
        .is_err());
}

#[test]
fn issuer_can_revoke_and_verification_becomes_invalid() {
    let (env, contract_id, issuer, recipient) = setup();
    env.mock_all_auths();
    issue(&env, &contract_id, &issuer, &recipient, 3);

    let client = CredentialRegistryClient::new(&env, &contract_id);
    client.revoke_credential(&3, &issuer);
    assert!(!client.is_valid(&3));
}
