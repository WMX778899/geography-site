
// ===== 页面切换过渡动画 =====
(function initPageTransitions() {
    const INTRA_SITE_RE = /^(\/myweb\/|\/|index\.html$|knowledge\/.*\.html$|#)/;
    const pageCache = new Map(); // 页面缓存

    // 预加载函敀    function preloadPage(url) {
        if (pageCache.has(url) || url === '/' || url === 'index.html' || url === '/geography-site/' || url === '/geography-site/index.html') return;
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
            })
            .then(html => {
                if (html) {
                    pageCache.set(url, html);
                }
            })
            .catch(() => {
                // 静默忽略预加载失贀            });
    }

    // 为所有站内链接添加预加载
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || !INTRA_SITE_RE.test(href)) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        if (link.getAttribute('target') === '_blank') return;
        if (href.startsWith('#')) return;

        let url = href;
        if (url === 'index.html' || url === '') url = '/';
        if (url === '/geography-site/index.html' || url === '/geography-site/') url = '/geography-site/';
        preloadPage(url);
    }, { passive: true });

    // 拦截所有站内链接点净    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || !INTRA_SITE_RE.test(href)) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

        // 跳过外部链接、锚点、表单提亀        const target = link.getAttribute('target');
        if (target === '_blank') return;
        if (href.startsWith('#')) return;

        e.preventDefault();

        let url = href;
        if (url === 'index.html' || url === '') url = '/';
        if (url === '/geography-site/index.html' || url === '/geography-site/') url = '/geography-site/';

        // 先检查缓孀        const cachedHtml = pageCache.get(url);

        // 添加加载状怀        document.body.classList.add('page-loading');

        // 创建加载进度杀        const loader = document.createElement('div');
        loader.className = 'page-loader';
        document.body.appendChild(loader);

        // 添加过渡籀        document.body.classList.add('page-transition--out');

        // 缩短延迟时间，减少闪烀        setTimeout(() => {
            const loadPage = () => {
                if (cachedHtml) {
                    // 使用缓存的内宀                    return Promise.resolve(cachedHtml);
                } else {
                    // 从服务器获取
                    return fetch(url)
                        .then(response => {
                            if (!response.ok) throw new Error('Failed to load');
                            return response.text();
                        })
                        .then(html => {
                            pageCache.set(url, html);
                            return html;
                        });
                }
            };

            loadPage()
                .then(html => {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const newBody = doc.body;

                    // 保留 <script> 标签的脚本执血                    const oldScripts = document.querySelectorAll('script[src]');
                    const newScripts = newBody.querySelectorAll('script[src]');

                    document.body.innerHTML = newBody.innerHTML;

                    // 更新 body 页面类名，切换背景（保留过渡用类名）
                    const newPageClass = Array.from(newBody.classList).filter(function(c) { return c.startsWith('page--'); });
                    const oldPageClass = Array.from(document.body.classList).filter(function(c) { return c.startsWith('page--'); });
                    oldPageClass.forEach(function(c) { document.body.classList.remove(c); });
                    newPageClass.forEach(function(c) { document.body.classList.add(c); });

                    // 移除加载指示噀                    if (loader && loader.parentNode) {
                        loader.remove();
                    }

                    // 重新执行外链脚本
                    newScripts.forEach((ns) => {
                        const old = document.querySelector(`script[src="${ns.src}"]`);
                        if (!old) {
                            const s = document.createElement('script');
                            s.src = ns.src;
                            s.async = true;
                            document.head.appendChild(s);
                        }
                    });

                    // 重新初始匀JS 功能
                    initAllFeatures();

                    history.pushState({ url }, '', url);

                    // 移除加载状怀                    document.body.classList.remove('page-loading');

                    // 使用两个requestAnimationFrame确保DOM完全渲染后再淡入
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            document.body.classList.remove('page-transition--out');
                            document.body.classList.add('page-transition--in');
                            requestAnimationFrame(() => {
                                document.body.classList.remove('page-transition--in');
                            });
                        });
                    });
                })
                .catch(() => {
                    // 加载失败，回退到正常跳轀                    document.body.classList.remove('page-transition--out', 'page-loading');
                    if (loader && loader.parentNode) {
                        loader.remove();
                    }
                    window.location.href = href;
                });
        }, 150);
    });

    // 浏览器后退/前进
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.url) {
            location.reload();
        }
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    initAllFeatures();
});

