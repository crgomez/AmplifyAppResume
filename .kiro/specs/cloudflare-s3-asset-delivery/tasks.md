# Implementation Plan: cloudflare-s3-asset-delivery

## Overview

This plan implements `design.md` in the gated order that Requirement 16 fixes. Authoring work (Terraform, workflow files, Operator scripts) is front-loaded into the early waves and runs in parallel with Phase 0. Every merge, apply, CLI mutation, and gating verification sits in its own wave, in the order of Requirement 16 criteria 4, 6, and 9 and the design's [Phase and Change_Unit map](design.md#phase-and-change_unit-map). A production step always depends on the verification task of the step before it, never only on its own authoring task.

Waves are barriers: a task in wave N starts only after every task in waves 0 to N-1 has completed. Each task states its wave and its direct dependencies. The graph at the end is authoritative for scheduling.

### Conventions

- **Execution tags.** `[agent]` changes nothing outside the local machine: it may read AWS, GitHub, Cloudflare, and public URLs, and it may write local files and local git commits, but it mutates no remote state, pushes no branch, and opens no pull request. `[agent+approval]` mutates live AWS, GitHub, or Spacelift state, including pushing a branch or opening a pull request (a pull request starts a Spacelift Proposed_Run, and on Cloudflare_Stack that run holds the write-capable API token; a documentation pull request publishes content to a public repository). Task 1.6 is the one `[agent+approval]` task that changes no remote state; it needs the owner to confirm values. The executor stops, names the exact target, and runs only after the owner confirms in chat. `[operator]` needs the owner (vendor UI, browser login, merge, run confirmation, or a decision).
- **Account check in confirmation prompts.** Every `[agent+approval]` prompt that targets AWS displays the account returned live by `aws sts get-caller-identity "${P[@]}" --output json` alongside `EXPECTED_ACCOUNT_ID` from `~/crgomez-ops/config.env`, and the executor refuses to proceed if they differ. Bucket names, the zone, and resource names stay literal in the prompt, because they name the target. `lib.sh` repeats the same check inside every script.
- **AWS credentials and output.** Every AWS call passes the array built by `~/crgomez-ops/lib.sh` from `config.env`: `P=(--profile "$AWS_PROFILE_NAME" --region "$AWS_REGION")`. Every capture that a later step reads uses `--output json`, because the profile sets no default region or output format. No account ID, canonical user ID, or profile-specific value is written in this file or committed to either repository (design O-13).
- **Shell.** Operator scripts are bash files (`#!/bin/bash`, run with `bash <file>`), never pasted into zsh and never sourced into zsh, because zsh does not word-split unquoted variables. Gates are capture-then-branch (`if …; then …; exit 1; fi`) and every script ends with an explicit success line, so no `test && exit` or bare `[ … ]` is the last statement of a step file.
- **Operator Records.** `~/crgomez-ops/records/` (mode `0700`, outside every repository). `~/crgomez-ops/config.env` (mode `0600`) holds the owner-confirmed expected identity. Each Run Log entry is drafted as its own file `~/crgomez-ops/records/runlog/<TYPE>-<NNN>.txt`; only the public summary moves to `design.md` through a documentation Change_Unit (DOC-1, DOC-2).
- **Worktrees.** Each Change_Unit is authored in its own git worktree under `~/crgomez-ops/worktrees/<branch>`, for both `crgomez/AmplifyAppResume` and `crgomez/Terraform-CF-WAF`. Authoring tasks commit locally and do not push; the "open PR" task rebases, pushes, and opens the pull request.
- **Terraform during authoring.** Terraform 1.5.7: `terraform init -backend=false`, then `terraform validate`, then local scanners only. No `terraform plan` or `apply` against any backend (Requirement 13 criterion 5, design risk R-12).
- **Secrets.** This file names no token, Spacelift External ID or integration ID, presigned URL, version ID, or source IP address. Tasks reference those values by their Operator Records path only.
- **Rollback.** Each `[agent+approval]` and `[operator]` task that can fail names its rollback. Where none is named, Requirement 16 criterion 14 applies: halt, revert a failed Change_Unit, or repeat a failed Operator procedure until its gate passes, and record Run Log RL-HALT.

## Tasks

- [x] 1. Prepare Operator tools and records (no production change)
  - [x] 1.1 [agent] Create the Operator Records and workspace layout
    - Create `~/crgomez-ops/records/`, `records/runlog/`, `records/runlog/templates/`, `records/phase0/`, `records/decisions/`, `~/crgomez-ops/nat/`, `~/crgomez-ops/phase0/`, `~/crgomez-ops/publish/`, `~/crgomez-ops/iam/`, `~/crgomez-ops/worktrees/`, all mode `0700`; confirm `git -C <dir> rev-parse` fails for each, so none is inside a repository
    - Copy each Run Log template from design Appendix A into `records/runlog/templates/<TYPE>.txt`
    - Locate or `gh repo clone` (read-only) `crgomez/Terraform-CF-WAF`; write `records/paths.txt` as shell assignments `AMPLIFY_REPO=<path>` and `CF_REPO=<path>` (written with `printf '%s=%q\n'`)
    - Record versions of `terraform` (1.5.7 available), `/usr/bin/python3` (3.9 or later), `checkov`, `trivy`, `gh` in `records/tools.txt`
    - Alone in its wave: every other preparation task writes into these directories
    - Wave 0 · Depends on: none
    - _Requirements: 1.9, 11.9, 16.15_
    - _Design: Operator CLI sequences (Operator Records); Error Handling (log review helper, `paths.txt`); Appendix A: Run Log › Rules_

  - [x] 1.2 [agent] Write the Negative_Access_Test at `~/crgomez-ops/nat/nat.py`
    - The tool lives outside the repository (design O-3); copy the revised design source verbatim, Python 3 standard library only (O-4)
    - `python3 -m py_compile`; record the file's SHA-256 in `~/crgomez-ops/records/nat-sha256.txt`
    - Exercise the credential guard: with `AWS_PROFILE` set it must refuse to run; under `env -i HOME="$(mktemp -d)" PATH=/usr/bin:/bin /usr/bin/python3 nat.py --help` it must exit 0
    - Stub-test the input checks without network: an empty `legacy_deleted_noncurrent`, an IPv6 source address, and a Cloudflare HTML 403 on the canary must each fail; a version ID containing `+`, `/`, `=` must be sent as `%2B`, `%2F`, `%3D`
    - Do not run it against live endpoints in this task
    - Wave 1 · Depends on: 1.1
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.10, 11.11, 11.12, 11.13, 11.14, 11.15, 11.16_
    - _Design: Negative_Access_Test and Owner_Access_Check › Structure, Assertion matrix by run, Source: `nat.py`_

  - [x] 1.3 [agent] Write the Owner_Access_Check at `~/crgomez-ops/nat/owner_access_check.sh`
    - Copy the design script: `#!/bin/bash`, sources `~/crgomez-ops/lib.sh`, modes `archive` (authenticated `head-object --version-id` for every recorded Legacy_Bucket version) and `full` (archive plus the canary owner GetObject and presigned GET), region through `"${P[@]}"`, temporary directory removed by `trap … EXIT`
    - The presigned URL stays in a shell variable, is never printed, and is unset after use; output names keys but never version IDs; `bash -n` passes
    - Wave 1 · Depends on: 1.1
    - _Requirements: 11.5, 11.13, 11.17, 11.18, 11.19_
    - _Design: Negative_Access_Test and Owner_Access_Check › Owner_Access_Check; open item A-14_

  - [x] 1.4 [agent] Write the shared library and the Phase 0 command files
    - `~/crgomez-ops/lib.sh` as in the design: refuses to run unless `records/config-confirmed.txt` holds the SHA-256 of the current `config.env`; sources `config.env`; builds `P=(--profile "$AWS_PROFILE_NAME" --region "$AWS_REGION")`; calls `aws sts get-caller-identity "${P[@]}" --output json` and aborts unless `Account` equals `EXPECTED_ACCOUNT_ID`
    - In `~/crgomez-ops/phase0/`, one file per step, each with the design header (`. ~/crgomez-ops/lib.sh`, `B=crgomez.com`, fixed `REC=~/crgomez-ops/records/phase0`): `10-baseline.sh` (writes exactly `baseline-acl.json`, `baseline-policy.json`, `baseline-pab.txt`, `baseline-versions.json`, `baseline-owners.json`, all JSON captures with `--output json`), `20-ownership.sh` (bucket owner and object owners against `EXPECTED_CANONICAL_ID`), `30-pab.sh`, `40-policy.sh` (writes `$REC/interim-policy.json` verbatim, then applies it), `50-acl.sh` (capture the grant URIs, then branch), `60-dispositions.sh`, `70-precondition.sh`, `80-delete.sh` (asserts the probe version ID is non-empty and not `None`; sends it with `curl --get --data-urlencode "versionId=$V"`), `85-record.sh` (writes `records/nat-inputs.json`), `90-restore.sh` (deletes the Public Access Block, polls `get-public-access-block` until `NoSuchPublicAccessBlockConfiguration` with at most 10 attempts 2 seconds apart, then restores policy and ACL from the same baseline filenames)
    - `~/crgomez-ops/phase0/verify.sh` as a standalone `#!/bin/bash` script run as `bash ~/crgomez-ops/phase0/verify.sh <step>`, not a sourced function: parses each spec with `read -r key ctype size <<< "$spec"`, records a curl failure as `curl-error <status>` instead of aborting, and checks and logs all three objects even when one fails
    - Every gate is capture-then-branch and every file ends with an explicit success line; `bash -n` every file
    - Stub-test with a fake `aws` and `curl` on `PATH`: `50-acl.sh` exits 0 when no group grant remains and 1 when one does; `verify.sh` logs `curl-error` for a failing object and still checks the other two. Execute none of the files against AWS in this task
    - Wave 1 · Depends on: 1.1
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.5, 2.7, 2.8_
    - _Design: Operator CLI sequences › Operator configuration and shared library, Phase 0: interim lockdown (Requirement 1), Phase 0: deletions (Requirement 2)_

  - [x] 1.5 [agent] Write the Publish_Workflow helpers in `~/crgomez-ops/publish/`
    - `fetch-legacy.sh <src_key> <local_file> <expected_size>`: download from Legacy_Bucket, check the size, log the source SHA-256 in hex and base64 to `~/crgomez-ops/records/migration.log`
    - `put.sh <local_file> <dst_key> <content_type> <cache_control> <expected_size> [content_disposition]`: takes a local file, so the same helper serves the Phase 2 migration and later publishes; size check, SHA-256 upload checksum, explicit `Content-Type`, `Cache-Control`, and (resume only) `Content-Disposition`; logs hex and base64 SHA-256 and a `head-object` read-back including `ChecksumSHA256` and `VersionId`
    - `migrate.sh` (Phase 2 step 2: PAB gate, three downloads, three uploads, canary upload and read-back), `record-version.sh` (version ID before a replacement), and `rollback.sh` (copy a recorded, URL-encoded version back to the same key)
    - Every script sources `~/crgomez-ops/lib.sh`; header comment carries Publish_Workflow steps 1 to 7 and the staleness table from the design; `bash -n` passes
    - Wave 1 · Depends on: 1.1
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 9.1, 9.4, 9.8, 9.9, 9.10, 16.10_
    - _Design: Operator CLI sequences › Phase 2 step 2: content migration, Publish_Workflow (Requirement 9)_

  - [x] 1.6 [agent+approval] Write and confirm `~/crgomez-ops/config.env`
    - This task changes no production resource, but it requires the owner's confirmation of the values before Phase 0 may use them: a guard is only meaningful if a human confirmed what it expects
    - Ask the owner which AWS profile to use (the reviewed design used `starscream`); write `~/crgomez-ops/config-write.sh` from the design and run `bash ~/crgomez-ops/config-write.sh <profile>`. It takes `EXPECTED_ACCOUNT_ID` from a live `aws sts get-caller-identity --output json` and `EXPECTED_CANONICAL_ID` from a live `aws s3api get-bucket-acl --bucket crgomez.com --output json` (`Owner.ID`), sets `AWS_REGION=us-west-2`, writes the file with mode `0600`, and prints it
    - Stop and request confirmation: display `AWS_PROFILE_NAME`, the `Account` and `Arn` returned live, and `EXPECTED_CANONICAL_ID`; the owner confirms in chat that this is the intended account and bucket owner
    - After confirmation only, write `records/config-confirmed.txt` with the file's SHA-256 and the UTC time; until it exists, `lib.sh` refuses to run. Any later edit to `config.env` requires repeating this task
    - Rollback: delete `config.env` and `config-confirmed.txt`
    - Wave 1 · Depends on: 1.1
    - _Requirements: 1.5, 1.9, 16.4_
    - _Design: Owner-overridable design decisions › O-13; Operator CLI sequences › Operator configuration and shared library_

