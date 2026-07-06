<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=26&duration=3500&pause=1000&color=6C63FF&center=true&vCenter=true&width=520&lines=Hi+there%2C+I'm+%E6%9F%AF%E4%BA%91%E8%B6%85+(kyc)+%F0%9F%91%8B;Nankai+University+CS+%7C+Class+of+2028;Video+Generation+%C2%B7+World+Model+%C2%B7+AI+Infra" alt="Typing SVG" />
</a>

<p>
  <a href="https://kyc001.github.io/"><img src="https://img.shields.io/badge/Blog-kyc001.github.io-6C63FF?style=for-the-badge&logo=astro&logoColor=white" /></a>
  <a href="https://github.com/kyc001"><img src="https://img.shields.io/badge/GitHub-kyc001-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="mailto:852117630@qq.com"><img src="https://img.shields.io/badge/Email-852117630@qq.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" /></a>
</p>

<i>苔花如米小，也学牡丹开。</i>

</div>

---

## 👋 About Me

我是 **kyc001**，南开大学**计算机科学与技术（计算机科学卓越班）** 2024 级本科生。

我喜欢从"底层机制"到"前沿模型"打通理解：既动手实现过数据库内核、全系统模拟器，也在 A800 上做视频扩散模型的微调实验。业余时间持续维护个人技术博客，用"教学版 / 直觉比喻 + 公式推导"的方式把学到的东西写清楚。

---

## 🔬 Research Interests

<div align="center">

| 方向 | 关注点 |
| :--- | :--- |
| **生成模型** | Diffusion / Flow-Matching |
| **视频生成** | Wan / CogVideoX 架构、长视频与可控生成 |
| **世界模型** | 交互式视频生成 / Interactive World Model |
| **系统方向** | Agent Runtime、AI Infra、分布式训练 |

</div>

---

## 🚀 Featured Projects

> 简历篇幅有限，这里展开每个项目的细节，欢迎点进仓库查看代码与文档。