/**
 * 初始化所有页面功能（移动端导航、搜索、折叠、侧边栏、锚点）
 * 可在页面切换后重新调甀 */
function initAllFeatures() {
    initMobileNav();
    initSearch();
    initCollapse();
    initAuthForms();
    highlightSidebar();
    checkAnchor();
    triggerPageAnimations();
    initHomeParallax();
    showSuccessToast();
}

/** 显示登录/注册成功弹窗 */
function showSuccessToast() {
    var params = new URLSearchParams(window.location.search);
    var type = null;
    if (params.get('login') === 'success') type = '登录';
    if (params.get('register') === 'success') type = '注册';
    if (!type) return;

    // 清除 URL 参数，防止刷新后重复显示
    window.history.replaceState({}, '', window.location.pathname);

    // 创建弹窗
    var toast = document.createElement('div');
    toast.id = 'successToast';
    toast.textContent = type + '成功！！';
    toast.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:99999;background:linear-gradient(135deg,#1a7a6d,#2f9d86);color:#fff;padding:14px 36px;border-radius:12px;font-size:1.1rem;font-weight:700;box-shadow:0 8px 32px rgba(26,122,109,0.35),0 4px 12px rgba(0,0,0,0.1);opacity:0;transition:opacity 0.4s ease,transform 0.4s ease;transform:translateX(-50%) translateY(-10px);';
    document.body.appendChild(toast);

    // 淡入
    requestAnimationFrame(function() {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // 3.5 秒后淡出
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(function() { toast.remove(); }, 500);
    }, 3500);
}

// ===== 首页背景视差 =====
let cleanupHomeParallax = null;

function initHomeParallax() {
    if (cleanupHomeParallax) {
        cleanupHomeParallax();
        cleanupHomeParallax = null;
    }

    const body = document.body;
    if (!body || !body.classList.contains('page--home')) {
        return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) {
        body.style.removeProperty('--home-bg-x');
        body.style.removeProperty('--home-bg-y');
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = window.scrollY || 0;
    let rafId = null;

    function applyParallax() {
        rafId = null;
        const scrollOffset = scrollY * 0.1;
        body.style.setProperty('--home-bg-x', `calc(50% + ${mouseX.toFixed(2)}%)`);
        body.style.setProperty('--home-bg-y', `calc(50% + ${mouseY.toFixed(2)}% + ${scrollOffset.toFixed(1)}px)`);
    }

    function requestParallaxFrame() {
        if (rafId === null) {
            rafId = requestAnimationFrame(applyParallax);
        }
    }

    function handleMouseMove(e) {
        const width = window.innerWidth || 1;
        const height = window.innerHeight || 1;
        mouseX = ((e.clientX / width) - 0.5) * 4;
        mouseY = ((e.clientY / height) - 0.5) * 4;
        requestParallaxFrame();
    }

    function handleScroll() {
        scrollY = window.scrollY || window.pageYOffset || 0;
        requestParallaxFrame();
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    applyParallax();

    cleanupHomeParallax = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('wheel', handleScroll);
        window.removeEventListener('scroll', handleScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
        body.style.removeProperty('--home-bg-x');
        body.style.removeProperty('--home-bg-y');
    };
}

// ===== 页面图标抛入动画 =====
function triggerPageAnimations() {
    // 登录/注册页不执行抛入动画
    if (document.body.classList.contains('page--auth')) return;
    // 移除旧的动画类（如果有）
    const animatedElements = document.querySelectorAll('.logo-icon, .module-card__icon, .search-box button, .sidebar__title, .sidebar__toc a, .sidebar__channel, .stat-num, .study-tip-icon, .km-group-title, .hot-topic-tag, .exam-guide-icon, .km-chapter, .channel-banner__actions .btn');

    animatedElements.forEach(el => {
        // 重置动画
        el.style.animation = 'none';
        el.style.opacity = '0';

        // 强制重排
        void el.offsetWidth;

        // 重新应用动画
        el.style.animation = '';
        el.style.opacity = '';
    });

    // Footer特殊处理（跳过登彀注册页）
    const footer = document.querySelector('.footer');
    if (footer && !document.body.classList.contains('page--auth')) {
        footer.style.animation = 'none';
        footer.style.opacity = '0';
        void footer.offsetWidth;
        footer.style.animation = '';
        footer.style.opacity = '';
    }
}

// ===== 移动端导航菜區=====
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('mainNav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('nav--open');
            // 切换汉堡菜单图标状怀            toggle.classList.toggle('nav-toggle--open');
        });

        // 点击导航链接后自动关闭菜區        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('nav--open');
                    toggle.classList.remove('nav-toggle--open');
                }
            });
        });

        // 点击外部区域关闭菜单
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                nav.classList.contains('nav--open') &&
                !nav.contains(e.target) &&
                !toggle.contains(e.target)) {
                nav.classList.remove('nav--open');
                toggle.classList.remove('nav-toggle--open');
            }
        });
    }
}

