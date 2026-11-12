document.addEventListener("DOMContentLoaded", () => {

    const passwordDisplay = document.getElementById('password-display');
    const btnCopiar = document.getElementById('btn-copiar');
    const lengthRange = document.getElementById('legth-range');
    const lengthValue = document.getElementById('legth-value');
    const chkMayuscula = document.getElementById('mayuscula');
    const chkMinuscula = document.getElementById('minuscula');
    const chkNumeros = document.getElementById('numeros');
    const chkSimbolos = document.getElementById('simbolos');
    const btnGenerate = document.getElementById('btn-generate');


    const lettersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettersLower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';


    lengthRange.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });


    function generatePassword() {
        let charPool = '';

        if (chkMayuscula.checked) charPool += lettersUpper;
        if (chkMinuscula.checked) charPool += lettersLower;
        if (chkNumeros.checked) charPool += numbers;
        if (chkSimbolos.checked) charPool += symbols;

        // Val
        if (charPool === '') {
            alert('Por favor, selecciona al menos una opción.');
            chkMinuscula.checked = true;
            charPool = lettersLower;
        }

        const length = parseInt(lengthRange.value);
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password += charPool[randomIndex];
        }

        passwordDisplay.textContent = password;
    }


    btnGenerate.addEventListener('click', generatePassword);


    btnCopiar.addEventListener('click', () => {
        const passwordText = passwordDisplay.textContent;

        if (passwordText === 'password' || !passwordText) return;

        navigator.clipboard.writeText(passwordText).then(() => {
            const originalText = btnCopiar.textContent;
            btnCopiar.textContent = '¡Copiado!';
            btnCopiar.style.background = '#22c55e';
            btnCopiar.style.color = '#fff';

            setTimeout(() => {
                btnCopiar.textContent = originalText;
                btnCopiar.style.background = '';
                btnCopiar.style.color = '';
            }, 1500);
        });
    });


    window.addEventListener('DOMContentLoaded', generatePassword);





})