### 🔍 NKU 校内垂直搜索引擎 &nbsp;`2026.05 – 2026.06`
[![Repo](https://img.shields.io/badge/Repo-nku--campus--search-181717?style=flat-square&logo=github)](https://github.com/kyc001/nku-campus-search) ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white) ![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=flat-square&logo=elasticsearch&logoColor=white)

信息检索课程项目，**独立完成**端到端垂直搜索系统。

- **端到端检索链路**：从礼貌爬取（遵守 robots.txt）、多格式解析（HTML / PDF / DOC / XLS）到倒排索引构建与查询解析，语料规模 **13.2 万文档 / 356 主机 / 12.4 万网页快照 / 7452 附件**。
- **排序与召回**：实现 **TF-IDF / 向量空间模型 + PageRank + 新鲜度 / 个性化重排** 的混合排序；采用 **Elasticsearch + 本地倒排索引双召回**（ES 故障时本地兜底），支持站内 / 短语 / 通配查询。
- **产品化与工程化**：实现网页快照、查询日志、个性化推荐等功能，并以 **pytest + 端到端 selfcheck** 保证系统可靠性。

### 🗄️ BusTub 关系型数据库内核实现（CMU 15-445）&nbsp;`2026.01 – 2026.03`
[![Docs](https://img.shields.io/badge/复盘笔记-bustub--docs-6C63FF?style=flat-square&logo=readthedocs&logoColor=white)](https://kyc001.github.io/) ![C++](https://img.shields.io/badge/C++17-00599C?style=flat-square&logo=cplusplus&logoColor=white) ![Leaderboard](https://img.shields.io/badge/Leaderboard-Top%205-FFD700?style=flat-square)

独立完成 CMU 15-445 全部核心 Project，实现一个可运行的关系型数据库内核。

- **完整内核实现**：**Buffer Pool Manager**（含 ARC 替换策略）、**B+Tree 索引**（含并发版本）、**Query Execution**（火山模型算子链）、**Concurrency Control**（MVCC + 2PL）。
- **测试与调优**：通过线上 Gradescope 全部测试用例；独立分析 Buffer Pool 多线程竞态、函数依赖与冗余字段等典型故障与设计权衡，将性能优化至 **Leaderboard 前 5 名**。

### 🖥️ NEMU 全系统模拟器（NJU ICS PA1–PA5）&nbsp;`2026.03 – 2026.06`
[![Repo](https://img.shields.io/badge/Repo-ics2017-181717?style=flat-square&logo=github)](https://github.com/kyc001/ics2017) ![C](https://img.shields.io/badge/C-A8B9CC?style=flat-square&logo=c&logoColor=black)

从零构建一个可运行完整程序的全系统模拟环境。

- **独立完成 PA1–PA5**：从指令级模拟器（取指-译码-执行、寄存器 / 内存建模、表达式求值与监视点），到异常 / 系统调用，再到 **Nanos-lite** 操作系统与 **AM / Navy-apps** 应用。
- **系统底层理解**：深入掌握指令系统、运行时环境、上下文切换与分时多任务 / 虚拟内存等机制。

### 📱 知序 · HarmonyOS 专注效率应用（全栈）&nbsp;`2026.05 – 2026.06`
[![Repo](https://img.shields.io/badge/Repo-focusflow--harmony-181717?style=flat-square&logo=github)](https://github.com/kyc001/focusflow-harmony) ![ArkTS](https://img.shields.io/badge/ArkTS-000000?style=flat-square&logo=huawei&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)

鸿蒙全栈开发的专注与任务管理应用，打通完整前后端能力闭环。

- **前后端全栈**：ArkTS / ArkUI 开发前端，后端采用 Spring Boot / MyBatis / MySQL。
- **本地优先 + 云同步**：设计本地优先的数据同步方案，采用 **JWT 鉴权、updatedAt 游标增量同步、clientRequestId 幂等、墓碑删除** 保证多端一致性；用 **TaskPool（@Concurrent）** 在后台并发预计算复盘统计。

### ✍️ 个人技术博客与知识库系统 &nbsp;`2024.11 – 至今`
[![Blog](https://img.shields.io/badge/Live-kyc001.github.io-6C63FF?style=flat-square&logo=astro&logoColor=white)](https://kyc001.github.io/) ![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat-square&logo=astro&logoColor=white) ![Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

独立设计、开发并持续维护的技术博客，已发布 **39+ 篇** 原创技术文章。

- **内容覆盖**：视频生成（Wan / Yan / VIST3A）、3D 重建与 3DGS（CUT3R / Spann3r / LangSplat / SIU3R）、机器学习理论、计算机图形学（OpenGL 系列）、Jittor 框架实践等。
- **技术实现**：**Astro** 构建高性能静态站点，**GitHub Actions** 实现 CI/CD 自动化部署；独立编写多个 **React** 组件，实现 mkdocs 风格目录导航与个性化代码高亮主题。

### 🧠 Jittor 框架目标检测复现
![Jittor](https://img.shields.io/badge/Jittor-Framework-red?style=flat-square)

在国产深度学习框架 Jittor 下复现多个目标检测模型：
[Gold-YOLO](https://github.com/kyc001/Gold-YOLO-Jittor) · [RT-DETR](https://github.com/kyc001/RT-DETR-Jittor) · [NanoDet](https://github.com/kyc001/NanoDet)

---

## 🛠️ Tech Stack

**Languages**

![C++](https://img.shields.io/badge/C/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**AI / Video Generation**

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Jittor](https://img.shields.io/badge/Jittor-CC0000?style=for-the-badge&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)

> Wan · CogVideoX · DiT · Diffusion / Flow-Matching · 3D Gaussian Splatting · LoRA · DPO / GRPO

**Web / Full-Stack**

![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)

**Systems & Tools**

![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![LaTeX](https://img.shields.io/badge/LaTeX-008080?style=for-the-badge&logo=latex&logoColor=white)

---

## 🏆 Honors & Awards

- 🥇 **2025 全国大学生数学建模竞赛（CUMCM）天津赛区省一等奖**（B 题，建模手）
- 🥇 **2025 天津市大学生数学竞赛一等奖**（全市 Top 0.5%）
- 🎖️ **2024–2025 南开大学公能奖学金**（校级综合最高档，授予 Top 5% 学生）；校「三好学生」
- 🥇 **2023 全国中学生物理竞赛省级一等奖**

---

## 📊 GitHub Stats

<div align="center">

<img height="165" src="https://github-readme-stats.vercel.app/api?username=kyc001&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" />
<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=kyc001&layout=compact&theme=tokyonight&hide_border=true&langs_count=8" />

<img src="https://github-readme-streak-stats.herokuapp.com/?user=kyc001&theme=tokyonight&hide_border=true" />

</div>

---

<div align="center">
<i>Thanks for visiting! 欢迎点开我的仓库和博客了解更多 🚀</i>
</div>