// ===== 搜索功能 =====
function initSearch() {
    // 清除旧的事件监听（通过克隆节点实现：    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    function performSearch(query) {
        if (!query || typeof KNOWLEDGE_DATA === 'undefined' || !KNOWLEDGE_DATA) {
            if (searchResults) searchResults.classList.remove('search-results--visible');
            return;
        }
        const q = query.toLowerCase().trim();
        // 模糊匹配：任意一个分词命中即返回（OR 逻辑：        const terms = q.split(/\s+/).filter(Boolean);
        const results = KNOWLEDGE_DATA.filter(item => {
            if (terms.length === 0) return true;
            const text = (item.title + ' ' + item.keywords + ' ' + item.desc + ' ' + item.category).toLowerCase();
            return terms.some(t => text.includes(t));
        }).slice(0, 10);

        if (searchResults) {
            if (results.length > 0) {
                searchResults.innerHTML = results.map(r => `
                    <div class="search-result-item" data-page="${r.page}" data-title="${r.title}">
                        <div class="search-result-item__title">${highlight(r.title, q)}</div>
                        <div class="search-result-item__desc">${r.desc.substring(0, 60)}...</div>
                        <span class="search-result-item__tag">${r.category}</span>
                    </div>
                `).join('');
                searchResults.classList.add('search-results--visible');

                // 绑定点击事件
                searchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', () => {
                        navigateToKnowledge(item.dataset.page, item.dataset.title);
                    });
                });
            } else {
                searchResults.innerHTML = '<div class="search-result-item"><div class="search-result-item__title">未找到相关知识点</div></div>';
                searchResults.classList.add('search-results--visible');
            }
        }
    }

    function highlight(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<strong style="color:var(--color-primary)">$1</strong>');
    }

    function navigateToKnowledge(page, title) {
        // 关闭搜索结果
        if (searchResults) searchResults.classList.remove('search-results--visible');
        if (searchInput) searchInput.value = '';

        // 跳转到对应板块页面并定位到知识点，并传递展开标记
        const urlMap = {
            nature: '/geography-site/knowledge/nature.html',
            humanity: '/geography-site/knowledge/humanity.html',
            region: '/geography-site/knowledge/region.html',
            elective: '/geography-site/knowledge/elective.html',
        };
        const targetUrl = urlMap[page] || '/geography-site/index.html';
        window.location.href = targetUrl + '#search:' + encodeURIComponent(title) + '&expand=1';
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput ? searchInput.value : '');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') performSearch(e.target.value);
        });
    }

    // 点击其他地方关闭搜索结果
    document.addEventListener('click', (e) => {
        if (searchResults && !e.target.closest('.search-box')) {
            searchResults.classList.remove('search-results--visible');
        }
    });
}

// ===== 知识点折叀展开 + 全部展开/收起 + localStorage 持久匀=====

const COLLAPSE_STORAGE_KEY = 'geography-collapse-state';

/**
 * 获取 localStorage 中保存的折叠状怀 * @param {string} pageKey - 页面标识（如 nature, humanity： * 返回 Set，包含所有已折叠皀knowledge-point 的索引字符串 "sectionId-index"
 */
function getCollapsedState(pageKey) {
    try {
        const raw = localStorage.getItem(COLLAPSE_STORAGE_KEY + ':' + pageKey);
        if (!raw) return new Set();
        return new Set(JSON.parse(raw));
    } catch {
        return new Set();
    }
}

/**
 * 保存折叠状态到 localStorage
 * @param {Set} state - 折叠状态的 Set
 * @param {string} pageKey - 页面标识
 */
function saveCollapsedState(state, pageKey) {
    try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY + ':' + pageKey, JSON.stringify([...state]));
    } catch {
        // localStorage 不可用时静默忽略
    }
}

