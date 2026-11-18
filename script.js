document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const icons = () => window.lucide && lucide.createIcons();
  icons();
  $('#year').textContent = new Date().getFullYear();

  // Mode gelap / terang
  const root = document.documentElement, themeBtn = $('#themeBtn');
  const paint = () => {
    themeBtn.innerHTML = `<i data-lucide="${root.dataset.theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    icons();
  };
  paint();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    paint();
  });

  // Menu mobile
  const menu = $('#menu');
  $('#menuBtn').addEventListener('click', () => menu.classList.toggle('open'));

  // Transisi antar halaman
  document.querySelectorAll('a[href$=".html"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || a.target === '_blank') return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(() => (location.href = a.href), 250);
    });
  });
  addEventListener('pageshow', e => e.persisted && document.body.classList.remove('leaving'));

  // Teks mengetik (halaman Home)
  const typed = $('#typed');
  if (typed) {
    const roles = ['Web Developer Pemula', 'UI Designer', 'Pelajar Kreatif'];
    let r = 0, c = 0, del = false;
    (function type() {
      const w = roles[r];
      typed.textContent = w.slice(0, del ? --c : ++c);
      let wait = del ? 45 : 90;
      if (!del && c === w.length) { del = true; wait = 1400; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(type, wait);
    })();
  }

  // Muncul saat scroll, bar skill, hitung angka
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    el.querySelectorAll('[data-w]').forEach(b => b.style.width = b.dataset.w + '%');
    el.querySelectorAll('[data-count]').forEach(n => {
      const max = +n.dataset.count; let v = 0;
      const t = setInterval(() => { n.textContent = ++v; if (v >= max) clearInterval(t); }, 1000 / (max + 8));
    });
    io.unobserve(el);
  }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });

  // Filter (Skills & Project)
  document.querySelectorAll('.filters button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('#items [data-cat]').forEach(it => {
      const ok = btn.dataset.filter === 'all' || it.dataset.cat === btn.dataset.filter;
      it.classList.toggle('hide', !ok);
      if (ok) { it.classList.remove('pop'); void it.offsetWidth; it.classList.add('pop'); it.classList.add('in'); }
    });
  }));

  // Tombol ke atas
  const toTop = $('#toTop');
  addEventListener('scroll', () => toTop.classList.toggle('show', scrollY > 500), { passive: true });
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Form kontak
  const send = $('#sendBtn');
  if (send) {
    const toast = $('#toast');
    const show = m => { toast.textContent = m; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); };
    send.addEventListener('click', () => {
      const n = $('#fName').value.trim(), em = $('#fEmail').value.trim(), m = $('#fMsg').value.trim();
      if (!n || !em || !m) return show('Lengkapi nama, email, dan pesan dulu ya.');
      if (!/^\S+@\S+\.\S+$/.test(em)) return show('Format email belum benar.');
      location.href = `mailto:email@contoh.com?subject=${encodeURIComponent('Pesan dari ' + n)}&body=${encodeURIComponent(`Nama: ${n}\nEmail: ${em}\n\n${m}`)}`;
      show('Terima kasih, pesanmu siap dikirim!');
    });
  }
});