- [x] 2. Author the Change_Units (preparation, no production change)
  - [x] 2.1 [agent] Author CU-A1 (AWS state migration) on branch `cu-a1-state-migration` from `master`
    - Write `tf-files/main.tf`, `tf-files/var.tf`, and `tf-files/s3.tf` as in the design: `aws ~> 6.0`, provider `allowed_account_ids = [var.aws_account_id]`, `variable "aws_account_id"` (12-digit validation, no default), no `aws_caller_identity` data source, no `backend` block, `acl_value` and the inline `acl` removed, the `moved` block to `aws_s3_bucket_policy.legacy_interim`, and the interim policy data source
    - Generate `tf-files/.terraform.lock.hcl` with `terraform providers lock -platform=linux_amd64 -platform=darwin_arm64`; `terraform init -backend=false`, then `terraform validate` passes
    - `grep -rn public-read tf-files/` returns nothing; no account ID literal is committed; the diff touches only `tf-files/`
    - Follows the design default for decision 4.2; task 6.4 reconciles it if the owner chooses otherwise
    - Wave 1 · Depends on: 1.1
    - _Requirements: 13.1, 13.2, 13.5, 13.12, 15.15, 16.2, 16.7_
    - _Design: Terraform_AWS by Change_Unit › CU-A1; O-13_

  - [x] 2.2 [agent] Author CU-A2 (imports) on branch `cu-a2-imports`, based on `cu-a1-state-migration`
    - Add the Legacy_Bucket Public Access Block (interim values), the standalone `private` ACL, and the `depends_on` to `tf-files/s3.tf`; add `tf-files/imports.tf` (six `import` blocks with literal IDs), `tf-files/spacelift-iam.json`, and `tf-files/iam_spacelift.tf` reading that JSON file
    - `spacelift_aws_account_id` and both External IDs are variables with no default; integration-role ARNs use `var.aws_account_id`; no account ID, Spacelift principal, or External ID literal is committed (design O-13)
    - Write `~/crgomez-ops/iam/render-iam.py` from the design, outside the repository; smoke-test it with placeholder 12-digit values into a temporary directory and confirm it reads the role names, buckets, and action lists from `spacelift-iam.json` rather than its own copy
    - `terraform init -backend=false`, then `terraform validate` passes; the diff adds no resource outside the import set
    - Wave 2 · Depends on: 2.1
    - _Requirements: 13.4, 15.6, 15.7, 15.8, 15.9, 15.10, 16.5_
    - _Design: Terraform_AWS by Change_Unit › CU-A2 (how the bootstrap documents match the imports); Data Models › `tf-files/spacelift-iam.json`_

  - [x] 2.3 [agent] Author CU-A3 (Content_Bucket and Log_Bucket) on branch `cu-a3-content-buckets`, based on `cu-a2-imports`
    - Add `content_bucket_name` and `log_bucket_name` to `tf-files/var.tf`; write `tf-files/s3_content.tf` (no bucket policy) and `tf-files/s3_logs.tf` as in the design, with `aws:SourceAccount` from `var.aws_account_id`
    - `terraform init -backend=false`, then `terraform validate` passes; run `checkov` and `trivy` on `tf-files/` and save output to `~/crgomez-ops/records/scan-cu-a3.txt`
    - Wave 3 · Depends on: 2.2
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9, 3.10, 13.2, 13.9_
    - _Design: Terraform_AWS by Change_Unit › CU-A3_

  - [x] 2.4 [agent] Author CU-A4 (Content_Bucket policy and delivery checks) on branch `cu-a4-content-policy`, based on `cu-a3-content-buckets`
    - Write `tf-files/published-documents.json` and `tf-files/cloudflare-ipv4.json` as in Data Models; fetch `https://www.cloudflare.com/ips-v4` and record in `~/crgomez-ops/records/ips-v4-authoring.txt` whether the set equals the 15 committed prefixes
    - Add the `locals`, `aws_s3_bucket_policy.content` with its five preconditions (key count, key shape, duplicates, Canary_Object exclusion, allowlist with `try(tonumber(split("/", p)[1]) >= 8, false)`), and the policy document to `tf-files/s3_content.tf`
    - Write `.github/workflows/delivery-checks.yml` as in the design: explicit per-job `GITHUB_TOKEN` permissions, no third-party action, no AWS or Cloudflare credential, exact-title issue matching through `jq --arg`, a descriptive `User-Agent` in the synthetic check, and the `ips-v4` URL unchanged
    - `terraform init -backend=false`, then `terraform validate` passes; scanners saved to `~/crgomez-ops/records/scan-cu-a4.txt`; the diff is limited to `tf-files/` and that workflow file
    - Wave 4 · Depends on: 2.3
    - _Requirements: 4.11, 5.1, 5.2, 5.3, 5.4, 5.7, 5.11, 5.13, 5.15, 5.16, 5.17, 5.18, 5.19, 10.9, 10.10, 10.11, 14.2, 14.3, 14.4, 16.2_
    - _Design: Terraform_AWS by Change_Unit › CU-A4; Delivery-checks workflow; Data Models_

  - [x] 2.5 [agent] Author CU-A5 (Legacy_Bucket final lockdown) on branch `cu-a5-legacy-lockdown`, based on `cu-a4-content-policy`
    - In `tf-files/s3.tf` delete `aws_s3_bucket_policy.legacy_interim`, its data source, and the `moved` block; set all four Legacy Public Access Block flags to `true`; keep the `private` ACL resource
    - `terraform init -backend=false`, then `terraform validate` passes; scanners saved to `~/crgomez-ops/records/scan-cu-a5.txt`, expected to show only the permitted set
    - Wave 5 · Depends on: 2.4
    - _Requirements: 8.3, 13.3, 13.6, 13.7_
    - _Design: Terraform_AWS by Change_Unit › CU-A5_

  - [x] 2.6 [agent] Author CU-C1 (Cloudflare migration) in `Terraform-CF-WAF` on branch `cu-c1-spacelift-migration` from `main`
    - Rewrite `cloudflare.tf` as in the design (no `cloud` block, `cloudflare >= 4.52, < 5.0`, `locals`); generate `.terraform.lock.hcl`
    - Delete the GitHub Actions workflow that runs `terraform apply -auto-approve`
    - Confirm no committed `.tf` file references a variable declared only in the gitignored `var.tf`; `cloudflare_ruleset.tf` is unchanged
    - `terraform init -backend=false`, then `terraform validate` passes
    - Wave 1 · Depends on: 1.1 (uses `CF_REPO` from `records/paths.txt`)
    - _Requirements: 6.2, 12.4, 15.15, 15.21, 16.8_
    - _Design: Repository B layout › CU-C1_

  - [x] 2.7 [agent] Author CU-C2 (SSL/TLS mode alone) on branch `cu-c2-ssl-strict`, based on `cu-c1-spacelift-migration`
    - Add `zone_ssl.tf` with `cloudflare_zone_settings_override` (`ssl = "strict"`, `ssl_automatic_mode = "custom"`); the diff contains no other file
    - `terraform init -backend=false`, then `terraform validate` passes
    - Wave 2 · Depends on: 2.6
    - _Requirements: 6.7_
    - _Design: Repository B layout › CU-C2_

  - [x] 2.8 [agent] Author CU-C3 (delivery path) on branch `cu-c3-delivery-path`, based on `cu-c2-ssl-strict`
    - Add `delivery.tf`: the `field` record, `cloudflare_cloud_connector_rules`, the cache-settings ruleset (`status_code_ttl` `-1` for 400 to 599), and the response-header transform
    - Confirm the record and the connector name the non-dualstack origin, no `http_request_origin` ruleset is declared, and no geo-block skip rule is added
    - `terraform init -backend=false`, then `terraform validate` passes
    - Wave 3 · Depends on: 2.7
    - _Requirements: 5.12, 6.1, 6.2, 6.3, 6.8, 6.9, 6.10, 12.4_
    - _Design: Repository B layout › CU-C3_

  - [x] 2.9 [agent] Author CU-G1 (`tf-gate` workflow) on branch `cu-g1-tf-gate` from `master`
    - Add `.github/workflows/tf-gate.yml` as in the design: top-level `permissions: {}`, job permissions `pull-requests: read`, `checks: read`, `statuses: read`, no third-party action; the changed-file list is captured before it is tested; the newest check run is selected with `jq --arg c "$CHECK"` and `max_by(.id)`; `neutral`, `skipped`, `stale`, `cancelled`, and `timed_out` fail at once
    - Parse the YAML locally and `bash -n` the extracted `run` script; stub-test with a fake `gh` on `PATH`: a Site-only file list passes, a failing `gh` call fails, and a `neutral` newest conclusion fails; the diff contains only that file
    - Wave 1 · Depends on: 1.1 (follows the design default for decision 4.3)
    - _Requirements: 15.23, 15.24_
    - _Design: Branch protection and the tf-gate workflow; open item A-2_

  - [x] 2.10 [agent] Author CU-S1 (Site repoint) on branch `cu-s1-site-repoint` from `master`
    - Confirm exactly seven occurrences of `https://s3.us-west-2.amazonaws.com/crgomez.com/` in `index.html`, then apply the design's replacement script
    - Search `index.html`, `minimalist-sample.html`, `css/`, and `js/` for `s3.us-west-2.amazonaws.com` and require zero hits
    - `git diff --word-diff` shows only URL values changed (`rel=icon`, `target="_blank"` intact, no `download` attribute, `?v=` kept on `css/` and `js/` references); no file under `tf-files/` changes
    - Wave 1 · Depends on: 1.1
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.8, 16.3_
    - _Design: Operator CLI sequences › Site repoint (Requirement 7)_