function initCollapse() {
    const sections = document.querySelectorAll('.content-section');
    if (sections.length === 0) return;

    sections.forEach(section => {
        const points = section.querySelectorAll('.knowledge-point');

        // 全部折叠（无论首次访问、刷新还是页面切换）
        points.forEach(point => {
            point.classList.add('collapsed');
        });

        // 为每个知识点添加点击事件
        points.forEach(point => {
            point.addEventListener('click', (e) => {
                // 如果点击的是按钮，不触发折叠
                if (e.target.closest('.collapse-btn')) return;
                // 如果点击的是标题内的链接或其他元素，不触发折叀                if (e.target.closest('.knowledge-point__title a')) return;

                point.classList.toggle('collapsed');
            });
        });

        // 为每个章节添劀展开全部/收起全部"按钮
        const header = section.querySelector('.content-section__header');
        if (header) {
            const actionsDiv = header.querySelector('.content-section__header-actions');
            const btn = document.createElement('button');
            btn.className = 'collapse-btn';
            btn.setAttribute('aria-label', '展开/收起全部');
            btn.textContent = '展开全部 ₃;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isAllExpanded = [...points].some(p => !p.classList.contains('collapsed'));
                if (isAllExpanded) {
                    // 收起全部
                    points.forEach((point) => {
                        point.classList.add('collapsed');
                    });
                    btn.textContent = '展开全部 ₃;
                } else {
                    // 展开全部
                    points.forEach((point) => {
                        point.classList.remove('collapsed');
                    });
                    btn.textContent = '收起全部 ₃;
                }
            });
            if (actionsDiv) {
                actionsDiv.appendChild(btn);
            } else {
                header.appendChild(btn);
            }
        }
    });
}

// ===== 登录/注册（通过后端 API 连接 MySQL：=====
const AUTH_CURRENT_USER_KEY = 'geography-demo-current-user';
const AUTH_API_BASE = ''; // 同域，空即可

function initAuthForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) initRegisterForm(registerForm);
    if (loginForm) initLoginForm(loginForm);
}

function setAuthMessage(target, message, type) {
    if (!target) return;
    target.innerHTML = message;
    target.className = 'auth-message auth-message--' + type;
}

