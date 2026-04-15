document.addEventListener('pointerdown', e => {
	const btn = e.target.closest(':is(button, [type=submit], [type=reset], [type=button], a.button):not(:disabled)');
	if (!btn) return;
	const r = btn.getBoundingClientRect();
	btn.style.setProperty('--_rx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
	btn.style.setProperty('--_ry', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
	btn.classList.remove('is-rippling');
	void btn.offsetWidth;
	btn.classList.add('is-rippling');
});