- [x] 3. Phase 0: interim lockdown and soft deletion (AWS CLI, strictly sequential)
  - [x] 3.1 [agent] Capture the pre-lockdown baseline of Legacy_Bucket (read-only)
    - Run `bash ~/crgomez-ops/phase0/10-baseline.sh`; it writes `baseline-acl.json`, `baseline-policy.json`, `baseline-pab.txt` (expected `NoSuchPublicAccessBlockConfiguration`), `baseline-versions.json`, and `baseline-owners.json` into `~/crgomez-ops/records/phase0/`, the same names `90-restore.sh` reads
    - Confirm each file is non-empty and that `sha256-baseline.txt` lists all five
    - Wave 2 · Depends on: 1.4, 1.6
    - _Requirements: 1.9, 2.8_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`10-baseline.sh`)_

  - [x] 3.2 [agent] Confirm Retained_Objects ownership
    - Run `bash ~/crgomez-ops/phase0/20-ownership.sh`; the bucket owner and every Retained_Object owner must equal `EXPECTED_CANONICAL_ID`
    - On any mismatch, stop the interim lockdown before any mutation and record RL-HALT
    - Wave 3 · Depends on: 3.1
    - _Requirements: 1.5_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`20-ownership.sh`)_

  - [x] 3.3 [agent+approval] Apply the interim Public Access Block to Legacy_Bucket
    - Stop and request confirmation: `put-public-access-block` on bucket `crgomez.com`, values `BlockPublicAcls=true, IgnorePublicAcls=true, BlockPublicPolicy=false, RestrictPublicBuckets=false`; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Run `bash ~/crgomez-ops/phase0/30-pab.sh`
    - Rollback: task 3.9
    - Wave 4 · Depends on: 3.2
    - _Requirements: 1.2, 1.8_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`30-pab.sh`)_

  - [x] 3.4 [agent] Verify the Retained_Objects after the Public Access Block
    - Run `bash ~/crgomez-ops/phase0/verify.sh after-pab`: HTTP 200, expected `Content-Type`, and 482437, 1112252, 15651 bytes; also confirm anonymous `ListBucketVersions` now returns 403
    - On any failure, dispatch task 3.9 at once and halt
    - Wave 5 · Depends on: 3.3
    - _Requirements: 1.6, 1.7_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`verify.sh`)_

  - [x] 3.5 [agent+approval] Replace the Legacy_Bucket policy with the interim key-scoped policy
    - Stop and request confirmation: `put-bucket-policy` on bucket `crgomez.com`, granting `s3:GetObject` on the three Retained_Objects keys only; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Run `bash ~/crgomez-ops/phase0/40-policy.sh`, which first requires `IgnorePublicAcls` to read `True`; the verbatim policy stays at `records/phase0/interim-policy.json` for Requirement 8 criterion 1
    - Rollback: task 3.9
    - Wave 6 · Depends on: 3.4
    - _Requirements: 1.3, 1.8, 8.1_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`40-policy.sh`)_

  - [x] 3.6 [agent] Verify the Retained_Objects after the policy replacement
    - Run `bash ~/crgomez-ops/phase0/verify.sh after-policy`; confirm anonymous `ListBucket` and `ListBucketVersions` both return 403
    - On any failure, dispatch task 3.9 at once and halt
    - Wave 7 · Depends on: 3.5
    - _Requirements: 1.4, 1.6, 1.7_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`verify.sh`)_

  - [x] 3.7 [agent+approval] Set the Legacy_Bucket ACL to `private`
    - Stop and request confirmation: `put-bucket-acl --acl private` on bucket `crgomez.com`; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Run `bash ~/crgomez-ops/phase0/50-acl.sh`; it captures the grant URIs and exits 0 only when no `AllUsers` or `AuthenticatedUsers` grant remains
    - Rollback: task 3.9
    - Wave 8 · Depends on: 3.6
    - _Requirements: 1.1, 1.8_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`50-acl.sh`)_

  - [x] 3.8 [agent] Verify the Retained_Objects after the ACL change
    - Run `bash ~/crgomez-ops/phase0/verify.sh after-acl`; all three pass; `verify.log` now holds three passing verification points
    - On any failure, dispatch task 3.9 at once and halt
    - Wave 9 · Depends on: 3.7
    - _Requirements: 1.6, 1.7_
    - _Design: Operator CLI sequences › Phase 0: interim lockdown (`verify.sh`)_

  - [x] 3.9 [agent+approval] Conditional: restore the baseline authorization state of Legacy_Bucket
    - Runs only if 3.4, 3.6, or 3.8 failed, in which case it is dispatched immediately and the sequence halts; on the normal path it is closed as not required in its wave
    - Stop and request confirmation: delete the Public Access Block, then restore the baseline policy and ACL on bucket `crgomez.com`; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Run `bash ~/crgomez-ops/phase0/90-restore.sh` (polls until the Public Access Block is gone, at most 10 attempts 2 seconds apart), then `bash ~/crgomez-ops/phase0/verify.sh after-restore`; draft RL-RESTORE with the mutation step, key, observed status, `Content-Type`, body length, UTC time, and post-restore result
    - Wave 10 · Depends on: 3.8
    - _Requirements: 1.7, 16.14_
    - _Design: Operator CLI sequences › Phase 0 (`90-restore.sh`); open item A-13; Error Handling_

  - [x] 3.10 [agent] Record dispositions and the pre-existing noncurrent versions
    - Run `bash ~/crgomez-ops/phase0/60-dispositions.sh`: `retain` for `crgomez-seceng-ir.pdf`, `delete` for the other five; every pre-existing noncurrent key and version ID goes to `records/phase0/preexisting-noncurrent.json`, and the script stops if there is none
    - Wave 11 · Depends on: 3.8, 3.9
    - _Requirements: 2.5, 2.8_
    - _Design: Operator CLI sequences › Phase 0: deletions_

  - [x] 3.11 [agent] Re-read the deletion preconditions
    - Run `bash ~/crgomez-ops/phase0/70-precondition.sh`: versioning `Enabled` and `IgnorePublicAcls` `True`; the UTC time goes to `records/phase0/safety-read-at.txt` and the epoch to `safety-read-epoch.txt`
    - Task 3.12 must start within 60 minutes of this read; `80-delete.sh` refuses an older read
    - Wave 12 · Depends on: 3.10
    - _Requirements: 2.2_
    - _Design: Operator CLI sequences › Phase 0: deletions_

  - [x] 3.12 [agent+approval] Soft-delete the five Unreferenced_Objects
    - Stop and request confirmation: five key-only `delete-object` requests (no version ID) on bucket `crgomez.com`, keys `unpublished-variant-a.pdf`, `IMG.png`, `city.png`, `patern.png`, `snapseed.png`; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Run `bash ~/crgomez-ops/phase0/80-delete.sh`: delete `patern.png` first, require a non-empty prior version ID, and require an anonymous version-specific GET of it (sent with `--data-urlencode`) to return 403; then delete the other four; the real key behind `unpublished-variant-a.pdf` is passed as one quoted literal key
    - Rollback: if the probe is not 403 or the version ID is missing, issue no further deletes and leave the markers (Requirement 2 criterion 7); recover any object by copying its recorded version back to the same key (Requirement 2 criterion 6)
    - Wave 13 · Depends on: 3.11
    - _Requirements: 2.1, 2.4, 2.6, 2.7_
    - _Design: Operator CLI sequences › Phase 0: deletions (`80-delete.sh`)_

  - [x] 3.13 [agent] Record the noncurrent version IDs and write the Negative_Access_Test inputs
    - Run `bash ~/crgomez-ops/phase0/85-record.sh`; it confirms a current delete marker for each of the five keys, matches the real key behind `unpublished-variant-a.pdf` as one key, and writes `~/crgomez-ops/records/nat-inputs.json` with five `legacy_deleted_noncurrent` entries, the `legacy_preexisting_noncurrent` entries from 3.10, and an empty `content_current_versions`
    - Wave 14 · Depends on: 3.12
    - _Requirements: 2.3, 2.8_
    - _Design: Operator CLI sequences › Phase 0: deletions (`85-record.sh`); Data Models › Negative_Access_Test inputs_

  - [x] 3.14 [agent] Run the first Negative_Access_Test (`post-phase0`, Legacy_Bucket assertions only) and the archive check
    - `env -i HOME="$(mktemp -d)" PATH=/usr/bin:/bin /usr/bin/python3 ~/crgomez-ops/nat/nat.py --phase post-phase0 --run-label post-phase0 --repo "$AMPLIFY_REPO" --inputs ~/crgomez-ops/records/nat-inputs.json --out ~/crgomez-ops/records/nat-post-phase0.json` (`AMPLIFY_REPO` from `records/paths.txt`)
    - `bash ~/crgomez-ops/nat/owner_access_check.sh archive`: every recorded noncurrent version exists (design open item A-14)
    - Exit status 0 is required from both; a non-zero exit halts the sequence (Requirement 16 criterion 14); draft RL-NAT-001
    - Wave 15 · Depends on: 3.13, 1.2, 1.3
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.9, 11.13, 11.16, 16.4_
    - _Design: Negative_Access_Test and Owner_Access_Check › Assertion matrix by run, Owner_Access_Check_

- [x] 4. Owner decisions (block only their dependents)
  - [x] 4.1 [operator] Decide the GitHub plan for the private `Terraform-CF-WAF` repository
    - Branch protection on a private repository needs GitHub Pro or higher (design A-3, R-10). Options: upgrade to Pro; make the repository public after review; or accept Spacelift run confirmation as that repository's only gate. The design states no default
    - Record the answer in `~/crgomez-ops/records/decisions/github-plan.md`
    - Blocks tasks 6.2 and 6.3 (DOC-1 fold-in of A-3) and 7.25
    - Wave 15 · Depends on: none
    - _Requirements: 15.23_
    - _Design: Open items requiring a requirements amendment › A-3_

  - [x] 4.2 [operator] Decide the Spacelift workflow tool
    - Default: Terraform FOSS 1.5.7 with the `moved` block in CU-A1 (design O-2, A-1). Alternative: OpenTofu, which supports `removed` blocks
    - Record the answer in `~/crgomez-ops/records/decisions/workflow-tool.md`
    - Blocks tasks 6.1 and 6.3 (A-1), 6.4 (reconcile), and stack creation (7.4, 7.17)
    - Wave 15 · Depends on: none
    - _Requirements: 13.12, 16.7_
    - _Design: Owner-overridable design decisions › O-2; open item A-1_

  - [x] 4.3 [operator] Decide whether to accept the CU-G1 `tf-gate` Change_Unit
    - Default: add CU-G1 (design A-2), because Spacelift posts no status for a pull request it ignores on the Free plan
    - Record the answer in `~/crgomez-ops/records/decisions/tf-gate.md`
    - Blocks tasks 6.1 and 6.3 (A-2), 6.4 (reconcile), 7.21, and 7.24
    - Wave 15 · Depends on: none
    - _Requirements: 15.24, 16.2_
    - _Design: Branch protection and the tf-gate workflow; open item A-2_

  - [x] 4.4 [operator] Confirm decisions D-1, D-2, and D-3
    - Defaults: D-1 remediate `CKV_AWS_300` and accept nothing else new, re-running scanners on the CU-A3 and CU-A4 plans; D-2 accept `AWS-0089` scoped to Log_Bucket; D-3 keep "no `iam:*`" on Apply_Role, with the amendment contingency if the first apply fails on an IAM read
    - Record the answers in `~/crgomez-ops/records/decisions/d1-d3.md`
    - Blocks tasks 6.1 and 6.3 (A-7, decisions), 7.13 (first apply that reads the imported roles, D-3), and 17.1 (Scanner_Gate)
    - Wave 15 · Depends on: none
    - _Requirements: 13.7, 13.9, 15.9_
    - _Design: Owner decisions still open (pending) › D-1, D-2, D-3_

