# React2Shell

This repository is only for research purposes. It contains malicious payload injected into my dev server in December 2025 using React2Shell vulnerability. Attacker didn't manage to escape frontend folder and didn't escalate privileges any further. In the process Monero cryptocurrency miner was created.
Malicious code injected in .bashrc of low privilege frontend app user was deobfuscated and analyzed with qwen3.8:27b model. 


## Summary of Malicious Behavior [AI genereated]

| Component | Purpose |
|-----------|---------|
| String pools + RC4 | Hide strings from static analysis |
| Anti-tamper wrappers (`a`, `b`, `d`, `c`) | Prevent debugging / code extraction |
| `checkWallets()` | Query 9 C2 endpoints via JSON-RPC for exfiltration targets |
| `getSystemId()` | Fingerprint the victim machine (machine-id or UUID) |
| `persistAndExecute()` | **Persistence**: writes to crontab, `.bashrc`, spawns background processes |
| `downloadAndExecute()` | Downloads a binary payload, executes it, **kills the parent process** |
| `fetchRemoteCode()` | Fetches & executes arbitrary JS from C2 with full `require`/`process` access |
| `setInterval` | Periodic C2 re-check every ~14 minutes |
| `while(true)` | Initial C2 call + sleep (runs once) |

**Classification:** Node.js infostealer / backdoor with C2, multi-vector persistence, remote code execution, and process termination to hide the parent. Likely targets 
cryptocurrency wallets (JSON-RPC `wallet_getAddress` calls) and general system compromise.
