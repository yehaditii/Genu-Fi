#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="${ROOT_DIR}/target/testnet-artifacts"
DEPLOYMENT_FILE="${ROOT_DIR}/target/testnet-contract-ids.env"
NETWORK="testnet"
RPC_URL="${STELLAR_RPC_URL:-https://soroban-testnet.stellar.org}"
NETWORK_PASSPHRASE="${STELLAR_NETWORK_PASSPHRASE:-Test SDF Network ; September 2015}"
DEPLOYER="${STELLAR_DEPLOYER_IDENTITY:-}"

if [[ -z "${DEPLOYER}" ]]; then
	echo "Set STELLAR_DEPLOYER_IDENTITY to a local Stellar CLI identity alias." >&2
	echo "Do not put a secret key or seed phrase in this variable or in the repository." >&2
	exit 1
fi

command -v stellar >/dev/null 2>&1 || {
	echo "The Stellar CLI is required: https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli" >&2
	exit 1
}

command -v cargo >/dev/null 2>&1 || {
	echo "Cargo is required to run the contract tests." >&2
	exit 1
}

packages=(
	institution-registry
	credential-registry
	reputation
	verification
)

mkdir -p "${ARTIFACT_DIR}"
rm -f "${DEPLOYMENT_FILE}"

printf '# Stellar Testnet deployment output; generated locally.\n' > "${DEPLOYMENT_FILE}"
printf 'STELLAR_NETWORK=%s\n' "${NETWORK}" >> "${DEPLOYMENT_FILE}"
printf 'STELLAR_RPC_URL=%s\n' "${RPC_URL}" >> "${DEPLOYMENT_FILE}"
printf 'STELLAR_NETWORK_PASSPHRASE=%s\n' "${NETWORK_PASSPHRASE}" >> "${DEPLOYMENT_FILE}"

for package in "${packages[@]}"; do
	echo "Testing ${package}"
	(cd "${ROOT_DIR}" && cargo test -p "${package}")

	echo "Building ${package} for Stellar Testnet"
	(cd "${ROOT_DIR}" && stellar contract build --package "${package}" --out-dir "${ARTIFACT_DIR}")

	wasm_name="${package//-/_}.wasm"
	wasm_path="${ARTIFACT_DIR}/${wasm_name}"
	if [[ ! -f "${wasm_path}" ]]; then
		wasm_path="$(find "${ARTIFACT_DIR}" -type f -name "${wasm_name}" -print -quit)"
	fi
	if [[ -z "${wasm_path}" || ! -f "${wasm_path}" ]]; then
		echo "Could not find the built WASM artifact for ${package}." >&2
		exit 1
	fi

	echo "Deploying ${package} to Stellar Testnet"
	deploy_output="$(stellar contract deploy \
		--wasm "${wasm_path}" \
		--source-account "${DEPLOYER}" \
		--network "${NETWORK}" \
		--rpc-url "${RPC_URL}" \
		--network-passphrase "${NETWORK_PASSPHRASE}" \
		--alias "${package}")"
	printf '%s\n' "${deploy_output}"

	contract_id="$(printf '%s\n' "${deploy_output}" | grep -Eo 'C[A-Z2-7]{55}' | tail -n 1 || true)"
	if [[ -z "${contract_id}" ]]; then
		echo "Could not parse a contract ID for ${package}; deployment output was not recorded." >&2
		exit 1
	fi

	echo "Verifying ${package} deployment: ${contract_id}"
	verify_output="$(stellar contract invoke \
		--id "${contract_id}" \
		--source-account "${DEPLOYER}" \
		--network "${NETWORK}" \
		--rpc-url "${RPC_URL}" \
		--network-passphrase "${NETWORK_PASSPHRASE}" \
		--send no \
		-- name)"
	printf '%s\n' "${verify_output}"

	env_name="${package//-/_}"
	env_name="${env_name^^}"
	printf '%s_CONTRACT_ID=%s\n' "${env_name}" "${contract_id}" >> "${DEPLOYMENT_FILE}"
done

echo "Deployment complete. Contract IDs recorded in ${DEPLOYMENT_FILE}"