- [x] 5. [agent] Checkpoint - Phase 0 gate (Requirement 16 criterion 4)
  - Ensure all tests pass, ask the user if questions arise.
  - Gate: `verify.log` shows three passing verification points, the Requirement 2 criterion 3 record exists for all five keys, `nat-post-phase0.json` reports exit 0, and the `archive` Owner_Access_Check passed
  - Wave 16
  - _Requirements: 16.4_

- [ ] 6. Fold the open items into the requirements (DOC-1)
  - [-] 6.1 [agent] Fold open items for Requirements 1, 11, 13, and 16 into `requirements.md`
    - Work in worktree `doc-1-amendments` from `master`; apply the answers from tasks 4.2, 4.3, and 4.4
    - Fold A-1, A-2, A-6, A-7, A-9, A-13, and A-14; amend criteria in place and keep existing criterion numbers stable; append any new criterion at the end of its requirement
    - Run `validate_spec_format` on `requirements.md` until it reports no errors; do not commit (task 6.5 commits)
    - Wave 17 · Depends on: 5, 4.2, 4.3, 4.4
    - _Requirements: 1.7, 11.5, 11.13, 11.17, 11.18, 13.6, 13.7, 13.9, 13.12, 16.1, 16.2, 16.5, 16.6, 16.7_
    - _Design: Open items requiring a requirements amendment › A-1, A-2, A-6, A-7, A-9, A-13, A-14_

  - [ ] 6.2 [agent] Fold open items for Requirement 15 into `requirements.md`
    - In the same worktree, after 6.1: apply the answer from task 4.1 and fold A-3, A-4, A-5, A-8, A-10, and A-12
    - Do not fold A-11: it is deferred unless decision D-3 fails at the first confirmed AWS_Stack apply (task 7.13), in which case DOC-2 (task 17.3) folds it
    - Run `validate_spec_format` on `requirements.md` until it reports no errors; do not commit
    - Wave 18 · Depends on: 6.1, 4.1
    - _Requirements: 15.2, 15.4, 15.13, 15.14, 15.20, 15.23_
    - _Design: Open items requiring a requirements amendment › A-3, A-4, A-5, A-8, A-10, A-11, A-12_

  - [-] 6.3 [agent] Update `design.md` with the decisions and the Phase 0 Run Log summaries
    - In the same worktree: mark D-1 to D-3 decided, record the outcomes of 4.1 to 4.3, and add the RL-NAT-001 summary (and RL-RESTORE if 3.9 ran) under Appendix A › Entries
    - Follow the Appendix A rules: no version IDs, source address, account or canonical ID, or raw output
    - Run `validate_spec_format` on `design.md`; do not commit
    - Wave 17 · Depends on: 5, 4.1, 4.2, 4.3, 4.4
    - _Requirements: 1.7, 11.9, 16.15_
    - _Design: Owner decisions still open; Appendix A: Run Log_

  - [-] 6.4 [agent] Reconcile the authored Change_Units with the recorded decisions
    - If 4.2 chose OpenTofu: replace the CU-A1 `moved` construct with a `removed` block plus the interim policy declaration, adjust `required_version`, and re-validate CU-A1 to CU-A5
    - If 4.3 rejected CU-G1: drop `cu-g1-tf-gate` and record the replacement mechanism for Requirement 15 criterion 24
    - If every default was accepted, record "no change" in `~/crgomez-ops/records/decisions/reconcile.md`
    - Wave 17 · Depends on: 5, 4.2, 4.3
    - _Requirements: 13.12, 15.24, 16.7_
    - _Design: Owner-overridable design decisions › O-2; open items A-1, A-2_

  - [ ] 6.5 [agent+approval] Commit and open the DOC-1 pull request
    - Stop and request confirmation: push branch `doc-1-amendments` to the public repository `crgomez/AmplifyAppResume` and open a pull request against `master`; show the diff first and confirm it holds no identifier the Appendix A rules exclude
    - The diff is limited to `.kiro/specs/cloudflare-s3-asset-delivery/`; commit, push, and `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 19 · Depends on: 6.2, 6.3
    - _Requirements: 16.1_
    - _Design: Open items › A-9_

  - [ ] 6.6 [operator] Merge DOC-1
    - Rollback: revert the merge commit
    - Wave 20 · Depends on: 6.5
    - _Requirements: 16.1_
    - _Design: Open items › A-9_

- [ ] 7. Phase 1: Spacelift foundation and state migration (Requirement 16 criterion 6)
  - [ ] 7.1 [operator] Verify the Spacelift Free-plan capabilities
    - Check each capability in Requirement 15 criterion 27 in the Spacelift UI; draft RL-FREE
    - If any capability is unavailable, stop before migrating any state and record which one (Requirement 15 criterion 28)
    - Wave 21 · Depends on: 6.6
    - _Requirements: 15.27, 15.28_
    - _Design: Spacelift Free-plan verdicts_

  - [ ] 7.2 [agent+approval] Harden Legacy_State_Bucket before the state migration
    - Record the current Public Access Block flags and default encryption of `crgomez.com-state` (`--output json`) in `~/crgomez-ops/records/state-bucket-before.txt`
    - Stop and request confirmation: set all four Public Access Block flags `true` and default `AES256` where missing on bucket `crgomez.com-state`; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Rollback: restore the recorded values (delete the Public Access Block if none existed)
    - Wave 22 · Depends on: 7.1
    - _Requirements: 15.18_
    - _Design: Phase 1 step 1: bootstrap, step 2_

  - [ ] 7.3 [agent] Snapshot the AWS state (read-only)
    - Copy `s3://crgomez.com-state/crgomez/terraform.tfstate` to `~/crgomez-ops/records/aws.tfstate` with `"${P[@]}"`; record `serial`, `lineage`, `terraform_version`
    - From this point no one runs `terraform` against the S3 backend; record the snapshot time
    - Wave 23 · Depends on: 7.2
    - _Requirements: 15.16_
    - _Design: Phase 1 step 1: bootstrap, step 3; risk R-12_

  - [ ] 7.4 [operator] Create AWS_Stack with the imported state
    - Use the Spacelift configuration table: `crgomez/AmplifyAppResume`, `master`, project root `tf-files/`, workflow tool per 4.2, autodeploy off, labels, Spacelift-managed state imported from `records/aws.tfstate`
    - Set the non-secret stack variable `TF_VAR_aws_account_id` to `EXPECTED_ACCOUNT_ID` from `config.env`
    - Rollback: delete the stack; the S3 backend stays authoritative (Requirement 15 criterion 17)
    - Wave 24 · Depends on: 7.3, 4.2
    - _Requirements: 15.1, 15.3, 15.5, 15.12, 15.14, 15.15, 15.16_
    - _Design: Spacelift configuration; Phase 1 step 1: bootstrap, step 4; open item A-6; O-13_

  - [ ] 7.5 [operator] Create the two AWS integrations in Spacelift and record Spacelift's AWS principal
    - `crgomez-aws-plan` naming `spacelift-crgomez-plan` and `crgomez-aws-apply` naming `spacelift-crgomez-apply`; read each External ID from the attach dialog into `~/crgomez-ops/records/spacelift-external-ids.txt` as `plan=<id>` and `apply=<id>`
    - Read the AWS principal account shown on the Spacelift integration screen into `~/crgomez-ops/records/spacelift-principal.txt` (it differs between `spacelift.io` and `us.spacelift.io` tenants and is never assumed), and set it as the non-secret AWS_Stack variable `TF_VAR_spacelift_aws_account_id`, before task 7.6 renders the trust policies
    - Rollback: delete the integrations and the variable
    - Wave 25 · Depends on: 7.4
    - _Requirements: 15.6, 15.7_
    - _Design: Phase 1 step 1: bootstrap, step 5; research finding 6_

  - [ ] 7.6 [agent] Render the integration role documents mechanically into Operator Records
    - Mechanism: `~/crgomez-ops/iam/render-iam.py` reads `tf-files/spacelift-iam.json` from the `cu-a2-imports` worktree, the same file `iam_spacelift.tf` reads, so no policy is translated by hand: `python3 ~/crgomez-ops/iam/render-iam.py --repo ~/crgomez-ops/worktrees/cu-a2-imports --account-id "$EXPECTED_ACCOUNT_ID" --spacelift-principal-file ~/crgomez-ops/records/spacelift-principal.txt --external-ids-file ~/crgomez-ops/records/spacelift-external-ids.txt --out ~/crgomez-ops/records`
    - It writes `plan-trust.json`, `apply-trust.json`, `plan-policy.json`, `apply-policy.json` with mode `0600`
    - Check: Plan_Role holds only Read and List actions plus the four IAM read actions; Apply_Role holds no object ARN, no `iam:*`, and no wildcard resource; both trust policies name the principal from 7.5
    - Wave 26 · Depends on: 7.5, 2.2
    - _Requirements: 15.7, 15.8, 15.9_
    - _Design: CU-A2 (how the bootstrap documents match the imports); Rendered policies (trust policy shape)_

  - [ ] 7.7 [agent+approval] Bootstrap Plan_Role and Apply_Role by AWS CLI
    - Stop and request confirmation: create IAM roles `spacelift-crgomez-plan` and `spacelift-crgomez-apply` with inline policies `terraform-aws-plan` and `terraform-aws-apply`; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Run the design bootstrap commands (which source `lib.sh`) with the files from 7.6
    - Rollback: `delete-role-policy` then `delete-role` for both roles
    - Wave 27 · Depends on: 7.6
    - _Requirements: 15.10_
    - _Design: Phase 1 step 1: bootstrap, step 6_

  - [ ] 7.8 [operator] Attach the integrations and set the secret stack variables
    - Attach `crgomez-aws-plan` as read only and `crgomez-aws-apply` as write only; Spacelift's assume-role test must pass
    - Set `TF_VAR_spacelift_plan_external_id` and `TF_VAR_spacelift_apply_external_id` as secret stack variables; confirm AWS_Stack carries the four `TF_VAR_` variables and no static AWS key in any stack variable or context
    - Rollback: detach the integrations
    - Wave 28 · Depends on: 7.7
    - _Requirements: 15.6_
    - _Design: Phase 1 step 1: bootstrap, steps 7 and 8_

  - [ ] 7.9 [agent+approval] Open the CU-A1 pull request
    - Stop and request confirmation: push branch `cu-a1-state-migration` to `crgomez/AmplifyAppResume` and open a pull request against `master`; this starts an AWS_Stack Proposed_Run with Plan_Role
    - Rebase onto `master`, `terraform init -backend=false`, re-run `terraform validate`, push, `gh pr create`; wait for the AWS_Stack Proposed_Run status
    - Rollback: close the pull request and delete the remote branch
    - Wave 29 · Depends on: 7.8, 2.1, 6.4
    - _Requirements: 16.7_
    - _Design: CU-A1; Spacelift run flow_

  - [ ] 7.10 [operator] Review, merge, and confirm CU-A1
    - The Proposed_Run must report 0 to add, 0 to change, 0 to destroy (one move only); record the exact Spacelift check name in `~/crgomez-ops/records/spacelift-check-names.txt`
    - Merge; confirm the tracked run, or use "Trigger with force apply, This run only" if it finishes as a no-op; record which path was taken (risk R-7)
    - Rollback: confirm no tracked run, keep the S3 backend authoritative, and follow the CU-A1 refresh-only note (Requirement 15 criterion 17)
    - Wave 30 · Depends on: 7.9
    - _Requirements: 13.5, 13.12, 15.5, 15.16, 15.17, 16.7_
    - _Design: CU-A1; Spacelift run flow, item 4_

  - [ ] 7.11 [agent] Verify the CU-A1 gate
    - Read back the Legacy_Bucket policy (equal to `records/phase0/interim-policy.json`), Public Access Block (interim values), and ACL (`private`); confirm the 7.10 record shows zero change and the move persisted
    - Record the UTC date of this verification in `~/crgomez-ops/records/state-migration-verified.txt`; it starts the 30-day clock for task 19.1
    - Wave 31 · Depends on: 7.10
    - _Requirements: 15.16, 15.19, 16.7_
    - _Design: Phase and Change_Unit map (CU-A1 gate)_

  - [ ] 7.12 [agent+approval] Open the CU-A2 pull request
    - Stop and request confirmation: push branch `cu-a2-imports` to `crgomez/AmplifyAppResume` and open a pull request against `master`; this starts an AWS_Stack Proposed_Run with Plan_Role
    - Rebase onto `master` after CU-A1, `terraform init -backend=false`, re-validate, push, `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 31 · Depends on: 7.10, 2.2
    - _Requirements: 16.5_
    - _Design: CU-A2_

  - [ ] 7.13 [operator] Review, merge, and confirm CU-A2
    - The Proposed_Run must show six imports and 0 to add, 0 to change, 0 to destroy; merge; confirm or force apply; then trigger a fresh tracked run and record that it finishes with no changes
    - If the apply fails on an IAM read, apply the D-3 contingency out of band under Requirement 15 criterion 11 and record design A-11 for folding in DOC-2 (task 17.3)
    - Rollback: revert CU-A2; for any proposed role change, discard the run and apply with owner credentials (Requirement 15 criterion 11)
    - Wave 32 · Depends on: 7.11, 7.12, 4.4
    - _Requirements: 13.4, 15.10, 15.11, 16.5_
    - _Design: CU-A2; owner decision D-3; open item A-11_

  - [ ] 7.14 [agent] Verify the CU-A2 gate
    - Read back Legacy_Bucket Public Access Block, ACL, and policy (unchanged) and `iam get-role` for both roles; run `bash ~/crgomez-ops/phase0/verify.sh after-cu-a2` on the three Retained_Objects (still HTTP 200)
    - Wave 33 · Depends on: 7.13
    - _Requirements: 13.4, 16.5_
    - _Design: Phase and Change_Unit map (CU-A2 gate)_

  - [ ] 7.15 [operator] Lock the Terraform Cloud workspace and pull its state
    - Lock workspace `terraform-cf-waf` first (design R-12), then in the `Terraform-CF-WAF` clone on `main`: `terraform login`, `terraform init`, `terraform state pull > ~/crgomez-ops/records/cf.tfstate`
    - Rollback: unlock the workspace
    - Wave 34 · Depends on: 7.14
    - _Requirements: 15.16_
    - _Design: Phase 1 step 4: Cloudflare state migration, steps 1 and 2; risk R-12_

  - [ ] 7.16 [operator] Create the Cloudflare API token and the Spacelift context
    - Token scoped to the zone with the crgomez.com zone ID only, with the groups in the design table as amended by DOC-1 (Zone Read included); draft RL-TOKEN with the group names shown in the UI
    - Create context `cloudflare-zone-token` with write-only secret `CLOUDFLARE_API_TOKEN`
    - Rollback: revoke the token and delete the context
    - Wave 35 · Depends on: 7.15
    - _Requirements: 15.20_
    - _Design: Cloudflare API token; open item A-4_

  - [ ] 7.17 [operator] Create Cloudflare_Stack with the imported state
    - `crgomez/Terraform-CF-WAF`, `main`, workflow tool per 4.2, autodeploy off, labels, Spacelift-managed state from `records/cf.tfstate`; attach the context to this stack only; add the dependency on AWS_Stack
    - Rollback: delete the stack and unlock the workspace; Terraform Cloud stays authoritative
    - Wave 36 · Depends on: 7.16, 4.2
    - _Requirements: 15.1, 15.2, 15.5, 15.12, 15.14, 15.15, 15.16_
    - _Design: Spacelift configuration; Phase 1 step 4, step 3_

  - [ ] 7.18 [agent+approval] Open the CU-C1 pull request
    - Stop and request confirmation: push branch `cu-c1-spacelift-migration` to `crgomez/Terraform-CF-WAF` and open a pull request against `main`; this starts a Cloudflare_Stack Proposed_Run that holds the write-capable `CLOUDFLARE_API_TOKEN`
    - Rebase onto `main`, `terraform init -backend=false`, re-validate, push, `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 37 · Depends on: 7.17, 2.6
    - _Requirements: 16.8_
    - _Design: CU-C1_

  - [ ] 7.19 [operator] Review, merge, and verify CU-C1
    - The Proposed_Run must report 0 to add, 0 to change, 0 to destroy; record the Spacelift check name; merge; the tracked run finishes with no changes; confirm GitHub ran no apply workflow for the merge commit
    - Rollback: keep Terraform Cloud authoritative (Requirement 15 criterion 17); revert CU-C1 and unlock the workspace only after the revert merges
    - Wave 38 · Depends on: 7.18
    - _Requirements: 15.16, 15.17, 15.21, 16.8_
    - _Design: Phase 1 step 4, step 4; risk R-12_

  - [ ] 7.20 [operator] Retire the Terraform Cloud apply path
    - Keep workspace `terraform-cf-waf` locked; revoke the Cloudflare token the workspace used; delete the `TF_API_TOKEN` secret from `crgomez/Terraform-CF-WAF`; delete any `cf.tfstate` copy in the clone directory (the Operator Records copy stays)
    - Wave 39 · Depends on: 7.19
    - _Requirements: 15.22_
    - _Design: Phase 1 step 4, step 5_

  - [ ] 7.21 [agent+approval] Open the CU-G1 pull request
    - Stop and request confirmation: push branch `cu-g1-tf-gate` to `crgomez/AmplifyAppResume` and open a pull request against `master`; the change is outside `tf-files/`, so AWS_Stack starts no run, and the new workflow runs on its own pull request
    - Rebase onto `master`, push, `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 39 · Depends on: 7.19, 4.3, 2.9
    - _Requirements: 15.24_
    - _Design: Branch protection and the tf-gate workflow; open item A-2_

  - [ ] 7.22 [operator] Merge CU-G1
    - Confirm `tf-gate` passed on its own pull request; after the merge, record that AWS_Stack started no tracked run for this non-`tf-files/` commit
    - Rollback: revert CU-G1
    - Wave 40 · Depends on: 7.20, 7.21
    - _Requirements: 15.3, 15.24_
    - _Design: Branch protection and the tf-gate workflow_

  - [ ] 7.23 [agent+approval] Set the repository variable `SPACELIFT_AWS_CHECK_NAME`
    - Stop and request confirmation: `gh variable set SPACELIFT_AWS_CHECK_NAME` on repository `crgomez/AmplifyAppResume`, value from `records/spacelift-check-names.txt`
    - Rollback: `gh variable delete SPACELIFT_AWS_CHECK_NAME`
    - Wave 41 · Depends on: 7.22
    - _Requirements: 15.23, 15.24_
    - _Design: Branch protection and the tf-gate workflow_

  - [ ] 7.24 [operator] Configure branch protection on `master` in `crgomez/AmplifyAppResume`
    - Require a pull request, required check `tf-gate`, "Do not allow bypassing the above settings" on, force push and deletion blocked; read the rule back
    - Rollback: remove or correct the rule
    - Wave 42 · Depends on: 7.23, 4.3
    - _Requirements: 15.23, 15.24_
    - _Design: Branch protection and the tf-gate workflow; risk R-11_

  - [ ] 7.25 [operator] Configure branch protection on `main` in `crgomez/Terraform-CF-WAF`
    - Per decision 4.1: require a pull request and the Cloudflare_Stack Spacelift check, no bypass; or, if 4.1 accepted Spacelift confirmation as the only gate, record that outcome instead
    - Rollback: remove or correct the rule
    - Wave 43 · Depends on: 7.24, 4.1
    - _Requirements: 15.23_
    - _Design: Branch protection and the tf-gate workflow; open item A-3_

  - [ ] 7.26 [agent+approval] Open the two branch-protection test pull requests
    - Stop and request confirmation: push branches `bp-test-site` and `bp-test-tf` to `crgomez/AmplifyAppResume` and open two pull requests against `master`; the `tf-files/` one starts an AWS_Stack Proposed_Run with Plan_Role. Neither is merged
    - `bp-test-site`: a comment change in `minimalist-sample.html` only; `bp-test-tf`: a comment line in `tf-files/var.tf` only
    - Rollback: close both pull requests and delete both remote branches
    - Wave 44 · Depends on: 7.25
    - _Requirements: 15.25_
    - _Design: Branch protection and the tf-gate workflow › Test procedure_

  - [ ] 7.27 [operator] Observe, record, and close the test pull requests
    - Record that the Site-only pull request is mergeable with no AWS_Stack status and that the `tf-files/` pull request stays unmergeable until its Proposed_Run succeeds; record the check-run summary text and confirm it holds no plan body; draft RL-BP
    - Close both pull requests unmerged and delete both branches
    - Rollback: if a rule misbehaves, correct it and repeat 7.26 and 7.27
    - Wave 45 · Depends on: 7.26
    - _Requirements: 15.14, 15.23, 15.24, 15.25_
    - _Design: Branch protection and the tf-gate workflow › Test procedure; risk R-4_

  - [ ] 7.28 [operator] Record fork-run evidence for both stacks
    - Use an evidence form allowed by Requirement 15 criterion 13 as amended by DOC-1 (design A-5); draft RL-FORK for each stack
    - Wave 44 · Depends on: 7.25
    - _Requirements: 15.12, 15.13_
    - _Design: Spacelift Free-plan verdicts; open item A-5_

- [ ] 8. [agent] Checkpoint - Phase 1 complete
  - Ensure all tests pass, ask the user if questions arise.
  - Gate: CU-A1, CU-A2, and CU-C1 zero-change records exist; branch protection reads back on both branches; RL-FREE, RL-TOKEN, RL-BP, and RL-FORK drafts exist
  - Wave 46
  - _Requirements: 16.6_

- [ ] 9. Phase 2 step 1: CU-A3 Content_Bucket and Log_Bucket
  - [ ] 9.1 [agent+approval] Open the CU-A3 pull request
    - Stop and request confirmation: push branch `cu-a3-content-buckets` to `crgomez/AmplifyAppResume` and open a pull request against `master`; this starts an AWS_Stack Proposed_Run with Plan_Role
    - Rebase onto `master`, `terraform init -backend=false`, re-validate, push, `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 47 · Depends on: 8, 2.3
    - _Requirements: 16.9_
    - _Design: CU-A3_

  - [ ] 9.2 [operator] Review, merge, and confirm CU-A3
    - The plan creates only Content_Bucket and Log_Bucket resources and changes nothing on Legacy_Bucket or the roles; merge; confirm; the dependent Cloudflare_Stack run finishes with no changes
    - Rollback: if `crgomez-content` is taken, follow Requirement 3 criterion 11; otherwise revert CU-A3. Apply_Role has no `s3:DeleteBucket`, so after the revert the Operator deletes the empty buckets with owner credentials and confirms the next plan reports no changes
    - Wave 48 · Depends on: 9.1
    - _Requirements: 3.1, 3.2, 3.3, 3.11, 16.9_
    - _Design: CU-A3; Error Handling_

  - [ ] 9.3 [agent] Verify the CU-A3 gate
    - Read back the Content_Bucket Public Access Block (four `true`), logging configuration (destination `crgomez-content-logs`, prefix `crgomez-content/`), ownership controls, versioning, encryption, lifecycle, and the Log_Bucket policy
    - Unauthenticated request to `https://crgomez-content.s3.us-west-2.amazonaws.com/`: TLS completes with no name mismatch and an S3 HTTP status returns
    - Wave 49 · Depends on: 9.2
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_
    - _Design: CU-A3; Testing Strategy › Test layers (read-backs)_

  - [ ] 9.4 [agent] Capture the CloudTrail evidence for the first AWS_Stack apply after Phase 1
    - Run the two design queries for the CU-A3 apply window (run ID and window recorded by 9.2); save output to `~/crgomez-ops/records/cloudtrail-cu-a3.json` well inside the 90-day Event History window; draft RL-CLOUDTRAIL-001
    - Pass: every S3 bucket-configuration write shows the Apply_Role session and none shows the AdministratorAccess IAM user
    - Wave 49 · Depends on: 9.2
    - _Requirements: 15.29_
    - _Design: CloudTrail evidence; risk R-5_

