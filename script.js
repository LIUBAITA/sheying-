document.addEventListener('DOMContentLoaded', function() {
    // 轮播图功能
    const carousel = document.querySelector('.carousel-container');
    const carouselImages = carousel.querySelectorAll('img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
    const totalImages = carouselImages.length;

    // 克隆第一张和最后一张图片用于无缝循环
    const firstClone = carouselImages[0].cloneNode(true);
    const lastClone = carouselImages[totalImages - 1].cloneNode(true);
    
    // 添加克隆的图片到轮播图首尾
    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, carouselImages[0]);

    // 初始位置设置为第一张实际图片
    currentIndex = 1;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    function updateCarousel(transition = true) {
        if (transition) {
            carousel.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carousel.style.transition = 'none';
        }
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
        if (currentIndex >= totalImages + 1) {
            // 当到达克隆的最后一张图片时，瞬间切换回第一张实际图片
            carousel.style.transition = 'none';
            currentIndex = 1;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease-in-out';
                currentIndex++;
                updateCarousel();
            }, 10);
        } else {
            currentIndex++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentIndex <= 0) {
            // 当到达克隆的第一张图片时，瞬间切换到最后一张实际图片
            carousel.style.transition = 'none';
            currentIndex = totalImages;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease-in-out';
                currentIndex--;
                updateCarousel();
            }, 10);
        } else {
            currentIndex--;
            updateCarousel();
        }
    }

    // 自动轮播
    const autoSlide = setInterval(nextSlide, 5000);

    // 鼠标悬停时暂停自动轮播
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });

    // 鼠标离开时恢复自动轮播
    carousel.addEventListener('mouseleave', () => {
        setInterval(nextSlide, 5000);
    });

    // 按钮事件监听
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 处理过渡结束事件
    carousel.addEventListener('transitionend', () => {
        if (currentIndex >= totalImages + 1) {
            carousel.style.transition = 'none';
            currentIndex = 1;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        if (currentIndex <= 0) {
            carousel.style.transition = 'none';
            currentIndex = totalImages;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 图片筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            galleryGrid.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 修改点赞功能
    function initializeLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');
        
        // 从localStorage获取已点赞状态
        const likedItems = JSON.parse(localStorage.getItem('likedItems')) || {};

        likeButtons.forEach((button, index) => {
            // 初始化点赞状态
            if (likedItems[index]) {
                button.classList.add('liked');
                button.innerHTML = '❤ 已点赞';
                button.style.background = '#ff6b81';
            }

            button.addEventListener('click', function() {
                this.classList.toggle('liked');
                
                if (this.classList.contains('liked')) {
                    // 点赞状态
                    this.innerHTML = '❤ 已点赞';
                    this.style.background = '#ff6b81';
                    likedItems[index] = true;
                    
                    // 添加点赞动画
                    const heart = document.createElement('span');
                    heart.className = 'like-animation';
                    heart.innerHTML = '❤';
                    this.appendChild(heart);
                    
                    setTimeout(() => heart.remove(), 1000);
                } else {
                    // 取消点赞状态
                    this.innerHTML = '❤ 点赞';
                    this.style.background = '#ff4757';
                    likedItems[index] = false;
                }
                
                // 保存点赞状态到localStorage
                localStorage.setItem('likedItems', JSON.stringify(likedItems));
            });
        });
    }

    // 在 DOMContentLoaded 事件中调用初始化函数
    initializeLikeButtons();

    // 图片懒加载
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    galleryImages.forEach(img => {
        if (img.src) {
            img.dataset.src = img.src;
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 占位图
            imageObserver.observe(img);
        }
    });

    // 图片点击放大预览
    const previewImages = document.querySelectorAll('.gallery-item img');
    previewImages.forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <img src="${this.src}" alt="${this.alt}">
                    <button class="modal-close">×</button>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.modal-close').onclick = () => modal.remove();
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };
        });
    });

    // 添加返回顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    document.body.appendChild(backToTopButton);

    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // 返回顶部点击事件
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 获取所有section元素（只声明一次）
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // 页面滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // 导航栏活动项目高亮
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 活动报名功能
    const joinButtons = document.querySelectorAll('.join-activity');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityItem = this.closest('.activity-item');
            const activityName = activityItem.querySelector('h4').textContent;
            const participants = activityItem.querySelector('.participants');
            const [current, total] = participants.textContent.match(/\d+/g);
            
            if (parseInt(current) < parseInt(total)) {
                if (!this.classList.contains('joined')) {
                    this.classList.add('joined');
                    this.textContent = '已报名';
                    participants.textContent = `已报名：${parseInt(current) + 1}/${total}人`;
                    alert(`恭喜您成功报名"${activityName}"活动！`);
                } else {
                    alert('您已经报名过这个活动了！');
                }
            } else {
                alert('抱歉，该活动报名人数已满！');
            }
        });
    });

    // 私信系统
    const messageIcon = document.querySelector('.message-icon');
    const messageSystem = document.getElementById('messageSystem');
    const closeMessages = document.querySelector('.close-messages');

    messageIcon.addEventListener('click', () => {
        messageSystem.style.display = messageSystem.style.display === 'none' ? 'block' : 'none';
    });

    closeMessages.addEventListener('click', () => {
        messageSystem.style.display = 'none';
    });

    // 发消息功能
    const sendButton = document.querySelector('.send-message');
    const messageInput = document.querySelector('.message-input input');
    const messageList = document.querySelector('.message-list');

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            const messageHTML = `
                <div class="message-item">
                    <img src="images/user-avatar.jpg" alt="我的头像">
                    <div class="message-content">
                        <h4>我</h4>
                        <p>${message}</p>
                        <span class="message-time">刚刚</span>
                    </div>
                </div>
            `;
            messageList.insertAdjacentHTML('beforeend', messageHTML);
            messageInput.value = '';
            messageList.scrollTop = messageList.scrollHeight;
        }
    });

    // QQ客服功能
    const qqContactBtn = document.querySelector('.social-link.qq-contact');
    const qqService = document.querySelector('.qq-service');
    const closeQQService = document.querySelector('.close-qq-service');

    qqContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        qqService.style.display = qqService.style.display === 'none' ? 'block' : 'none';
    });

    closeQQService.addEventListener('click', () => {
        qqService.style.display = 'none';
    });

    // QQ链接点击统计
    const qqLinks = document.querySelectorAll('.qq-contact-btn');
    qqLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 这里可以添加统计代码
            console.log('QQ联系点击：', this.href);
        });
    });

    // 加入我们按钮功能
    const joinModal = document.getElementById('joinModal');
    const joinBtn = document.getElementById('joinUsBtn');
    const closeModal = document.querySelector('.close-modal');
    const joinForm = document.getElementById('joinForm');

    joinBtn.addEventListener('click', () => {
        joinModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        joinModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === joinModal) {
            joinModal.style.display = 'none';
        }
    });

    // 表单提交处理
    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(joinForm);
        const data = Object.fromEntries(formData);
        
        // 这里可以添加表单数据的处理逻辑
        console.log('提交的表单数据：', data);
        
        // 显示成功消息
        alert('申请提交成功！我们会尽快与您联系。');
        joinModal.style.display = 'none';
        joinForm.reset();
    });

    // 登录/注册功能增强
    const loginBtn = document.querySelector('.login-btn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.querySelector('.close-auth-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const navButton = document.querySelector('.nav-button'); // 获取导航栏中的按钮容器

    // 检查登录状态
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navButton.style.display = 'none'; // 隐藏登录/注册按钮
        } else {
            navButton.style.display = 'block'; // 显示登录/注册按钮
        }
    }

    // 页面加载时检查登录状态
    checkLoginStatus();

    // 处理登录表单提交
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('[name="email"]').value;
        const password = loginForm.querySelector('[name="password"]').value;
        
        // 这里添加登录逻辑
        console.log('登录:', { email, password });
        
        // 设置登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // 隐藏登录按钮
        navButton.style.display = 'none';
        
        alert('登录成功！');
        authModal.style.display = 'none';
    });

    // 处理注册表单提交
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('[name="name"]').value;
        const email = registerForm.querySelector('[name="email"]').value;
        const password = registerForm.querySelector('[name="password"]').value;
        const confirmPassword = registerForm.querySelector('[name="confirmPassword"]').value;

        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        
        // 这里添加注册逻辑
        console.log('注册:', { name, email, password });
        
        // 设置登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        // 隐藏登录按钮
        navButton.style.display = 'none';
        
        alert('注册成功！');
        authModal.style.display = 'none';
    });

    // 添加退出登录功能
    function addLogoutButton() {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.textContent = '退出登录';
            logoutBtn.onclick = function() {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                navButton.style.display = 'block';
                this.remove();
                location.reload(); // 刷新页面
            };
            document.querySelector('.nav-container').appendChild(logoutBtn);
        }
    }

    // 页面加载时添加退出按钮
    addLogoutButton();
}); 