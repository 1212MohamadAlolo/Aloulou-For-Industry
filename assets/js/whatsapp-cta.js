(() => {
  const root = document.querySelector('#floatingContact');
  const prompt = document.querySelector('#contactPrompt');
  const promptTitle = document.querySelector('#contactPromptTitle');
  const promptText = document.querySelector('#contactPromptText');
  const close = document.querySelector('#promptClose');
  const link = document.querySelector('#floatingWhatsapp');
  const contactSection = document.querySelector('#contact');
  if (!root || !link) return;

  const productName = document.querySelector('#productRoot h1')?.textContent?.trim();
  if (productName) {
    if (promptTitle) promptTitle.textContent = 'تحتاج مساعدة بهذا المنتج؟';
    if (promptText) promptText.textContent = `اسأل قسم المبيعات عن ${productName}`;
  }

  const message = productName
    ? `مرحبًا قسم المبيعات، أريد الاستفسار عن المنتج: ${productName}`
    : 'مرحبًا قسم المبيعات، أحتاج مساعدة باختيار المنتج المناسب من منتجات علولو للصناعة.';
  link.href = `https://api.whatsapp.com/send?phone=963966248480&text=${encodeURIComponent(message)}`;

  let hidden = false;
  const hidePrompt = () => {
    if (hidden) return;
    hidden = true;
    root.classList.add('prompt-hidden');
    window.setTimeout(() => prompt?.setAttribute('hidden', ''), 430);
  };

  const promptSeen = sessionStorage.getItem('aloulouWhatsappPromptSeenV3') === '1';
  if (promptSeen) {
    hidden = true;
    root.classList.add('prompt-hidden');
    prompt?.setAttribute('hidden', '');
  } else {
    window.setTimeout(() => root.classList.add('is-visible'), 700);
    sessionStorage.setItem('aloulouWhatsappPromptSeenV3', '1');
    window.setTimeout(hidePrompt, 7200);
  }

  close?.addEventListener('click', hidePrompt);
  link.removeAttribute('target');
  link.removeAttribute('rel');
  link.addEventListener('click', hidePrompt);

  if (contactSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) hidePrompt();
    }, { threshold: 0.18 });
    observer.observe(contactSection);
  }
})();