- [ ] 10. Phase 2 step 2: content migration (Operator procedure)
  - [ ] 10.1 [agent+approval] Copy the three objects and upload the Canary_Object
    - Stop and request confirmation: three `get-object` downloads from bucket `crgomez.com` and four `put-object` requests to bucket `crgomez-content` (`docs/resume.pdf`, `img/hero-banner.png`, `img/favicon.png`, `docs/access-canary.txt`); account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Run `bash ~/crgomez-ops/publish/migrate.sh`: it re-reads the Content_Bucket Public Access Block (four `true`), downloads each source with `fetch-legacy.sh`, uploads each local file with `put.sh` and the design's metadata, and uploads the canary with `Content-Type: text/plain`
    - Rollback: re-upload any mismatching object with explicit metadata (Requirement 4 criterion 8); no object is anonymously readable before CU-A4
    - Wave 50 · Depends on: 9.3, 9.4, 1.5
    - _Requirements: 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 4.11, 16.10_
    - _Design: Phase 2 step 2: content migration_

  - [ ] 10.2 [agent] Verify the content migration gate
    - From `records/migration.log`: size equals the recorded source size, and the base64 SHA-256 of each `source` line equals the matching `upload` line and the `head-object` `sha256_b64`; `Content-Type`, `Cache-Control`, and (resume) `Content-Disposition` equal the required values; the canary reads back `text/plain`
    - Record that version history stays in Legacy_Bucket only; write each published key's `version_id` from the read-back into `content_current_versions` in `records/nat-inputs.json`
    - Wave 51 · Depends on: 10.1
    - _Requirements: 4.6, 4.7, 4.8, 4.9, 4.10, 4.11_
    - _Design: Phase 2 step 2: content migration; Data Models › Negative_Access_Test inputs_

