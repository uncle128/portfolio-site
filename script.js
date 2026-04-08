const LOCAL_STORAGE_KEY = 'portfolio-site-config-v2';

let defaultConfig = {};
let currentConfig = {};

const settingsTrigger = document.getElementById('settingsTrigger');
const adminOverlay = document.getElementById('adminOverlay');
const adminLogin = document.getElementById('adminLogin');
const adminPanel = document.getElementById('adminPanel');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminError = document.getElementById('adminError');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminCloseBtn = document.getElementById('adminCloseBtn');
const adminPanelClose = document.getElementById('adminPanelClose');
const saveLocalBtn = document.getElementById('saveLocalBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFileInput = document.getElementById('importFileInput');
const resetBtn = document.getElementById('resetBtn');

function observeReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function setText(key, value) {
  document.querySelectorAll(`[data-bind="${key}"]`).forEach((el) => {
    el.textContent = value ?? '';
  });
}

function setHref(key, value) {
  document.querySelectorAll(`[data-bind-href="${key}"]`).forEach((el) => {
    if (value) el.setAttribute('href', value);
  });
}

function applySectionVisibility() {
  const sectionMap = {
    services: currentConfig.showServices,
    about: currentConfig.showAbout,
    contact: currentConfig.showContact,
  };

  Object.entries(sectionMap).forEach(([name, show]) => {
    const section = document.querySelector(`[data-section="${name}"]`);
    if (section) section.style.display = show ? '' : 'none';
  });
}

function applyConfig(config) {
  currentConfig = { ...config };
  Object.entries(currentConfig).forEach(([key, value]) => {
    if (typeof value === 'boolean') return;
    if (key.endsWith('Href')) {
      setHref(key, value);
    } else {
      setText(key, value);
    }
  });

  document.title = `${currentConfig.brandName || '作品集'}｜电商作品集`;
  applySectionVisibility();
  fillAdminForm();
}

function fillAdminForm() {
  document.querySelectorAll('[data-config-key]').forEach((input) => {
    const key = input.dataset.configKey;
    const value = currentConfig[key];
    if (input.type === 'checkbox') {
      input.checked = Boolean(value);
    } else {
      input.value = value ?? '';
    }
  });
}

function collectFormConfig() {
  const nextConfig = { ...currentConfig };
  document.querySelectorAll('[data-config-key]').forEach((input) => {
    const key = input.dataset.configKey;
    nextConfig[key] = input.type === 'checkbox' ? input.checked : input.value;
  });
  return nextConfig;
}

function openLogin() {
  adminOverlay.classList.add('is-open');
  adminLogin.classList.remove('hidden');
  adminPanel.classList.add('hidden');
  adminError.textContent = '';
  adminPasswordInput.value = '';
  adminPasswordInput.focus();
}

function closeAdmin() {
  adminOverlay.classList.remove('is-open');
}

function openPanel() {
  adminLogin.classList.add('hidden');
  adminPanel.classList.remove('hidden');
  fillAdminForm();
}

function loginAdmin() {
  const password = adminPasswordInput.value.trim();
  if (password !== String(defaultConfig.adminPassword || '123456')) {
    adminError.textContent = '密码不对，再试一次。';
    return;
  }
  adminError.textContent = '';
  openPanel();
}

function saveLocal() {
  const nextConfig = collectFormConfig();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextConfig));
  applyConfig(nextConfig);
  saveLocalBtn.textContent = '已保存';
  window.setTimeout(() => {
    saveLocalBtn.textContent = '保存到当前浏览器';
  }, 1200);
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportConfig() {
  const nextConfig = collectFormConfig();
  applyConfig(nextConfig);
  downloadFile('site-config.json', JSON.stringify(nextConfig, null, 2), 'application/json');
}

function importConfigFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const merged = { ...defaultConfig, ...parsed };
      applyConfig(merged);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      alert('导入成功。');
    } catch (error) {
      alert('导入失败，文件不是有效的 JSON。');
    }
  };
  reader.readAsText(file, 'utf-8');
}

function resetConfig() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  applyConfig(defaultConfig);
}

async function initConfig() {
  const response = await fetch('./site-config.json', { cache: 'no-store' });
  defaultConfig = await response.json();
  const localConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
  const merged = localConfig ? { ...defaultConfig, ...JSON.parse(localConfig) } : defaultConfig;
  applyConfig(merged);
}

settingsTrigger.addEventListener('click', openLogin);
adminCloseBtn.addEventListener('click', closeAdmin);
adminPanelClose.addEventListener('click', closeAdmin);
adminLoginBtn.addEventListener('click', loginAdmin);
adminPasswordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') loginAdmin();
});
adminOverlay.addEventListener('click', (event) => {
  if (event.target === adminOverlay) closeAdmin();
});
saveLocalBtn.addEventListener('click', saveLocal);
exportBtn.addEventListener('click', exportConfig);
importBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', (event) => {
  const [file] = event.target.files || [];
  if (file) importConfigFile(file);
  event.target.value = '';
});
resetBtn.addEventListener('click', resetConfig);

document.querySelectorAll('[data-config-key]').forEach((input) => {
  input.addEventListener('input', () => {
    const nextConfig = collectFormConfig();
    applyConfig(nextConfig);
  });
  if (input.type === 'checkbox') {
    input.addEventListener('change', () => {
      const nextConfig = collectFormConfig();
      applyConfig(nextConfig);
    });
  }
});

observeReveal();
initConfig().catch(() => {
  console.error('配置加载失败');
});
