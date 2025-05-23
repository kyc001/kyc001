<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的GitHub主页</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6; /* Tailwind gray-100 */
        }
        .profile-card {
            background-color: white;
            border-radius: 0.75rem; /* Tailwind rounded-xl */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Tailwind shadow-lg */
            transition: transform 0.3s ease-in-out;
        }
        .profile-card:hover {
            transform: translateY(-5px);
        }
        .section-title {
            font-size: 1.5rem; /* Tailwind text-2xl */
            font-weight: 600; /* Tailwind font-semibold */
            color: #1f2937; /* Tailwind gray-800 */
            margin-bottom: 1rem; /* Tailwind mb-4 */
            padding-bottom: 0.5rem; /* Tailwind pb-2 */
            border-bottom: 2px solid #60a5fa; /* Tailwind blue-400 */
        }
        .skill-badge {
            background-color: #bfdbfe; /* Tailwind blue-200 */
            color: #1e40af; /* Tailwind blue-800 */
            padding: 0.25rem 0.75rem; /* Tailwind px-3 py-1 */
            border-radius: 9999px; /* Tailwind rounded-full */
            font-size: 0.875rem; /* Tailwind text-sm */
            font-weight: 500; /* Tailwind font-medium */
            margin: 0.25rem; /* Tailwind m-1 */
            display: inline-block;
        }
        .project-card {
            border: 1px solid #e5e7eb; /* Tailwind gray-200 */
            border-radius: 0.5rem; /* Tailwind rounded-lg */
            padding: 1rem; /* Tailwind p-4 */
            transition: box-shadow 0.3s ease-in-out;
        }
        .project-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Tailwind shadow-md */
        }
        .social-icon {
            font-size: 1.5rem; /* Tailwind text-2xl */
            color: #4b5563; /* Tailwind gray-600 */
            transition: color 0.3s ease;
        }
        .social-icon:hover {
            color: #1d4ed8; /* Tailwind blue-700 */
        }
        /* 添加一个简单的加载动画 */
        .loader {
            border: 4px solid #f3f3f3; /* Light grey */
            border-top: 4px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="text-gray-700">

    <div class="container mx-auto p-4 md:p-8 max-w-4xl">

        <header class="profile-card p-6 md:p-8 mb-8 text-center md:text-left md:flex md:items-center">
            <img id="profile-avatar" src="avatar.jpg" alt="我的头像" class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto md:mx-0 md:mr-8 border-4 border-blue-300 object-cover" onerror="this.src='https://placehold.co/150x150/cccccc/ffffff?text=加载失败'">
            <div>
                <h1 id="profile-name" class="text-3xl md:text-4xl font-bold text-gray-800">kyc001</h1>
                <p id="profile-title" class="text-xl text-blue-600 mt-1">计科大一本科生/AI爱好者</p>
                <p id="profile-bio" class="mt-3 text-gray-600 text-md">Think twice,Code Once.</p>
                <div id="social-links" class="mt-4 flex justify-center md:justify-start space-x-4">
<a href="https://github.com/kyc001" target="_blank" class="social-icon" aria-label="GitHub"><i class="fab fa-github"></i></a>
                    <a href="#" target="_blank" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="#" target="_blank" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="https://kyc001.github.io/" target="_blank" class="social-icon" aria-label="个人网站"><i class="fas fa-globe"></i></a>
                </div>
            </div>
        </header>

        <section id="about-me" class="profile-card p-6 md:p-8 mb-8">
            <h2 class="section-title">🚀 关于我</h2>
            <div class="space-y-3 text-gray-600">
                <p>NKU 24级本科生</p>
                <p>喜欢AI，数学，物理</p>
            </div>
        </section>

        <section id="skills" class="profile-card p-6 md:p-8 mb-8">
            <h2 class="section-title">🛠️ 我的技能</h2>
            <div class="flex flex-wrap">
                <span class="skill-badge">C++</span>
                <span class="skill-badge">React</span>
                <span class="skill-badge">Node.js</span>
                <span class="skill-badge">Pytorch</span>
                <span class="skill-badge">Conda</span>
                <span class="skill-badge">Git & GitHub</span>
                </div>
        </section>

        <section id="featured-projects" class="profile-card p-6 md:p-8 mb-8">
            <h2 class="section-title">💡 精选项目</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="project-card">
                    <h3 class="text-xl font-semibold text-blue-700 mb-2">Survivors游戏项目</h3>
                    <img src="bg.jpg" alt="Survivors游戏截图" class="rounded mb-2 w-full h-auto object-cover" onerror="this.src='https://placehold.co/600x400/cccccc/ffffff?text=图片加载失败'">
                    <p class="text-sm text-gray-600 mb-3">这是一个基于C++和Qt框架开发的动作生存类游戏。玩家可以选择不同类型的英雄，在游戏地图中与各种敌人展开战斗。游戏具备丰富的武器系统、角色升级机制，还支持多种控制模式。同时，游戏采用了模块化的设计，便于代码的维护和扩展。</p>
                    <div class="mb-3">
                        <span class="skill-badge text-xs">C++</span>
                        <span class="skill-badge text-xs">Qt</span>
                        <span class="skill-badge text-xs">CMake</span>
                    </div>
                    <a href="#" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium">查看项目 &rarr;</a>
                    <a href="#" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium ml-4">查看源码 &rarr;</a>
                </div>
                <div class="project-card">
                    <h3 class="text-xl font-semibold text-blue-700 mb-2">基于 YOLOv5 的目标检测系统</h3>
                     <img src="https://raw.githubusercontent.com/ultralytics/assets/main/yolov8/banner-yolov8.png" alt="项目截图" class="rounded mb-2 w-full h-auto object-cover" onerror="this.src='https://placehold.co/600x400/cccccc/ffffff?text=图片加载失败'">
                    <p class="text-sm text-gray-600 mb-3">这是一个基于 YOLOv5 的目标检测系统。YOLOv5 是由 Ultralytics 开发的尖端计算机视觉模型，基于 PyTorch 框架，以其易用性、速度和准确性而闻名。该系统可用于各种视觉 AI 任务，包括目标检测、图像分割和图像分类。系统支持多种数据集，如 COCO、Argoverse、Objects365 等，并且提供了图形化界面，方便用户进行操作。</p>
                     <div class="mb-3">
                        <span class="skill-badge text-xs">Python</span>
                        <span class="skill-badge text-xs">PyTorch</span>
                        <span class="skill-badge text-xs">YOLOv5</span>
                        <span class="skill-badge text-xs">OpenCV</span>
                    </div>
                    <a href="https://github.com/kyc001/aimbot-on-yolov5" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium">查看项目 &rarr;</a>
                    <a href="https://github.com/ultralytics/yolov5" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium ml-4">查看源码 &rarr;</a>
                </div>
                </div>
        </section>

        <section id="github-stats" class="profile-card p-6 md:p-8 mb-8">
            <h2 class="section-title">📊 GitHub 统计</h2>

            <div class="text-center space-y-4">
                <div class="loader" id="stats-loader"></div>
                <img id="github-stats-card" src="https://github-readme-stats.vercel.app/api?username=kyc001&show_icons=true&theme=radical&rank_icon=github" alt="GitHub Stats" class="mx-auto rounded hidden" onerror="this.style.display='none'; document.getElementById('stats-loader').style.display='block'; console.error('GitHub Stats image failed to load.')">
                <img id="github-top-langs" src="https://github-readme-stats.vercel.app/api/top-langs/?username=kyc001&layout=compact&theme=radical" alt="Top Languages" class="mx-auto rounded hidden" onerror="this.style.display='none'; document.getElementById('stats-loader').style.display='block'; console.error('Top Languages image failed to load.')">
                <!--
                使用方法:
                1. 访问 https://github.com/anuraghazra/github-readme-stats
                2. 按照说明生成你的统计卡片链接
                3. 替换下面的 src (确保用户名正确)
                <img id="github-stats-card" src="https://github-readme-stats.vercel.app/api?username=kyc001&show_icons=true&theme=radical&rank_icon=github" alt="GitHub Stats" class="mx-auto rounded">
                <img id="github-top-langs" src="https://github-readme-stats.vercel.app/api/top-langs/?username=kyc001&layout=compact&theme=radical" alt="Top Languages" class="mx-auto rounded">
                -->
            </div>
        </section>

        <section id="current-focus" class="profile-card p-6 md:p-8 mb-8">
            <h2 class="section-title">🔭 当前关注</h2>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
                <li>🌱 我目前正在学习 计算机视觉/深度学习。</li>
                <li>👯 我希望在 CV 上进行合作。</li>
                <li>🤔 我正在寻求 pytorch 的帮助。</li>
                <li>💬 可以问我关于 物理/数学 的问题。</li>
                <li>📫 如何联系我: <a href="mailto:kyc001@mail.nankai.edu.cn" class="text-blue-600 hover:underline">kyc001@mail.nankai.edu.cn</a></li>
            </ul>
        </section>

        <footer class="text-center mt-12 mb-6">
            <p class="text-gray-500 text-sm">
                &copy; <span id="current-year"></span> <span id="footer-name">kyc001</span>. 基于 <a href="https://tailwindcss.com/" target="_blank" class="text-blue-500 hover:underline">Tailwind CSS</a> 构建.
            </p>
        </footer>
    </div>

    <script>
        // 动态设置年份和页脚名字
        document.getElementById('current-year').textContent = new Date().getFullYear();
        const profileNameElement = document.getElementById('profile-name');
        const footerNameElement = document.getElementById('footer-name');

        if (profileNameElement && footerNameElement) {
            footerNameElement.textContent = profileNameElement.textContent;
        }

        // 替换为你的 GitHub 用户名来加载统计信息
        const githubUsername = "kyc001"; // <--- 在这里修改你的GitHub用户名

        const statsCard = document.getElementById('github-stats-card');
        const topLangsCard = document.getElementById('github-top-langs');
        const loader = document.getElementById('stats-loader');

        if (githubUsername && githubUsername !== "YOUR_GITHUB_USERNAME") { // Check against placeholder to ensure it's set
            statsCard.src = `https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=radical&rank_icon=github&hide_border=true&locale=cn`;
            topLangsCard.src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=radical&hide_border=true&locale=cn`;

            let imagesLoaded = 0;
            const totalImages = 2;

            function imageLoaded() {
                imagesLoaded++;
                if (imagesLoaded >= totalImages) { // Use >= in case one fails but we still want to hide loader
                    loader.style.display = 'none';
                    // Only show cards if their src is set and they haven't errored out
                    if (statsCard.src && !statsCard.classList.contains('error')) statsCard.classList.remove('hidden');
                    if (topLangsCard.src && !topLangsCard.classList.contains('error')) topLangsCard.classList.remove('hidden');
                }
            }
            
            function imageError(cardElement) {
                cardElement.classList.add('error'); // Mark as errored
                cardElement.style.display='none'; // Hide the broken image icon
                imageLoaded(); // Still count it as "processed" to hide loader
                const statsSection = document.getElementById('github-stats');
                if(statsSection){
                    let errorMsg = statsSection.querySelector('.text-sm.text-gray-500');
                    if(errorMsg) {
                        if (errorMsg.textContent.includes('加载中')) {
                             errorMsg.textContent = "GitHub 统计图表加载失败。请检查用户名 ("+githubUsername+") 或网络。";
                        } else if (!errorMsg.textContent.includes("失败")) { // Append if not already generic error
                             errorMsg.textContent += " 部分图表加载失败。";
                        }
                    }
                }
            }

            statsCard.onload = imageLoaded;
            topLangsCard.onload = imageLoaded;

            statsCard.onerror = () => {
                console.error('GitHub Stats Card failed to load for user: ' + githubUsername);
                imageError(statsCard);
            };
            topLangsCard.onerror = () => {
                console.error('GitHub Top Languages Card failed to load for user: ' + githubUsername);
                imageError(topLangsCard);
            };

        } else {
            loader.style.display = 'none';
            const statsSection = document.getElementById('github-stats');
            if(statsSection){
                let placeholderMsg = statsSection.querySelector('.text-sm.text-gray-500');
                if(placeholderMsg) {
                    placeholderMsg.innerHTML = "请在HTML代码中编辑 <code>githubUsername</code> 变量 (当前未设置或仍为占位符) 以显示你的GitHub统计信息。";
                    if (githubUsername === "YOUR_GITHUB_USERNAME") {
                         placeholderMsg.innerHTML = "请在HTML代码底部script标签内，将 <code>YOUR_GITHUB_USERNAME</code> 替换为你的实际GitHub用户名。";
                    }
                }
            }
        }

        // 简单的表单提交/联系方式提示
        // 对于实际的联系表单，你需要后端处理或使用第三方服务
        // 这里仅为示例
        const contactForm = document.querySelector('#contact-form'); // 假设你有一个ID为contact-form的表单
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                // 这里可以添加 AJAX 提交逻辑
                // alert('感谢您的留言！此功能为演示，实际邮件未发送。'); // Replaced with custom modal if needed
                // For now, let's use a console log as alert is forbidden
                console.log('表单提交尝试 (演示).');
                contactForm.reset();
            });
        }
    </script>
</body>
</html>