- [ ] 11. Phase 2 step 3: CU-A4 Content_Bucket policy and delivery checks
  - [ ] 11.1 [agent+approval] Open the CU-A4 pull request
    - Stop and request confirmation: push branch `cu-a4-content-policy` to `crgomez/AmplifyAppResume` and open a pull request against `master`; this starts an AWS_Stack Proposed_Run with Plan_Role
    - Re-fetch `https://www.cloudflare.com/ips-v4` and confirm the set still equals `tf-files/cloudflare-ipv4.json`; rebase onto `master`, `terraform init -backend=false`, re-validate, push, `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 51 · Depends on: 10.1, 2.4
    - _Requirements: 5.4, 16.2_
    - _Design: CU-A4_

  - [ ] 11.2 [operator] Export the CU-A4 Proposed_Run plan as JSON
    - Save the plan JSON (`terraform show -json` output) to `~/crgomez-ops/records/cu-a4-plan.json`; it contains variable values and stays private
    - Wave 52 · Depends on: 11.1
    - _Requirements: 13.10_
    - _Design: Scanner_Gate observed and predicted results_

  - [ ] 11.3 [agent] Inspect the rendered policy and run checkov against the planned policy
    - From the plan JSON: the Allow resource list has exactly the three keys, Allow and `NotResource` sets are identical, the Canary_Object key is in neither, the `aws:SourceIp` list equals the committed 15 prefixes with no IPv6 entry; a difference blocks the merge
    - Run `checkov` on the plan JSON; record whether `CKV_AWS_283` fires on the Content_Bucket policy, and if it does, record it in the permitted set with the Requirement 13 criterion 11 reason (draft RL-SCAN)
    - Wave 53 · Depends on: 11.2
    - _Requirements: 4.11, 5.8, 5.13, 11.16, 13.10, 13.11_
    - _Design: Rendered policies; Scanner_Gate observed and predicted results_

  - [ ] 11.4 [operator] Merge and confirm CU-A4
    - Merge; confirm the tracked run; the dependent Cloudflare_Stack run finishes with no changes
    - Rollback: revert CU-A4 (nothing yet depends on the Content_Bucket policy)
    - Wave 54 · Depends on: 11.3, 10.2
    - _Requirements: 5.1, 5.2, 5.3, 5.7, 16.9_
    - _Design: CU-A4_

  - [ ] 11.5 [agent] Verify the CU-A4 policy read-back
    - Read back the stored policy and the four Content_Bucket Public Access Block flags (all `true`); compare keys and prefixes with the committed files
    - Anonymous direct GET of `docs/resume.pdf` and of the canary from the workstation returns 403
    - Wave 55 · Depends on: 11.4
    - _Requirements: 5.5, 5.6, 5.8, 5.9_
    - _Design: Rendered policies (decision table)_

  - [ ] 11.6 [agent] Run the Owner_Access_Check after CU-A4
    - `bash ~/crgomez-ops/nat/owner_access_check.sh full`; every assertion must pass
    - On a canary failure, treat it as a Deny-scoping failure, halt, and ask the owner to revert CU-A4 (Requirement 11 criterion 19); on an archive failure, halt
    - Wave 55 · Depends on: 11.4, 1.3
    - _Requirements: 11.17, 11.18, 11.19_
    - _Design: Owner_Access_Check_

  - [ ]* 11.7 [agent+approval] Dispatch `delivery-checks` once to confirm the drift job
    - Stop and request confirmation: `gh workflow run delivery-checks` on `crgomez/AmplifyAppResume`; `range-drift` passes and opens no issue, `synthetic` is skipped
    - Wave 56 · Depends on: 11.5, 11.6
    - _Requirements: 5.15, 5.17, 10.11_

- [ ] 12. Phase 2 step 4: CU-C2 SSL/TLS mode
  - [ ] 12.1 [operator] Record the current SSL/TLS mode and the origin hostname
    - Record the dashboard encryption mode and `ssl_automatic_mode`, and the CloudFront hostname that `www` and the apex point at, in `~/crgomez-ops/records/runlog/RL-SSL-001.txt`
    - Wave 56 · Depends on: 11.5, 11.6
    - _Requirements: 6.14_
    - _Design: SSL pre-checks and 526 rollback; risk R-1_

  - [ ] 12.2 [agent+approval] Open the CU-C2 pull request
    - Stop and request confirmation: push branch `cu-c2-ssl-strict` to `crgomez/Terraform-CF-WAF` and open a pull request against `main`; this starts a Cloudflare_Stack Proposed_Run that holds the write-capable `CLOUDFLARE_API_TOKEN`
    - Rebase onto `main`, `terraform init -backend=false`, re-validate, push, `gh pr create`; the diff holds only `zone_ssl.tf`
    - Rollback: close the pull request and delete the remote branch
    - Wave 56 · Depends on: 11.5, 11.6, 2.7
    - _Requirements: 6.7_
    - _Design: CU-C2_

  - [ ] 12.3 [agent] Run the origin certificate pre-checks
    - Run the design `openssl s_client` checks against the recorded origin with SNI `www.crgomez.com` and `crgomez.com`: verify return code 0, `notAfter` in the future, SAN covers each name
    - A failure blocks the CU-C2 merge and halts the sequence
    - Wave 57 · Depends on: 12.1
    - _Requirements: 6.15, 16.11_
    - _Design: SSL pre-checks and 526 rollback_

  - [ ] 12.4 [operator] Merge and confirm CU-C2
    - The plan creates only `cloudflare_zone_settings_override.zone`; merge; confirm the Cloudflare_Stack run
    - Rollback: Requirement 6 criterion 16 (revert CU-C2, set the recorded mode in the dashboard at once)
    - Wave 58 · Depends on: 12.2, 12.3
    - _Requirements: 6.7, 16.11_
    - _Design: CU-C2; risk R-1_

  - [ ] 12.5 [agent] Verify the CU-C2 gate
    - `curl -sI https://www.crgomez.com/` returns 200; neither `www` nor `https://crgomez.com/` returns 526
    - On a 526, ask the owner to perform the 12.4 rollback and confirm `www` returns 200 before any later merge; draft RL-HALT
    - Wave 59 · Depends on: 12.4
    - _Requirements: 6.16, 16.9_
    - _Design: SSL pre-checks and 526 rollback_

