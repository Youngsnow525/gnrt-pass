document.addEventListener("DOMContentLoaded", () => {

    const passwordDisplay = document.getElementById('password-display');
    const btnCopiar = document.getElementById('btn-copiar');
    const lengthRange = document.getElementById('legth-range');
    const lengthValue = document.getElementById('legth-value');
    const chkMayuscula = document.getElementById('mayuscula');
    const chkMinuscula = document.getElementById('minuscula');
    const chkNumeros = document.getElementById('numeros');
    const chkSimbolos = document.getElementById('simbolos');
    const chkConfusos = document.getElementById('excluir-confusos');
    const chkPassphrase = document.getElementById('modo-passphrase');
    const btnGenerate = document.getElementById('btn-generate');
    const historyList = document.getElementById('history-list');
    const toast = document.getElementById('toast');


    let lettersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lettersLower = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';


    const ccb = [chkMayuscula, chkMinuscula, chkNumeros, chkSimbolos, chkConfusos];
    ccb.forEach(chk => {
        chk.addEventListener('change', () => {
            if (chk.checked) {
                chkPassphrase.checked = false;
            }
        });
    });
    chkPassphrase.addEventListener('change', () => {
        if (chkPassphrase.checked) {
            ccb.forEach(chk => {
                chk.checked = false;
            });
        }
    });


    const wordList = [
        'sun', 'moon', 'fire', 'blink', 'ntr', 'faf', 'prog', 'red',
        'fear', 'win', 'hash', 'gradle', 'blue', 'green', 'gear', 'pumb',
        'ngng', 'kaos', 'tryna', 'toml', 'oak', 'folk', 'doork', 'kj'
    ];

    lengthRange.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });


    function showToast(message = "¡Copiado al portapapeles!") {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }


    document.addEventListener('DOMContentLoaded', () => {
        renderHistory();
        generatePassword();
    });

    async function generatePassword() {
        let password = '';

        //Passphrase
        if (chkPassphrase.checked) {
            let words = [];
            const numWords = 2;

            try {

                const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${numWords}`);
                if (!response.ok) throw new Error('Error en la API');
                words = await response.json();
            } catch (error) {

                for (let i = 0; i < numWords; i++) {
                    const randIndex = Math.floor(Math.random() * fallbackEnglishWords.length);
                    words.push(fallbackEnglishWords[randIndex]);
                }
            }
            const randomNum1 = Math.floor(Math.random() * 90) + 10;
            const randomSym1 = symbols[Math.floor(Math.random() * symbols.length)];
            const capitalizedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1));
            password = capitalizedWords[0];
            for (let i = 0; i < capitalizedWords.length; i++) {
                const randomNum1 = Math.floor(Math.random() * 90) + 10;
                const randomSym1 = symbols[Math.floor(Math.random() * symbols.length)];
                password += randomSym1 + randomNum1 + capitalizedWords[i];
            }


            const randomNum = Math.floor(Math.random() * 90) + 10;
            const randomSym = symbols[Math.floor(Math.random() * symbols.length)];

            password = `${password}${randomNum}${randomSym}`;
        } else {

            let u = lettersUpper;
            let l = lettersLower;
            let n = numbers;
            let s = symbols;


            if (chkConfusos.checked) {
                const ambiguous = /[il1Lo0O|]/g;
                u = u.replace(ambiguous, '');
                l = l.replace(ambiguous, '');
                n = n.replace(ambiguous, '');
                s = s.replace(ambiguous, '');
            }

            let charPool = '';
            if (chkMayuscula.checked) charPool += u;
            if (chkMinuscula.checked) charPool += l;
            if (chkNumeros.checked) charPool += n;
            if (chkSimbolos.checked) charPool += s;




            if (charPool === '') {
                alert('Por favor, selecciona al menos una opción.');
                chkMinuscula.checked = true;
                charPool = l;
            }

            const length = parseInt(lengthRange.value);
            for (let i = 0; i < length; i++) {
                let randomIndex = Math.floor(Math.random() * charPool.length);
                while (i > 0 && charPool[randomIndex] === password[i - 1]) { randomIndex = Math.floor(Math.random() * charPool.length); }
                password += charPool[randomIndex];
            }
        }

        passwordDisplay.textContent = password;
    }

    //  LStorage
    function saveToHistory(pass) {
        let history = JSON.parse(localStorage.getItem('pwd_history')) || [];
        //  dp 5
        if (history[0] !== pass) {
            history.unshift(pass);
            if (history.length > 5) history.pop();
            localStorage.setItem('pwd_history', JSON.stringify(history));
            renderHistory();
        }
    }

    function renderHistory() {
        let history = JSON.parse(localStorage.getItem('pwd_history')) || [];
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<li style="color: #64748b; justify-content: center;">Sin historial aún</li>';
            return;
        }

        history.forEach(pass => {
            const li = document.createElement('li');
            li.innerHTML = `
            <span>${pass}</span>
            <button onclick="copySpecific('${pass}')">Copiar</button>
        `;
            historyList.appendChild(li);
        });
    }


    window.copySpecific = function(pass) {
        navigator.clipboard.writeText(pass);
        showToast("¡Contraseña del historial copiada!");
    }

    btnGenerate.addEventListener('click', async() => {
        await generatePassword();
        saveToHistory(passwordDisplay.textContent);
    });

    btnCopiar.addEventListener('click', () => {
        const passwordText = passwordDisplay.textContent;
        if (passwordText === 'password' || !passwordText) return;

        navigator.clipboard.writeText(passwordText).then(() => {
            showToast("¡Contraseña copiada con éxito!");
            saveToHistory(passwordText);
        });
    });





})