function makeCaptcha(length = 5) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < length; i += 1) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function initRegisterForm(form) {
    const captchaDisplay = document.getElementById('registerCaptcha');
    const refreshCaptcha = document.getElementById('refreshCaptcha');
    const message = document.getElementById('registerMessage');
    let currentCaptcha = '';

    function refresh() {
        currentCaptcha = makeCaptcha();
        if (captchaDisplay) captchaDisplay.textContent = currentCaptcha;
    }

    refresh();
    if (refreshCaptcha) {
        refreshCaptcha.addEventListener('click', refresh);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const emailName = String(formData.get('emailName') || '').trim().toLowerCase();
        const emailDomain = String(formData.get('emailDomain') || '').trim();
        const password = String(formData.get('password') || '');
        const confirmPassword = String(formData.get('confirmPassword') || '');
        const captcha = String(formData.get('captcha') || '').trim();
        const email = emailName + emailDomain;

        // 前端校验
        if (!name) {
            setAuthMessage(message, '请输入名称　, 'error');
            return;
        }
        if (!/^[a-z0-9._%+-]+$/i.test(emailName)) {
            setAuthMessage(message, '请输入有效的邮箱前缀　, 'error');
            return;
        }
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            setAuthMessage(message, '密码至少 8 位，并同时包含字母和数字　, 'error');
            return;
        }
        if (password !== confirmPassword) {
            setAuthMessage(message, '两次输入的密码不一致　, 'error');
            return;
        }
        if (captcha.toLowerCase() !== currentCaptcha.toLowerCase()) {
            setAuthMessage(message, '验证码不正确，请重新输入　, 'error');
            refresh();
            return;
        }
        if (email === DEMO_ACCOUNT.email) {
            setAuthMessage(message, '演示账号已内置，请前往<a href="/geography-site/login.html" style="color:var(--color-primary-dark);font-weight:800;">登录页面</a>直接登录　, 'error');
            refresh();
            return;
        }
        // 调用后端注册 API
        try {
            const res = await fetch(AUTH_API_BASE + '/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (data.success) {
                // 注册成功后自动登录：调用登录 API
                try {
                    const loginRes = await fetch(AUTH_API_BASE + '/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const loginData = await loginRes.json();
                    if (loginData.success) {
                        localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify({
                            name: loginData.user.name,
                            email: loginData.user.email,
                            loginAt: new Date().toISOString()
                        }));
                    }
                } catch (e) {}
                setAuthMessage(message, '注册成功，正在进入首页　, 'success');
                form.reset();
                refresh();
                setTimeout(() => { window.location.href = '/geography-site/index.html?register=success'; }, 900);
            } else {
                setAuthMessage(message, data.message, 'error');
                refresh();
            }
        } catch (err) {
            setAuthMessage(message, '网络错误 —请确保后端服务器已运行（在项目目录执血node server.js 或双净start.bat），然后通过 http://localhost:3000 访问网站　, 'error');
            refresh();
        }
    });
}

// ===== 演示账号（无需后端：=====
const DEMO_ACCOUNT = {
    email: 'admin@geo.com',
    password: 'demo1234',
    name: '管理呀
};

function initLoginForm(form) {
    const sendCodeBtn = document.getElementById('sendEmailCode');
    const emailCodeHint = document.getElementById('emailCodeHint');
    const message = document.getElementById('loginMessage');
    let currentEmailCode = '';

    function generateEmailCode() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', () => {
            currentEmailCode = generateEmailCode();
            if (emailCodeHint) {
                emailCodeHint.textContent = '验证码：' + currentEmailCode;
                emailCodeHint.hidden = false;
            }
            setAuthMessage(message, '验证码已生成　, 'success');
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const email = String(formData.get('email') || '').trim().toLowerCase();
        const password = String(formData.get('password') || '');
        const emailCode = String(formData.get('emailCode') || '').trim();

        // ---- 演示账号快速登彀----
        if (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
            localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify({
                name: DEMO_ACCOUNT.name,
                email: DEMO_ACCOUNT.email,
                loginAt: new Date().toISOString()
            }));
            setAuthMessage(message, '演示账号登录成功，正在进入首页　, 'success');
            setTimeout(() => { window.location.href = '/geography-site/index.html?login=success'; }, 900);
            return;
        }

        // ---- 普通登录（需要后端验证码 + API：---
        if (!currentEmailCode) {
            setAuthMessage(message, '请先点击"获取验证砀生成验证码　, 'error');
            return;
        }
        if (emailCode !== currentEmailCode) {
            setAuthMessage(message, '验证码不正确　, 'error');
            return;
        }

        // 调用后端登录 API
        try {
            const res = await fetch(AUTH_API_BASE + '/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify({
                    name: data.user.name,
                    email: data.user.email,
                    loginAt: new Date().toISOString()
                }));
                setAuthMessage(message, '登录成功，正在返回首页　, 'success');
                setTimeout(() => { window.location.href = '/geography-site/index.html?login=success'; }, 900);
            } else {
                setAuthMessage(message, data.message, 'error');
            }
        } catch (err) {
            setAuthMessage(message, '演示账号测试：请使用上方演示账号直接登录　, 'error');
        }
    });
}

// ===== 侧边栏章节高亀=====
function highlightSidebar() {
    const tocLinks = document.querySelectorAll('.sidebar__toc a');
    if (tocLinks.length === 0) return;

    // 如果有锚点，自动滚动到对应位罀    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            tocLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ===== 检查URL锚点 =====
function checkAnchor() {
    const hash = window.location.hash;
    if (hash.startsWith('#search:')) {
        const expandFlag = hash.includes('&expand=1');
        // 解析标题（忽畀&expand=1 后缀：        const titlePart = decodeURIComponent(hash.substring(8).replace(/&expand=1$/, ''));
        // 尝试滚动到匹配的知识炀        const points = document.querySelectorAll('.knowledge-point');
        let matchedPoint = null;
        for (const point of points) {
            const t = point.querySelector('.knowledge-point__title');
            if (t && t.textContent.includes(titlePart)) {
                matchedPoint = point;
                break;
            }
        }

        if (matchedPoint) {
            // 搜索跳转时只展开匹配的那个知识点，其余保持折叀            if (expandFlag) {
                matchedPoint.classList.remove('collapsed');
            }

            // 滚动到匹配位罀            matchedPoint.scrollIntoView({ behavior: 'smooth', block: 'center' });
            matchedPoint.style.boxShadow = '0 0 0 3px var(--color-primary-light)';
            setTimeout(() => { matchedPoint.style.boxShadow = ''; }, 3000);
        }
    }
}