- [ ] 13. Phase 2 step 5: CU-C3 Cloudflare delivery path
  - [ ] 13.1 [operator] Inventory the rule phases CU-C3 takes over
    - Run the design inventory (dashboard or a local read-only token) for `http_request_cache_settings`, `http_response_headers_transform`, and Cloud Connector rules; draft RL-RULES; any existing rule is declared in CU-C3 or recorded for removal before merge
    - Wave 60 · Depends on: 12.5
    - _Requirements: 6.12, 6.13_
    - _Design: CU-C3 (pre-merge inventory)_

  - [ ] 13.2 [operator] Confirm the zone Caching Level is Standard
    - In the dashboard (Caching → Configuration) or through the read-only API (`settings/cache_level` must read `aggressive`), confirm the zone's Caching Level is Standard, not "Ignore Query String" or "No Query String"; record the value in RL-RULES
    - Otherwise the Negative_Access_Test's unique `nat=<nonce>` query string would not change the cache key and its `cf-cache-status != HIT` assertion would fail; any other value blocks the CU-C3 merge until the owner decides. This task reads the setting and changes nothing
    - Wave 60 · Depends on: 12.5
    - _Requirements: 11.12_
    - _Design: CU-C3 (pre-merge inventory, Caching Level)_

  - [ ] 13.3 [agent+approval] Open the CU-C3 pull request
    - Stop and request confirmation: push branch `cu-c3-delivery-path` to `crgomez/Terraform-CF-WAF` and open a pull request against `main`; this starts a Cloudflare_Stack Proposed_Run that holds the write-capable `CLOUDFLARE_API_TOKEN`
    - Rebase onto `main`, `terraform init -backend=false`, re-validate, push, `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 60 · Depends on: 12.5, 2.8
    - _Requirements: 6.1, 6.2_
    - _Design: CU-C3_

  - [ ] 13.4 [operator] Merge and confirm CU-C3
    - Merge; confirm the Cloudflare_Stack run (record, connector rules, two rulesets)
    - Rollback: revert CU-C3; Site still points at Legacy_Bucket, so visitors are unaffected
    - Wave 61 · Depends on: 13.1, 13.2, 13.3
    - _Requirements: 6.1, 6.2, 6.8, 6.10, 16.9_
    - _Design: CU-C3_

  - [ ] 13.5 [operator] Purge the resume URL and read the zone SSL mode
    - Purge `https://field.crgomez.com/docs/resume.pdf` by URL (dashboard or local purge token, design O-12); record the UTC purge time in `~/crgomez-ops/records/purge-cu-c3.txt`; record that the zone SSL mode reads `strict`
    - Wave 62 · Depends on: 13.4
    - _Requirements: 5.14, 6.6, 10.4_
    - _Design: Delivery verification_

  - [ ] 13.6 [agent] Verify the delivery-path gate (purge and retrieve)
    - GET the purged URL through the Edge: HTTP 200, body length 221604, `cf-ray` present, no `x-amz-request-id` or `x-amz-id-2`; GET `img/favicon.png` and `img/hero-banner.png` with the same checks; GET the canary through the Edge and require 403 with an S3 `AccessDenied` body; draft RL-DELIVERY
    - On failure, ask the owner to revert CU-C3 and halt
    - Wave 63 · Depends on: 13.5
    - _Requirements: 5.14, 6.4, 6.5, 6.6, 16.12_
    - _Design: Delivery verification_

  - [ ] 13.7 [agent+approval] Enable the Synthetic_Check
    - Stop and request confirmation: `gh variable set SYNTHETIC_CHECK_ENABLED --body true` on `crgomez/AmplifyAppResume`
    - Rollback: set the variable to `false`
    - Wave 64 · Depends on: 13.6
    - _Requirements: 10.9, 10.11_
    - _Design: Delivery-checks workflow_

  - [ ] 13.8 [operator] Check per-path analytics for Delivery_Host
    - Check whether Cloudflare analytics report per-path counts for `field.crgomez.com` on the current plan; draft RL-ANALYTICS, including the limitation statement if unavailable
    - Wave 64 · Depends on: 13.6
    - _Requirements: 10.3, 10.7, 10.8_
    - _Design: Appendix A › RL-ANALYTICS_

- [ ] 14. Phase 2 step 6: CU-S1 Site repoint
  - [ ] 14.1 [agent+approval] Open the CU-S1 pull request
    - Stop and request confirmation: push branch `cu-s1-site-repoint` to `crgomez/AmplifyAppResume` and open a pull request against `master`; the change is Site-only, so AWS_Stack starts no run and `tf-gate` passes without one
    - Rebase onto `master`; re-check the seven replacements and the zero-hit search; push; `gh pr create`; `tf-gate` passes
    - Rollback: close the pull request and delete the remote branch
    - Wave 64 · Depends on: 13.6, 2.10
    - _Requirements: 7.1, 7.8, 16.3_
    - _Design: Site repoint_

  - [ ] 14.2 [operator] Merge CU-S1 and wait for the Amplify deploy
    - Merge; wait until Amplify reports a successful build and deploy
    - Rollback: revert CU-S1 and confirm the Amplify redeploy
    - Wave 65 · Depends on: 14.1
    - _Requirements: 7.5, 16.9_
    - _Design: Site repoint_

  - [ ] 14.3 [agent] Verify the Site repoint
    - Each of the three distinct URLs: exactly 200, exact `Content-Type`, body length equal to the recorded size, `cf-ray` present, no redirect following, 10-second timeout, up to 3 retries 60 seconds apart; a 200 with `text/html` or without `cf-ray` fails
    - Deployed `https://www.crgomez.com/` holds exactly seven `https://field.crgomez.com/` references and zero `s3.us-west-2.amazonaws.com`
    - Record the UTC time of the passing verification in `~/crgomez-ops/records/window-start.txt`; on failure ask the owner to revert CU-S1
    - Wave 66 · Depends on: 14.2
    - _Requirements: 7.5, 7.6, 7.7, 16.13_
    - _Design: Site repoint_

  - [ ] 14.4 [agent] Run the second Negative_Access_Test (`post-repoint`)
    - Pull `master` into the local clone at `AMPLIFY_REPO` first; run `nat.py --phase post-repoint --run-label post-repoint` under `env -i` with `--out ~/crgomez-ops/records/nat-post-repoint.json`
    - Exit status 0 is required; a non-zero exit halts the sequence; draft RL-NAT-002
    - Wave 67 · Depends on: 14.3
    - _Requirements: 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11, 11.12, 11.13, 11.14, 11.15, 11.16, 16.13_
    - _Design: Negative_Access_Test and Owner_Access_Check_

  - [ ] 14.5 [agent] Run the Owner_Access_Check with the second Negative_Access_Test
    - `bash ~/crgomez-ops/nat/owner_access_check.sh full`; a failure halts the sequence (Requirement 11 criterion 19)
    - Wave 67 · Depends on: 14.3
    - _Requirements: 11.5, 11.13, 11.17, 11.18, 11.19_
    - _Design: Owner_Access_Check_

  - [ ] 14.6 [operator] Refresh the social previews
    - Submit `https://crgomez.com/` to LinkedIn Post Inspector and the Facebook Sharing Debugger; confirm each preview renders the image from `field.crgomez.com`; record the result
    - Wave 67 · Depends on: 14.3
    - _Requirements: 7.9_
    - _Design: Site repoint_

- [ ] 15. Phase 2 step 7: waiting window and CU-A5 final lockdown
  - [ ] 15.1 [operator] Hold the 72-hour to 14-day window and sign off (time-triggered)
    - CU-A5 merges no earlier than 72 hours and no later than 14 days after `records/window-start.txt`; confirm `records/phase0/interim-policy.json` is present
    - During the window repeat the LinkedIn and Facebook re-scrape and confirm each preview image URL resolves on Delivery_Host with HTTP 200; record RL-ACCEPT sign-off before CU-A5 merges
    - Wave 68 · Depends on: 14.4, 14.5, 14.6
    - _Requirements: 8.1, 8.2, 8.6_
    - _Design: Final lockdown checks; Recorded decisions and statements (compatibility-loss acceptance)_

  - [ ] 15.2 [agent] First log-delivery observation (time-triggered, at least 24 hours after the 13.5 purge)
    - Sync `s3://crgomez-content-logs/crgomez-content/` read-only into Operator Records and search for a `docs/resume.pdf` record timestamped after the purge
    - No record after 24 hours is a logging configuration failure: record it and raise it with the owner before CU-A5 merges
    - Wave 68 · Depends on: 13.5, 14.4
    - _Requirements: 10.1, 10.2, 10.4_
    - _Design: Delivery verification (logging check); Error Handling (log review helper)_

  - [ ] 15.3 [agent] Monitor delivery during the window
    - Daily, read the `delivery-checks` run results with `gh run list` and spot-check the three Delivery_Host URLs as in 14.3
    - On any non-200 or `text/html` response, ask the owner to start the Requirement 8 criterion 5 rollback (revert CU-S1 first, then CU-A5 if applied) and draft RL-HALT
    - Wave 68 · Depends on: 14.4, 14.5
    - _Requirements: 8.5, 10.9, 10.10_
    - _Design: Error Handling (window row)_

  - [ ] 15.4 [agent+approval] Open the CU-A5 pull request
    - Stop and request confirmation: push branch `cu-a5-legacy-lockdown` to `crgomez/AmplifyAppResume` and open a pull request against `master`; this starts an AWS_Stack Proposed_Run with Plan_Role
    - Rebase onto `master`, `terraform init -backend=false`, re-validate, push, `gh pr create`
    - Rollback: close the pull request and delete the remote branch
    - Wave 68 · Depends on: 14.4, 14.5, 2.5
    - _Requirements: 13.3_
    - _Design: CU-A5_

  - [ ] 15.5 [operator] Merge and confirm CU-A5 inside the window
    - The plan shows 1 to destroy (the interim policy) and 1 to change (the Public Access Block); merge; confirm
    - Rollback: Requirement 8 criterion 5 order (revert CU-S1 and confirm the redeploy, then revert CU-A5 so the flags return to `false` before the interim policy is re-applied, then confirm the Retained_Objects return 200)
    - Wave 69 · Depends on: 15.1, 15.2, 15.3, 15.4
    - _Requirements: 8.1, 8.5, 13.3, 16.9_
    - _Design: CU-A5; Error Handling_

  - [ ] 15.6 [agent] Verify the final lockdown read-back
    - Run the design final-lockdown check (sources `lib.sh`): `get-bucket-policy` on `crgomez.com` reports `NoSuchBucketPolicy` and all four Public Access Block flags read `True`
    - Wave 70 · Depends on: 15.5
    - _Requirements: 8.3_
    - _Design: Final lockdown checks_

  - [ ] 15.7 [agent] Run the third Negative_Access_Test (`post-lockdown`)
    - `nat.py --phase post-lockdown --run-label post-lockdown` under `env -i` with `--out ~/crgomez-ops/records/nat-post-lockdown.json`; every Legacy_Bucket request, including the three Retained_Objects, returns 403
    - Exit status 0 completes the sequence; a non-zero exit halts it; draft RL-NAT-003
    - Wave 71 · Depends on: 15.6
    - _Requirements: 8.4, 11.9, 16.9_
    - _Design: Negative_Access_Test and Owner_Access_Check › Assertion matrix by run_

  - [ ] 15.8 [agent] Run the Owner_Access_Check with the third Negative_Access_Test
    - `bash ~/crgomez-ops/nat/owner_access_check.sh full`; a failure halts the sequence
    - Wave 71 · Depends on: 15.6
    - _Requirements: 11.5, 11.13, 11.17, 11.18, 11.19_
    - _Design: Owner_Access_Check_

