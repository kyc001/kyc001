<img align="right" width="150" src="./avatar.jpg" alt="Yunchao Ke">

# Yunchao Ke / 柯云超

Undergraduate in Computer Science at [Nankai University](https://www.nankai.edu.cn/), enrolled in the Computer Science Elite Program. I am a research assistant at the Media Computing Lab (VCIP), working at the intersection of generative models and interactive intelligence.

My current interests include:

- **Interactive video generation and world action models**, especially controllable generation, long-horizon consistency, and memory across changing viewpoints.
- **Agent learning and evaluation**, including verifier-centric workflows, Agentic RL, replayable agent runtimes, and multi-agent collaboration.
- **Systems for AI**, from model migration and evaluation infrastructure to databases and parallel computing.

> 苔花如米小，也学牡丹开。

[Blog](https://kyc001.github.io/) · [Email](mailto:keyunchao001@gmail.com) · [GitHub](https://github.com/kyc001)

## Selected Work

| Project | What I built |
| --- | --- |
| **[Assessment Workbench](https://github.com/kyc001/assessment-workbench)** | A verifier-centric multi-agent evaluation workbench with versioned artifacts, SQLite checkpoints, an event ledger, targeted retries, and replayable trajectories. The FastAPI/React interface supports inspection, editing, LaTeX compilation, and PDF release gates; the included acceptance run produces a 19-question, 150-point assessment across 65 isolated child runs and 34 rendered pages. |
| **[Parallel ANN Systems](https://github.com/kyc001/parallel)** | A systematic study of approximate nearest-neighbor search across SIMD, Pthreads/OpenMP, MPI, and CUDA. The repository connects recall-latency trade-offs with profiling and bottleneck migration, covering AVX2/NEON kernels, IVF/PQ/HNSW variants, distributed candidate merging, and GPU Top-k pipelines. |
| **[Object Detection on Jittor](https://github.com/kyc001/NanoDet)** | Cross-framework ports of [NanoDet-Plus](https://github.com/kyc001/NanoDet), [RT-DETR](https://github.com/kyc001/RT-DETR-Jittor), and [Gold-YOLO](https://github.com/kyc001/Gold-YOLO-Jittor) from PyTorch to Jittor, including model components, losses, EMA, weight conversion, and numerical regression tools. NanoDet-Plus reached 0.3194 mAP and 114.5 FPS on VOC2007, with less than 1% accuracy change after bidirectional weight conversion. |
| **[NKU Campus Search](https://github.com/kyc001/nku-campus-search)** | An end-to-end vertical search engine for Nankai University resources: polite crawling, HTML/PDF/Office parsing, local and Elasticsearch recall, TF-IDF/VSM and PageRank-based ranking, snapshots, query logs, and personalization. The recorded corpus contains more than 130,000 documents from 343 hosts. |

## Technical Focus

I mainly work with **Python, C++17, C, and TypeScript**. My recent projects use **PyTorch, Jittor, FastAPI, React, SQLite, CUDA, OpenMP/MPI, Linux, and LaTeX**. I care about reproducible experiments, explicit system state, numerical alignment, and evidence that can be inspected rather than only reported.

## Writing

I maintain a [technical blog and knowledge base](https://kyc001.github.io/) with notes on video generation, 3D reconstruction, machine learning, computer graphics, database systems, and model implementation. Recent topics include Wan video diffusion models, interactive video generation, 3D foundation models, CMU 15-445, and Stanford CS336.

## Selected Recognition

- First Prize, 2025 China Undergraduate Mathematical Contest in Modeling, Tianjin Division
- First Prize, 2025 Tianjin Undergraduate Mathematics Competition
- Nankai University Gongneng Scholarship and Outstanding Student, 2024-2025
