document.addEventListener('DOMContentLoaded', () => {
    const hexValueEl = document.getElementById('hexValue');
    const colorPreviewEl = document.getElementById('colorPreview');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Default icon and text state for copy button
    const copyBtnOriginalText = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy HEX Code
    `;

    const copyBtnSuccessText = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        Copied!
    `;

    /**
     * Generates a completely random 6-digit hex color code.
     * @returns {string} HEX color string (e.g. #7C3AED)
     */
    function generateRandomHex() {
        // Generate random number from 0 to 16777215 (0xFFFFFF), convert to hex, pad with zeros
        const hex = Math.floor(Math.random() * 16777215).toString(16);
        return `#${hex.padStart(6, '0').toUpperCase()}`;
    }

    /**
     * Applies the specified hex color to the UI elements.
     * @param {string} hexCode 
     */
    function applyColor(hexCode) {
        // Dynamically update the CSS custom property on the document element
        document.documentElement.style.setProperty('--primary-color', hexCode);
        
        // Update the displayed HEX value
        hexValueEl.textContent = hexCode;
    }

    /**
     * Copies the current HEX color code to clipboard.
     */
    async function copyToClipboard() {
        const hexCode = hexValueEl.textContent;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern Clipboard API
                await navigator.clipboard.writeText(hexCode);
            } else {
                // Fallback for non-secure contexts / older browsers
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = hexCode;
                tempTextArea.style.position = 'absolute';
                tempTextArea.style.left = '-9999px';
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
            }

            // Visual feedback transition
            copyBtn.innerHTML = copyBtnSuccessText;
            copyBtn.classList.add('copied');

            // Revert back after 1.5 seconds
            setTimeout(() => {
                copyBtn.innerHTML = copyBtnOriginalText;
                copyBtn.classList.remove('copied');
            }, 1500);

        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy hex code to clipboard.');
        }
    }

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        const newColor = generateRandomHex();
        applyColor(newColor);
    });

    copyBtn.addEventListener('click', copyToClipboard);

    // Initialize with a random color on page load
    const initialColor = generateRandomHex();
    applyColor(initialColor);
});