- [ ] 16. [agent] Checkpoint - Phase 2 complete
  - Ensure all tests pass, ask the user if questions arise.
  - Gate: RL-NAT-003 reports exit 0, the third Owner_Access_Check passed, and the final-lockdown read-back passed (Requirement 16 criterion 9 step 7)
  - Wave 72
  - _Requirements: 16.9_

- [ ] 17. Closing evidence
  - [ ] 17.1 [agent] Evaluate the Scanner_Gate on the final configuration
    - Run `checkov` and `trivy` on `tf-files/` at `master` after CU-A5; required-zero list empty; every other finding in the permitted set as decided in 4.4; any new finding is remediated or recorded with a reason; finalize RL-SCAN with tool versions
    - Wave 73 · Depends on: 16, 4.4
    - _Requirements: 13.6, 13.7, 13.8, 13.9, 13.11_
    - _Design: Scanner_Gate observed and predicted results_

  - [ ] 17.2 [agent] Capture the CloudTrail evidence for the CU-A5 apply
    - Run the design queries for the CU-A5 apply window; save to `~/crgomez-ops/records/cloudtrail-cu-a5.json`; confirm `cloudtrail-cu-a3.json` from 9.4 exists; draft RL-CLOUDTRAIL-002
    - Wave 73 · Depends on: 16
    - _Requirements: 15.29_
    - _Design: CloudTrail evidence; risk R-5_

  - [ ] 17.3 [agent+approval] Author and open the DOC-2 pull request
    - Add the Phase 1 and Phase 2 Run Log summaries to `design.md` Appendix A › Entries from the drafts in `records/runlog/`, following the Appendix A rules; if 7.13 applied the D-3 contingency, also fold A-11 into `requirements.md`; run `validate_spec_format` on every changed spec file
    - Stop and request confirmation: push the DOC-2 branch to the public repository `crgomez/AmplifyAppResume` and open a pull request against `master`; show the diff first and confirm it holds no identifier the Appendix A rules exclude
    - Rollback: close the pull request and delete the remote branch
    - Wave 74 · Depends on: 17.1, 17.2
    - _Requirements: 6.6, 10.8, 13.9, 15.9, 15.13, 15.25, 15.29_
    - _Design: Appendix A: Run Log; open items A-9, A-11_

  - [ ] 17.4 [operator] Merge DOC-2
    - Rollback: revert the merge commit
    - Wave 75 · Depends on: 17.3
    - _Requirements: 16.1_
    - _Design: Open items › A-9_

- [ ] 18. [agent] Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Wave 76
  - _Requirements: 16.9_

- [ ] 19. Scheduled and conditional follow-ups (time-triggered; do not dispatch before the trigger)
  - [ ] 19.1 [agent+approval] Delete the legacy Terraform state object (trigger: 30 days after the date in `records/state-migration-verified.txt`)
    - Stop and request confirmation: delete `crgomez/terraform.tfstate` and every noncurrent version of it in bucket `crgomez.com-state`; the bucket itself stays; account: display the live `sts get-caller-identity` account alongside `EXPECTED_ACCOUNT_ID` from `config.env`, and refuse to proceed if they differ
    - Rollback: none in S3; `records/aws.tfstate` remains as the snapshot
    - Wave 77 · Depends on: 18, 7.11
    - _Requirements: 15.19_
    - _Design: Phase 1 step 4 (AWS-side equivalents)_

  - [ ] 19.2 [operator] Review the Log_Bucket records (recurring, at least every 30 days)
    - Run the design log review helper (sources `lib.sh` and `records/paths.txt`) with owner credentials; inspect the output; for any non-Cloudflare source with a 2xx, record key, address, status, and timestamp in Operator Records and treat it as an Edge bypass
    - Wave 77 · Depends on: 18
    - _Requirements: 10.5, 10.6_
    - _Design: Error Handling (log review helper)_

  - [ ] 19.3 [operator] Review a halted sequence (conditional, standing)
    - Applies only while the sequence is halted under Requirement 16 criterion 14, from any wave; it is dispatched out of wave order when a halt begins
    - Record the halted step and start date in RL-HALT; review at least every 14 days and record resume, roll back further, or stay halted, plus any open Spacelift runs
    - Wave 77 · Depends on: a halt (no task)
    - _Requirements: 16.14, 16.15_
    - _Design: Error Handling; Appendix A › RL-HALT_

## Notes

- Tasks marked with `*` are optional and can be skipped. Only 11.7 is optional; every Negative_Access_Test run, Owner_Access_Check, zero-change gate, read-back, and HTML-fallback check is mandatory.
- The design has no Correctness Properties section, so the plan has no property-based test tasks. Verification is example-based: plan review, read-backs, stubbed script checks, the Negative_Access_Test, and the Owner_Access_Check.
- Each task references specific requirement criteria and the design section it implements.
- Task 1.6 must complete, with the owner's confirmation recorded, before any task runs a script that sources `lib.sh`; `lib.sh` enforces this by refusing to run without a matching `records/config-confirmed.txt`.
- No version-specific delete and no noncurrent-expiry lifecycle rule touches Legacy_Bucket for at least 90 days after task 3.12 (Requirement 2 criterion 6).
- Conditional tasks 3.9 and 19.3 sit in waves so the graph covers every task, but they run only when triggered. On the normal path, 3.9 is closed as not required.
- A merge to `master` that touches `tf-files/` also queues a Cloudflare_Stack tracked run through the stack dependency. The Operator lets it finish with no changes, and discards it if it shows an unexpected delta.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "1.6", "2.1", "2.6", "2.9", "2.10"] },
    { "id": 2, "tasks": ["3.1", "2.2", "2.7"] },
    { "id": 3, "tasks": ["3.2", "2.3", "2.8"] },
    { "id": 4, "tasks": ["3.3", "2.4"] },
    { "id": 5, "tasks": ["3.4", "2.5"] },
    { "id": 6, "tasks": ["3.5"] },
    { "id": 7, "tasks": ["3.6"] },
    { "id": 8, "tasks": ["3.7"] },
    { "id": 9, "tasks": ["3.8"] },
    { "id": 10, "tasks": ["3.9"] },
    { "id": 11, "tasks": ["3.10"] },
    { "id": 12, "tasks": ["3.11"] },
    { "id": 13, "tasks": ["3.12"] },
    { "id": 14, "tasks": ["3.13"] },
    { "id": 15, "tasks": ["3.14", "4.1", "4.2", "4.3", "4.4"] },
    { "id": 16, "tasks": ["5"] },
    { "id": 17, "tasks": ["6.1", "6.3", "6.4"] },
    { "id": 18, "tasks": ["6.2"] },
    { "id": 19, "tasks": ["6.5"] },
    { "id": 20, "tasks": ["6.6"] },
    { "id": 21, "tasks": ["7.1"] },
    { "id": 22, "tasks": ["7.2"] },
    { "id": 23, "tasks": ["7.3"] },
    { "id": 24, "tasks": ["7.4"] },
    { "id": 25, "tasks": ["7.5"] },
    { "id": 26, "tasks": ["7.6"] },
    { "id": 27, "tasks": ["7.7"] },
    { "id": 28, "tasks": ["7.8"] },
    { "id": 29, "tasks": ["7.9"] },
    { "id": 30, "tasks": ["7.10"] },
    { "id": 31, "tasks": ["7.11", "7.12"] },
    { "id": 32, "tasks": ["7.13"] },
    { "id": 33, "tasks": ["7.14"] },
    { "id": 34, "tasks": ["7.15"] },
    { "id": 35, "tasks": ["7.16"] },
    { "id": 36, "tasks": ["7.17"] },
    { "id": 37, "tasks": ["7.18"] },
    { "id": 38, "tasks": ["7.19"] },
    { "id": 39, "tasks": ["7.20", "7.21"] },
    { "id": 40, "tasks": ["7.22"] },
    { "id": 41, "tasks": ["7.23"] },
    { "id": 42, "tasks": ["7.24"] },
    { "id": 43, "tasks": ["7.25"] },
    { "id": 44, "tasks": ["7.26", "7.28"] },
    { "id": 45, "tasks": ["7.27"] },
    { "id": 46, "tasks": ["8"] },
    { "id": 47, "tasks": ["9.1"] },
    { "id": 48, "tasks": ["9.2"] },
    { "id": 49, "tasks": ["9.3", "9.4"] },
    { "id": 50, "tasks": ["10.1"] },
    { "id": 51, "tasks": ["10.2", "11.1"] },
    { "id": 52, "tasks": ["11.2"] },
    { "id": 53, "tasks": ["11.3"] },
    { "id": 54, "tasks": ["11.4"] },
    { "id": 55, "tasks": ["11.5", "11.6"] },
    { "id": 56, "tasks": ["11.7", "12.1", "12.2"] },
    { "id": 57, "tasks": ["12.3"] },
    { "id": 58, "tasks": ["12.4"] },
    { "id": 59, "tasks": ["12.5"] },
    { "id": 60, "tasks": ["13.1", "13.2", "13.3"] },
    { "id": 61, "tasks": ["13.4"] },
    { "id": 62, "tasks": ["13.5"] },
    { "id": 63, "tasks": ["13.6"] },
    { "id": 64, "tasks": ["13.7", "13.8", "14.1"] },
    { "id": 65, "tasks": ["14.2"] },
    { "id": 66, "tasks": ["14.3"] },
    { "id": 67, "tasks": ["14.4", "14.5", "14.6"] },
    { "id": 68, "tasks": ["15.1", "15.2", "15.3", "15.4"] },
    { "id": 69, "tasks": ["15.5"] },
    { "id": 70, "tasks": ["15.6"] },
    { "id": 71, "tasks": ["15.7", "15.8"] },
    { "id": 72, "tasks": ["16"] },
    { "id": 73, "tasks": ["17.1", "17.2"] },
    { "id": 74, "tasks": ["17.3"] },
    { "id": 75, "tasks": ["17.4"] },
    { "id": 76, "tasks": ["18"] },
    { "id": 77, "tasks": ["19.1", "19.2", "19.3"] }
  ]
}
```
