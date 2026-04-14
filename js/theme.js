const DEFAULT_THEME = "light";
const THEME_KEY = "theme";
export function initTheme(){
    const saved = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    applyTheme(saved);
    const btn = document.getElementById('theme-toggle');
    if(btn){
        btn.addEventListener('click', toggleTheme);
    }
}
export function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    return next;
}
export function applyTheme(theme){
    document.documentElement.setAttribute('data-theme',theme);
    localStorage.setItem(THEME_KEY,theme);

    const btn = document.getElementById('theme-toggle');
    if(btn){
        const label = theme === "dark" ? 'sombre' : 'clair';
        btn.setAttribute('aria-label',`Thème actuel : ${label} - appuyer pour changer (t)`);
        btn.setAttribute('aria-pressed', String(theme==='dark'));
        btn.textContent = theme === 'dark' ? '☀' : '◐';
    }
    return theme;
}
export function getTheme(){
    return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME; 
}