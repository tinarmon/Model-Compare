window.REPORT_DATA = {
  meta: {
    title: "เปรียบเทียบโมเดล OSI Self-Host (≤ 350 GB Q4) เทียบคู่ Baseline 1017 และ 0731",
    subtitle: "คัดกรองเฉพาะสัญญาอนุญาตเสรี OSI (MIT / Apache-2.0) แยก MoE vs Dense พร้อมความสามารถรับภาพ (Vision) และ Coding Benchmark บนชุดทดสอบเดียวกัน",
    updatedAt: "2026-11-27",
    capRule: "Q4 ≤ 350 GB (รวม 68 รุ่น OSI แท้ ครอบคลุมช่วง < 160 GB, 161–200 GB และ 201–350 GB เทียบตรงกับ Baseline 0731/1017)",
    licenseRule: "OSI-Approved Only (MIT / Apache-2.0)",
    excludedSummary: "ตัดโมเดล OSI ขนาด > 350 GB ออก 9 รุ่น และตัดโมเดล Closed API / Custom License ออก 18 รุ่น"
  },

  benchmarks: [
    {
      key: "swePro",
      label: "SWE-bench Pro",
      shortLabel: "SWE-Pro",
      unit: "%",
      higherIsBetter: true,
      description: "แก้ปัญหา Repo หลายภาษา (1,865 ข้อจากโค้ดเบสใหม่/Private) ลดปัญหาท่องจำข้อสอบได้ดีที่สุดในตระกูล SWE",
      comparabilityNote: "ใช้ชุดทดสอบ 1,865 ข้อเดียวกัน (Vendor / Scale SEAL รายงาน; บางรุ่นใช้ Scaffold ต่างกันเช่น Claude Code หรือ SWE-Agent)"
    },
    {
      key: "sweVerified",
      label: "SWE-bench Verified",
      shortLabel: "SWE Verified",
      unit: "%",
      higherIsBetter: true,
      description: "แก้บั๊ก GitHub Python 500 ข้อที่คัดกรองโดยมนุษย์ (ข้อควรระวัง: 1017 มีเฉพาะผล 97/99 subset)",
      comparabilityNote: "Baseline 1017 รายงานเฉพาะ subset 99 ข้อ (98%) ไม่ใช่ 500 ข้อเต็ม — ควรอ่านควบคู่กับ DeepSWE และ SWE-Pro"
    },
    {
      key: "liveCodeBench",
      label: "LiveCodeBench (v6 / Vals)",
      shortLabel: "LiveCodeBench",
      unit: "%",
      higherIsBetter: true,
      description: "โจทย์อัลกอริทึมแข่งขัน (Codeforces/LeetCode/AtCoder) หลังวันตัดข้อมูล ป้องกัน Data Contamination",
      comparabilityNote: "ระบุแหล่งทดสอบในตารางชัดเจน (Vals AI uniform run หรือผล LCB v6 ทางการจากผู้พัฒนา)"
    },
    {
      key: "deepSwe",
      label: "DeepSWE v1.1",
      shortLabel: "DeepSWE",
      unit: "%",
      higherIsBetter: true,
      description: "ประเมิน Software Engineering Agent แบบ Multi-step ที่เขียนชุดทดสอบใหม่เพื่อลดปัญหา Data Leakage",
      comparabilityNote: "เหมาะเทียบความสามารถ Agentic ระหว่าง 1017 (77.0%), MiMo-V2.6-Flash (67.9%), 0731 (54.4%) และ Qwen3.8-27B (42.2%)"
    },
    {
      key: "terminalBench4",
      label: "Terminal-Bench 4.0",
      shortLabel: "TB 4.0",
      unit: "%",
      higherIsBetter: true,
      description: "งาน CLI / DevOps / Security ระดับยาก (แยกขาดจาก v2.x เพราะความยากต่างกัน ~50 จุด)",
      comparabilityNote: "คัดเฉพาะผล v4.0 เท่านั้น (Artificial Analysis independent run หรือ tbench.ai / DeepSeek card) ไม่นำ v2.0/v2.1 มาปน"
    },
    {
      key: "frontierCode2",
      label: "FrontierCode 2.0 (AA)",
      shortLabel: "FrontierCode 2.0",
      unit: "%",
      higherIsBetter: true,
      description: "ชุดประเมินอิสระ 132 งานจาก Artificial Analysis บน Repo จริง เกณฑ์ผ่านคือระดับที่ Maintainer ยอม Merge PR",
      comparabilityNote: "รันโดย Artificial Analysis ด้วยมาตรฐานเดียวกัน (Apples-to-Apples สูง)"
    },
    {
      key: "codingElo",
      label: "LMArena Coding Elo",
      shortLabel: "Coding Elo",
      unit: "Elo",
      higherIsBetter: true,
      description: "คะแนน Blind Human Preference เฉพาะหมวดเขียนโค้ด (คะแนนอ้างอิงกลาง 1400–1600)",
      comparabilityNote: "วัดความพึงพอใจนักพัฒนาจากการโหวตแบบปิดชื่อโมเดล"
    }
  ],

  baselines: [
    {
      id: "deepseek-v4-1-flash-1017",
      shortName: "1017 (Ceiling Baseline)",
      name: "DeepSeek-V4.1-Flash-1017",
      vendor: "DeepSeek",
      license: "MIT",
      release: "2026-10",
      archType: "MoE",
      archDetail: "CED MoE + 196.6B Engram",
      totalParamsB: 748.6,
      activeParamsB: 16,
      q4DiskGb: 500.7,
      q8DiskGb: 508.4,
      fp16Gb: 1497.2,
      sizeBand: "Baseline (>500 GB)",
      context: "1M",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "deepseek-ai/DeepSeek-V4.1-Flash-1017",
      roleSummary: "เพดานคุณภาพสูงสุดของสาย Open-Weight (Q4 500.7 GB เกินเพดาน 350 GB ~1.4 เท่า)",
      codingScores: {
        sweVerified: {
          value: 98.0,
          labelSuffix: "97/99 subset",
          caution: true,
          source: "arXiv:2610.35671",
          url: "https://arxiv.org/html/2610.35671v1",
          note: "ทดสอบบน Subset 99 ข้อ (97/99) ไม่ใช่ 500 ข้อเต็ม"
        },
        swePro: null,
        deepSwe: {
          value: 77.0,
          source: "DeepSeek 1017 Model Card",
          url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017",
          note: "Mini-SWE-V2 harness"
        },
        liveCodeBench: null,
        terminalBench4: {
          value: 33.8,
          altText: "Official Claude Code: 42.3%",
          source: "Artificial Analysis (via gpuwerk)",
          url: "https://gpuwerk.com/blog/best-open-weight-coding-models",
          note: "ผลรันอิสระโดย Artificial Analysis = 33.8% (การ์ด DeepSeek ใน Claude Code = 42.3%)"
        },
        frontierCode2: {
          value: 28.5,
          source: "Artificial Analysis (via gpuwerk)",
          url: "https://gpuwerk.com/blog/best-open-weight-coding-models",
          note: "Artificial Analysis independent eval"
        },
        codingElo: {
          value: 1557,
          source: "OpenLM / LMArena (Nov 2026)",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Leaderboard"
        }
      }
    },
    {
      id: "deepseek-v4-flash-0731",
      shortName: "0731 (Size-Cap Baseline)",
      name: "DeepSeek-V4-Flash-0731",
      vendor: "DeepSeek",
      license: "MIT",
      release: "2026-07",
      archType: "MoE",
      archDetail: "Sparse MoE",
      totalParamsB: 284,
      activeParamsB: 13,
      q4DiskGb: 160.0,
      q8DiskGb: 301.0,
      fp16Gb: 568.0,
      sizeBand: "Baseline (160 GB)",
      context: "1M",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "deepseek-ai/DeepSeek-V4-Flash",
      roleSummary: "เกณฑ์ขนาดเป้าหมาย 160 GB — รุ่นที่เล็กกว่านี้ถือว่าประหยัดกว่า และต้องเทียบคะแนนตรงได้ (ตารางครอบคลุมถึง 350 GB)",
      codingScores: {
        sweVerified: {
          value: 79.0,
          altText: "Vals Harness: 88.8%",
          source: "DeepSeek Official Card",
          url: "https://macaron.im/blog/deepseek-v4-benchmarks",
          note: "Official Max effort = 79.0% (Vals AI harness = 88.8%)"
        },
        swePro: {
          value: 52.6,
          source: "HF DeepSeek-V4-Flash / SEAL",
          url: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash",
          note: "ScaleAI SWE-bench Pro"
        },
        deepSwe: {
          value: 54.4,
          source: "DeepSeek 0731 Update",
          url: "https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813",
          note: "DeepSWE official update (31 Jul 2026)"
        },
        liveCodeBench: {
          value: 87.26,
          altText: "Official Max: 91.6%",
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval = 87.26% (DeepSeek card Max = 91.6%)"
        },
        terminalBench4: {
          value: 7.0,
          source: "DeepSeek V4.1 Comparison Table",
          url: "https://regolo.ai/deepseek-v4-1-flash-vs-v4-flash-which-open-weight-model-should-your-company-run",
          note: "Terminal-Bench 4.0 (ส่วน v2.1 = 82.7%)"
        },
        frontierCode2: null,
        codingElo: null
      }
    }
  ],

  candidates: [
    // --- Band: 201-350 GB (รุ่นใหญ่พิเศษเพิ่มกลับเข้าตาราง) ---
    {
      id: "inkling-2-small",
      name: "Inkling 2 Small",
      vendor: "Thinking Machines Lab",
      license: "Apache-2.0",
      release: "2026-11",
      archType: "MoE",
      archDetail: "Sparse MoE VLM (8/384 · NVFP4)",
      totalParamsB: 594,
      activeParamsB: 17,
      q4DiskGb: 325.0,
      q8DiskGb: 630.0,
      sizeBand: "201-350GB",
      context: "1M",
      vision: true,
      modality: "Multimodal (Vision + Text)",
      hfRepo: "thinkingmachines/Inkling-2-Small",
      codingScores: {
        sweVerified: {
          value: 82.2,
          source: "Thinking Machines / mini-swe-agent",
          url: "https://thinkingmachines.ai/",
          note: "SWE-bench Verified (mini-swe-agent harness)"
        },
        swePro: null,
        deepSwe: {
          value: 72.1,
          source: "CellCog / Thinking Machines Official",
          url: "https://cellcog.ai/blog/inkling-2-small",
          note: "DeepSWE v1.1 (เทียบตรงกับ 1017 ที่ 77.0%)"
        },
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-coder-480b-a35b",
      name: "Qwen3-Coder-480B-A35B-Instruct",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-07",
      archType: "MoE",
      archDetail: "Sparse MoE Agentic Coder",
      totalParamsB: 480,
      activeParamsB: 35,
      q4DiskGb: 290.0,
      q8DiskGb: 508.0,
      sizeBand: "201-350GB",
      context: "256K–1M",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
      codingScores: {
        sweVerified: {
          value: 66.5,
          source: "swebench.com / Qwen3-Coder Card",
          url: "https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct",
          note: "SWE-bench Verified Official"
        },
        swePro: {
          value: 38.7,
          source: "Scale AI Public Eval (via Kilo)",
          url: "https://kilo.ai/open-source-models",
          note: "SWE-bench Pro public evaluation"
        },
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "reflection-beam-501b",
      name: "Reflection Beam 1.0 (501B)",
      vendor: "Reflection AI",
      license: "Apache-2.0",
      release: "2026-10",
      archType: "MoE",
      archDetail: "Sparse MoE (256 experts · NVFP4)",
      totalParamsB: 501.3,
      activeParamsB: 23.4,
      q4DiskGb: 280.0,
      q8DiskGb: 501.0,
      sizeBand: "201-350GB",
      context: "1M",
      vision: false,
      modality: "Text-only (Agentic)",
      hfRepo: "reflection/Beam-1.0-501B-A23B",
      codingScores: {
        sweVerified: {
          value: 81.6,
          source: "Reflection AI Official Card",
          url: "https://huggingface.co/reflection/Beam-1.0-501B-A23B",
          note: "SWE-bench Verified BF16 (TB 2.1 = 80.1% แยกจาก TB 4.0)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "glm-4-7",
      name: "GLM-4.7 (355B)",
      vendor: "Z.ai (Zhipu AI)",
      license: "MIT",
      release: "2025-12",
      archType: "MoE",
      archDetail: "Sparse MoE (Preserved Thinking)",
      totalParamsB: 355,
      activeParamsB: 32,
      q4DiskGb: 216.2,
      q8DiskGb: 376.0,
      sizeBand: "201-350GB",
      context: "200K",
      vision: false,
      modality: "Text-only (Agentic)",
      hfRepo: "zai-org/GLM-4.7",
      codingScores: {
        sweVerified: {
          value: 73.8,
          source: "Z.ai GLM-4.7 Official",
          url: "https://oxalpha.run/glm/glm-4.7",
          note: "SWE-bench Verified (+5.8 จุดจาก GLM-4.6)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 84.9,
          source: "Z.ai GLM-4.7 Official",
          url: "https://aimlapi.com/models/glm-4-7",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "ornith-1-0-397b",
      name: "Ornith-1.0-397B",
      vendor: "DeepReinforce (Ornith)",
      license: "MIT",
      release: "2026-06",
      archType: "MoE",
      archDetail: "Self-Scaffolding MoE (Qwen3.5 base)",
      totalParamsB: 397,
      activeParamsB: 17,
      q4DiskGb: 210.0,
      q8DiskGb: 420.8,
      sizeBand: "201-350GB",
      context: "262K",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "deepreinforce-ai/Ornith-1.0-397B",
      codingScores: {
        sweVerified: {
          value: 82.4,
          source: "Ornith-1.0 Official Report",
          url: "https://ornith.ai/ornith_1_0.html",
          note: "SWE-bench Verified Official (TB 2.1 = 77.5% แยกจาก TB 4.0)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-5-397b-a17b",
      name: "Qwen3.5-397B-A17B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-02",
      archType: "MoE",
      archDetail: "Sparse MoE VLM (Gated DeltaNet)",
      totalParamsB: 397,
      activeParamsB: 17,
      q4DiskGb: 210.0,
      q8DiskGb: 420.8,
      sizeBand: "201-350GB",
      context: "262K",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "Qwen/Qwen3.5-397B-A17B",
      codingScores: {
        sweVerified: {
          value: 76.2,
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Official Scaffold"
        },
        swePro: {
          value: 50.9,
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Refined SWE-bench Pro"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 83.6,
          source: "Qwen3.5 Official Report",
          url: "https://huggingface.co/Qwen/Qwen3.5-397B-A17B",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1463,
          source: "OpenLM / LMArena (Nov 2026)",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    // --- Band: 161-200 GB (ขอบบนช่วง 160-200 GB) ---
    {
      id: "motif-3",
      name: "Motif-3 (314B)",
      vendor: "Motif Technologies",
      license: "MIT",
      release: "2026-09",
      archType: "MoE",
      archDetail: "Sparse MoE (384 experts · GDLA)",
      totalParamsB: 314,
      activeParamsB: 13.2,
      q4DiskGb: 175.0,
      q8DiskGb: 332.0,
      sizeBand: "161-200GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "Motif-Technologies/Motif-3",
      codingScores: {
        sweVerified: {
          value: 76.2,
          source: "HF Motif-Technologies/Motif-3",
          url: "https://huggingface.co/Motif-Technologies/Motif-3",
          note: "SWE-bench Verified (Final MIT release)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "glm-5-3-flash",
      name: "GLM-5.3-Flash",
      vendor: "Z.ai (Zhipu AI)",
      license: "MIT",
      release: "2026-09",
      archType: "MoE",
      archDetail: "Sparse MoE",
      totalParamsB: 320,
      activeParamsB: 18,
      q4DiskGb: 180.0,
      q8DiskGb: 328.0,
      sizeBand: "161-200GB",
      context: "200K",
      vision: false,
      modality: "Text-only (Agentic)",
      hfRepo: "zai-org/GLM-5.3-Flash",
      codingScores: {
        sweVerified: {
          value: 71.6,
          source: "TrustTheBench Independent",
          url: "https://trustthebench.com/models/glm-5-3-flash",
          note: "อัปเดต ก.ย. 2026"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 80.51,
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval (#69)"
        },
        terminalBench4: {
          value: 32.8,
          altText: "tbench.ai Non-reasoning: 35.76%",
          source: "Artificial Analysis (via gpuwerk)",
          url: "https://gpuwerk.com/blog/best-open-weight-coding-models",
          note: "AA independent run = 32.8% (ใกล้เคียง 1017 ที่ 33.8%)"
        },
        frontierCode2: {
          value: 17.6,
          source: "Artificial Analysis (via gpuwerk)",
          url: "https://gpuwerk.com/blog/best-open-weight-coding-models",
          note: "Artificial Analysis independent eval"
        },
        codingElo: {
          value: 1538,
          source: "OpenLM / LMArena (Nov 2026)",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "mimo-v2-6-flash",
      name: "MiMo-V2.6-Flash",
      vendor: "Xiaomi MiMo",
      license: "MIT",
      release: "2026-09",
      archType: "MoE",
      archDetail: "Sparse MoE + MTP-5",
      totalParamsB: 309,
      activeParamsB: 15,
      q4DiskGb: 172.0,
      q8DiskGb: 327.5,
      sizeBand: "161-200GB",
      context: "1M",
      vision: true,
      modality: "Omni (Text/Image/Video/Audio)",
      hfRepo: "XiaomiMiMo/MiMo-V2.6-Flash-RL",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: {
          value: 67.9,
          source: "HF XiaomiMiMo/MiMo-V2.6-Flash-RL",
          url: "https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Flash-RL",
          note: "DeepSWE v1.1 Official — แซง 0731 (+13.5%)"
        },
        liveCodeBench: null,
        terminalBench4: {
          value: 22.7,
          source: "Artificial Analysis (via gpuwerk)",
          url: "https://gpuwerk.com/blog/best-open-weight-coding-models",
          note: "Artificial Analysis independent eval"
        },
        frontierCode2: {
          value: 21.6,
          source: "Artificial Analysis / OpenRouter",
          url: "https://openrouter.ai/compare/xiaomi/mimo-v2.6-flash/z-ai/glm-5.3-flash",
          note: "สูงสุดในกลุ่ม ≤ 200 GB บน FrontierCode 2.0 (แซง GLM-5.3-Flash)"
        },
        codingElo: null
      }
    },
    {
      id: "mimo-v2-flash",
      name: "MiMo-V2-Flash",
      vendor: "Xiaomi MiMo",
      license: "MIT",
      release: "2025-12",
      archType: "MoE",
      archDetail: "Sparse MoE Hybrid Attention",
      totalParamsB: 309,
      activeParamsB: 15,
      q4DiskGb: 172.0,
      q8DiskGb: 327.5,
      sizeBand: "161-200GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Hybrid Reasoning)",
      hfRepo: "XiaomiMiMo/MiMo-V2-Flash",
      codingScores: {
        sweVerified: {
          value: 73.4,
          source: "arXiv:2601.02780",
          url: "https://arxiv.org/pdf/2601.02780",
          note: "SWE-bench Verified Official (Multilingual 71.7%)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "ernie-4-5-300b-a47b",
      name: "ERNIE-4.5-300B-A47B",
      vendor: "Baidu",
      license: "Apache-2.0",
      release: "2025-06",
      archType: "MoE",
      archDetail: "Heterogeneous MoE (8/64)",
      totalParamsB: 300,
      activeParamsB: 47,
      q4DiskGb: 170.0,
      q8DiskGb: 318.0,
      sizeBand: "161-200GB",
      context: "128K",
      vision: false,
      modality: "Text-only",
      hfRepo: "baidu/ERNIE-4.5-300B-A47B-PT",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 46.7,
          source: "Artificial Analysis (via llmbase)",
          url: "https://artificialanalysis.ai/models/ernie-4-5-300b-a47b",
          note: "Artificial Analysis LiveCodeBench eval (Text-only MoE 300B/47B)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },

    // --- Band: < 160 GB (เล็กกว่า Baseline 0731 ชัดเจน) ---
    {
      id: "inkling-small-276b",
      name: "Inkling-Small (276B)",
      vendor: "Thinking Machines Lab",
      license: "Apache-2.0",
      release: "2026-07",
      archType: "MoE",
      archDetail: "Encoder-Free Multimodal MoE",
      totalParamsB: 276,
      activeParamsB: 12,
      q4DiskGb: 155.0,
      q8DiskGb: 292.6,
      sizeBand: "<160GB",
      context: "1M",
      vision: true,
      modality: "Multimodal (Text + Image + Audio)",
      hfRepo: "thinkingmachines/Inkling-Small",
      codingScores: {
        sweVerified: {
          value: 80.2,
          altText: "Vals Mini-SWE: 82.2%",
          caution: true,
          labelSuffix: "Internal harness",
          source: "HF thinkingmachines/Inkling-Small",
          url: "https://huggingface.co/thinkingmachines/Inkling-Small",
          note: "Official = 80.2% (Vals Mini-SWE-agent = 82.2%)"
        },
        swePro: {
          value: 55.9,
          source: "HF thinkingmachines/Inkling-Small",
          url: "https://huggingface.co/thinkingmachines/Inkling-Small",
          note: "SWE-bench Pro public (แซง 0731 ที่ 52.6%)"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 85.93,
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval (#26)"
        },
        terminalBench4: {
          value: 0.9,
          caution: true,
          labelSuffix: "Base checkpoint",
          source: "Cognition SWE-2 Flash Report",
          url: "https://neuralbrew.ai/en/articles/2026/11/cognition-swe-2-flash-code-model-inkling-small-weights-withheld",
          note: "รุ่นฐานได้ 0.9% บน TB 4.0 (Cognition นำไป post-train เป็น SWE-2 Flash แบบไม่เปิด weights)"
        },
        frontierCode2: {
          value: 3.2,
          caution: true,
          labelSuffix: "Base checkpoint",
          source: "Cognition SWE-2 Flash Report",
          url: "https://neuralbrew.ai/en/articles/2026/11/cognition-swe-2-flash-code-model-inkling-small-weights-withheld",
          note: "ผลวัดบน base ก่อน Cognition fine-tune"
        },
        codingElo: null
      }
    },
    {
      id: "qwen3-vl-235b-a22b",
      name: "Qwen3-VL-235B-A22B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-09",
      archType: "MoE",
      archDetail: "Multimodal MoE VLM (235B/22B)",
      totalParamsB: 235,
      activeParamsB: 22,
      q4DiskGb: 138.0,
      q8DiskGb: 250.0,
      sizeBand: "<160GB",
      context: "256K–1M",
      vision: true,
      modality: "Multimodal (Image + Video + GUI)",
      hfRepo: "Qwen/Qwen3-VL-235B-A22B-Instruct",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 59.4,
          labelSuffix: "Instruct · AA",
          source: "Artificial Analysis (via OpenRouter)",
          url: "https://openrouter.ai/qwen/qwen3-vl-235b-a22b-instruct",
          note: "Artificial Analysis LiveCodeBench eval (รุ่น Instruct)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1432,
          labelSuffix: "Thinking",
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo (Qwen3-VL-235B-A22B-Thinking)"
        }
      }
    },
    {
      id: "qwen3-235b-a22b",
      name: "Qwen3-235B-A22B (2507)",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-07",
      archType: "MoE",
      archDetail: "Sparse MoE",
      totalParamsB: 235,
      activeParamsB: 22,
      q4DiskGb: 135.0,
      q8DiskGb: 249.1,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "Qwen/Qwen3-235B-A22B-Instruct-2507",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 70.62,
          altText: "HF Card LCB v6: 75.1%",
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval = 70.62% (Qwen3.5 card list = 75.1%)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1457,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "step-3-7-flash",
      name: "Step-3.7-Flash",
      vendor: "StepFun",
      license: "Apache-2.0",
      release: "2026-05",
      archType: "MoE",
      archDetail: "Sparse MoE VLM + MTP-3",
      totalParamsB: 198,
      activeParamsB: 11,
      q4DiskGb: 115.0,
      q8DiskGb: 209.9,
      sizeBand: "<160GB",
      context: "256K",
      vision: true,
      modality: "Multimodal (Vision + Text, 1.8B ViT)",
      hfRepo: "stepfun-ai/Step-3.7-Flash",
      codingScores: {
        sweVerified: {
          value: 76.5,
          source: "StepFun 3.7 Flash Blog",
          url: "https://static.stepfun.com/blog/step-3.7-flash",
          note: "SWE-bench Verified Official (เดิม v1 card = 74.4%)"
        },
        swePro: {
          value: 56.3,
          source: "GitHub stepfun-ai/Step-3.7-Flash",
          url: "https://github.com/stepfun-ai/Step-3.7-Flash",
          note: "อันดับ #3 บน SWE-bench Pro รองจาก Qwen3.8-27B และ Ornith-1.5 (แซง 0731 ที่ 52.6%)"
        },
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "step-3-5-flash",
      name: "Step-3.5-Flash",
      vendor: "StepFun",
      license: "Apache-2.0",
      release: "2026-02",
      archType: "MoE",
      archDetail: "Sparse MoE + MTP-3",
      totalParamsB: 196,
      activeParamsB: 11,
      q4DiskGb: 114.0,
      q8DiskGb: 207.8,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Reasoning & Agent)",
      hfRepo: "stepfun-ai/Step-3.5-Flash",
      codingScores: {
        sweVerified: {
          value: 74.4,
          source: "arXiv:2602.10604 Table 5",
          url: "https://arxiv.org/html/2602.10604v1",
          note: "SWE-bench Verified (Vanilla)"
        },
        swePro: {
          value: 51.3,
          source: "StepFun 3.7 Comparison Table",
          url: "https://static.stepfun.com/blog/step-3.7-flash",
          note: "SWE-bench Pro"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 86.4,
          source: "arXiv:2602.10604 / HF Card",
          url: "https://huggingface.co/stepfun-ai/Step-3.5-Flash",
          note: "LiveCodeBench-v6 (2024.08–2025.05)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1433,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "laguna-m-1",
      name: "Laguna M.1",
      vendor: "Poolside",
      license: "Apache-2.0",
      release: "2026-05",
      archType: "MoE",
      archDetail: "Sparse MoE Agentic Coder",
      totalParamsB: 225.8,
      activeParamsB: 23,
      q4DiskGb: 130.0,
      q8DiskGb: 239.0,
      sizeBand: "<160GB",
      context: "262K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "poolside/Laguna-M.1",
      codingScores: {
        sweVerified: {
          value: 74.6,
          source: "HF poolside/Laguna-M.1",
          url: "https://huggingface.co/poolside/Laguna-M.1",
          note: "SWE-bench Verified (arXiv:2605.27605)"
        },
        swePro: {
          value: 49.2,
          source: "HF poolside/Laguna-M.1",
          url: "https://huggingface.co/poolside/Laguna-M.1",
          note: "SWE-bench Pro Public Dataset"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 68.12,
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval (#94)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "mistral-small-4-119b",
      name: "Mistral Small 4 (119B)",
      vendor: "Mistral AI",
      license: "Apache-2.0",
      release: "2026-03",
      archType: "MoE",
      archDetail: "Sparse MoE Multimodal (128 experts)",
      totalParamsB: 119,
      activeParamsB: 6.5,
      q4DiskGb: 68.0,
      q8DiskGb: 126.0,
      sizeBand: "<160GB",
      context: "256K",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "mistralai/Mistral-Small-4-119B-2603",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-5-122b-a10b",
      name: "Qwen3.5-122B-A10B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-02",
      archType: "MoE",
      archDetail: "Sparse MoE VLM",
      totalParamsB: 122,
      activeParamsB: 10,
      q4DiskGb: 68.0,
      q8DiskGb: 129.3,
      sizeBand: "<160GB",
      context: "262K",
      vision: true,
      modality: "Multimodal (Vision + Text)",
      hfRepo: "Qwen/Qwen3.5-122B-A10B",
      codingScores: {
        sweVerified: {
          value: 72.0,
          source: "HF Qwen/Qwen3.5-122B-A10B",
          url: "https://huggingface.co/Qwen/Qwen3.5-122B-A10B",
          note: "SWE-bench Verified Official"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 78.9,
          source: "HF Qwen/Qwen3.5-122B-A10B",
          url: "https://huggingface.co/Qwen/Qwen3.5-122B-A10B",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "gpt-oss-120b",
      name: "gpt-oss-120b",
      vendor: "OpenAI",
      license: "Apache-2.0",
      release: "2025-08",
      archType: "MoE",
      archDetail: "Sparse MoE (Reasoning)",
      totalParamsB: 117,
      activeParamsB: 5.1,
      q4DiskGb: 65.0,
      q8DiskGb: 124.0,
      sizeBand: "<160GB",
      context: "131K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "openai/gpt-oss-120b",
      codingScores: {
        sweVerified: {
          value: 62.4,
          source: "OpenAI Model Card",
          url: "https://huggingface.co/openai/gpt-oss-120b",
          note: "SWE-bench Verified"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 83.23,
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval (#51)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1398,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "qwen3-coder-next",
      name: "Qwen3-Coder-Next",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-03",
      archType: "MoE",
      archDetail: "Hybrid Linear / MoE",
      totalParamsB: 79.7,
      activeParamsB: 3,
      q4DiskGb: 47.0,
      q8DiskGb: 84.5,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Code)",
      hfRepo: "Qwen/Qwen3-Coder-Next",
      codingScores: {
        sweVerified: {
          value: 70.6,
          source: "arXiv:2603.00729",
          url: "https://arxiv.org/html/2603.00729v1",
          note: "SWE-Agent (ได้ถึง 71.3% เมื่อปรับ Scaffold)"
        },
        swePro: {
          value: 44.3,
          source: "arXiv:2603.00729",
          url: "https://arxiv.org/html/2603.00729v1",
          note: "SWE-bench Pro (3B active)"
        },
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "glm-4-5-air",
      name: "GLM-4.5-Air",
      vendor: "Z.ai (Zhipu AI)",
      license: "MIT",
      release: "2025-07",
      archType: "MoE",
      archDetail: "Sparse MoE Hybrid Reasoning",
      totalParamsB: 106,
      activeParamsB: 12,
      q4DiskGb: 60.0,
      q8DiskGb: 112.0,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Hybrid Reasoning)",
      hfRepo: "zai-org/GLM-4.5-Air",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1410,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "qwen3-next-80b-a3b-thinking",
      name: "Qwen3-Next-80B-A3B-Thinking",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-09",
      archType: "MoE",
      archDetail: "Hybrid Attention MoE (80B/3B)",
      totalParamsB: 80,
      activeParamsB: 3,
      q4DiskGb: 47.0,
      q8DiskGb: 85.0,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "Qwen/Qwen3-Next-80B-A3B-Thinking",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 68.7,
          source: "HF Qwen/Qwen3-Next-80B-A3B-Thinking",
          url: "https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Thinking",
          note: "LiveCodeBench v6 Official (รุ่น Instruct ได้ OpenLM Coding Elo 1456)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "kolibri-1",
      name: "Kolibri-1 (78B)",
      vendor: "Aleph Alpha",
      license: "Apache-2.0",
      release: "2026-10",
      archType: "MoE",
      archDetail: "Sovereign EN/DE Sparse MoE",
      totalParamsB: 78.1,
      activeParamsB: 3.46,
      q4DiskGb: 45.0,
      q8DiskGb: 78.0,
      sizeBand: "<160GB",
      context: "262K–1M",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "Aleph-Alpha/Kolibri-1",
      codingScores: {
        sweVerified: {
          value: 66.4,
          source: "HF Aleph-Alpha/Kolibri-1",
          url: "https://huggingface.co/Aleph-Alpha/Kolibri-1",
          note: "SWE-bench Verified (Harbor high effort)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 85.1,
          source: "xigh / Aleph Alpha Card",
          url: "https://huggingface.co/Aleph-Alpha/Kolibri-1",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "kat-dev-72b-exp",
      name: "KAT-Dev-72B-Exp",
      vendor: "Kwaipilot (Kuaishou)",
      license: "Apache-2.0",
      release: "2025-10",
      archType: "Dense",
      archDetail: "Dense Agentic RL Coder",
      totalParamsB: 72,
      activeParamsB: 72,
      q4DiskGb: 42.0,
      q8DiskGb: 76.0,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "Kwaipilot/KAT-Dev-72B-Exp",
      codingScores: {
        sweVerified: {
          value: 74.6,
          source: "HF Kwaipilot/KAT-Dev-72B-Exp",
          url: "https://huggingface.co/Kwaipilot/KAT-Dev-72B-Exp",
          note: "SWE-agent scaffold (FP8 = 68.5%)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "ornith-1-5-35b-a3b",
      name: "Ornith-1.5-35B-A3B",
      vendor: "DeepReinforce (Ornith)",
      license: "MIT",
      release: "2026-08",
      archType: "MoE",
      archDetail: "Self-Improving MoE (Qwen3.5 VLM base)",
      totalParamsB: 35,
      activeParamsB: 3,
      q4DiskGb: 21.5,
      q8DiskGb: 37.1,
      sizeBand: "<160GB",
      context: "262K–1M",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "ornith-ai/Ornith-1.5-35B-A3B",
      codingScores: {
        sweVerified: {
          value: 79.0,
          source: "HF ornith-ai/Ornith-1.5-35B-A3B",
          url: "https://huggingface.co/ornith-ai/Ornith-1.5-35B-A3B",
          note: "SWE-bench Verified Official (TB 2.1 = 68.5% แยกจาก TB 4.0)"
        },
        swePro: {
          value: 59.6,
          source: "Ornith-1.5 Official / GitHub",
          url: "https://github.com/ornith-ai/Ornith-1",
          note: "SWE-bench Pro (+7.0 จุดเหนือ 0731 ในขนาด 21.5 GB)"
        },
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "kat-coder-v2-5-dev",
      name: "KAT-Coder-V2.5-Dev",
      vendor: "Kwaipilot (Kuaishou)",
      license: "Apache-2.0",
      release: "2026-07",
      archType: "MoE",
      archDetail: "Sparse MoE Coder (Qwen3.6-35B base)",
      totalParamsB: 35,
      activeParamsB: 3,
      q4DiskGb: 21.0,
      q8DiskGb: 37.0,
      sizeBand: "<160GB",
      context: "262K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "Kwaipilot/KAT-Coder-V2.5-Dev",
      codingScores: {
        sweVerified: {
          value: 69.4,
          source: "HF Kwaipilot/KAT-Coder-V2.5-Dev",
          url: "https://huggingface.co/Kwaipilot/KAT-Coder-V2.5-Dev",
          note: "SWE-bench Verified (Text-only weights)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "kat-dev-32b",
      name: "KAT-Dev-32B",
      vendor: "Kwaipilot (Kuaishou)",
      license: "Apache-2.0",
      release: "2025-09",
      archType: "Dense",
      archDetail: "Dense Agentic RL Coder",
      totalParamsB: 32,
      activeParamsB: 32,
      q4DiskGb: 20.0,
      q8DiskGb: 34.0,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "Kwaipilot/KAT-Dev",
      codingScores: {
        sweVerified: {
          value: 62.4,
          source: "HF Kwaipilot/KAT-Dev",
          url: "https://huggingface.co/Kwaipilot/KAT-Dev",
          note: "SWE-bench Verified Official"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "flint-40b-a2-5b",
      name: "Flint 40B-A2.5B",
      vendor: "Recursive Superintelligence",
      license: "Apache-2.0",
      release: "2026-10",
      archType: "MoE",
      archDetail: "Sparse MoE Coding Agent",
      totalParamsB: 39.8,
      activeParamsB: 2.5,
      q4DiskGb: 23.4,
      q8DiskGb: 42.3,
      sizeBand: "<160GB",
      context: "262K",
      vision: false,
      modality: "Text-only (Coding Agent)",
      hfRepo: "unsloth/flint-GGUF",
      codingScores: {
        sweVerified: {
          value: 74.2,
          source: "Recursive Official / BenchLM",
          url: "https://benchlm.ai/models/flint-40b-a2-5b",
          note: "SWE-bench Verified mini-swe-agent 5-run avg (NVFP4 = 74.1%; SWE-Pro v2 = 89.7% แยกจาก Pro v1)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 80.3,
          source: "Recursive Official / NYU RITS",
          url: "https://rits.shanghai.nyu.edu/ai/recursive-releases-flint-a-40b-coding-model-for-laptops",
          note: "LiveCodeBench v6 Official (TB 2.1 = 54.9% ไม่นำมาปนกับ TB 4.0)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "seed-oss-36b-instruct",
      name: "Seed-OSS-36B-Instruct",
      vendor: "ByteDance Seed",
      license: "Apache-2.0",
      release: "2025-08",
      archType: "Dense",
      archDetail: "Dense Long-Context Reasoning",
      totalParamsB: 36,
      activeParamsB: 36,
      q4DiskGb: 22.0,
      q8DiskGb: 38.5,
      sizeBand: "<160GB",
      context: "512K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "ByteDance-Seed/Seed-OSS-36B-Instruct",
      codingScores: {
        sweVerified: {
          value: 56.0,
          source: "HF ByteDance-Seed/Seed-OSS-36B-Instruct",
          url: "https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct",
          note: "SWE-bench Verified (OpenHands scaffold)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 67.4,
          source: "HF ByteDance-Seed/Seed-OSS-36B-Instruct",
          url: "https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "inkling-2-mini",
      name: "Inkling 2 Mini",
      vendor: "Thinking Machines Lab",
      license: "Apache-2.0",
      release: "2026-11",
      archType: "MoE",
      archDetail: "Looped MoE VLM (3.4B raw / 5.4B eff.)",
      totalParamsB: 26.4,
      activeParamsB: 5.4,
      q4DiskGb: 19.5,
      q8DiskGb: 29.5,
      sizeBand: "<160GB",
      context: "1M",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "thinkingmachines/Inkling-2-Mini",
      codingScores: {
        sweVerified: {
          value: 79.2,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "SWE-bench Verified bash-only (ชนะ 0731 ที่ 79.0%; SWE-Pro v2 Hard = 77.9% แยกจาก Pro v1)"
        },
        swePro: null,
        deepSwe: {
          value: 48.2,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "DeepSWE v1.1 mini-swe-agent v2.4.6 (#1 Open-weight < 100B ชนะ Qwen3.8-27B ที่ 42.2%)"
        },
        liveCodeBench: null,
        terminalBench4: {
          value: 5.6,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "Terminal-Bench 4.0 mini-swe-agent v2.4.6 เท่ากับ Qwen3.8-27B (ส่วน TB 2.1 = 71.6% แยกชุด)"
        },
        frontierCode2: {
          value: 15.1,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "FrontierCode v2.0 via stirrup v0.2.1 (ชนะ Qwen3.8-27B ที่ 14.9%)"
        },
        codingElo: null
      }
    },
    {
      id: "laguna-xs-2",
      name: "Laguna XS.2",
      vendor: "Poolside",
      license: "Apache-2.0",
      release: "2026-05",
      archType: "MoE",
      archDetail: "Sparse MoE Agentic Coder",
      totalParamsB: 33,
      activeParamsB: 3,
      q4DiskGb: 19.5,
      q8DiskGb: 35.0,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "poolside/Laguna-XS.2",
      codingScores: {
        sweVerified: {
          value: 69.9,
          source: "HF poolside/Laguna-XS.2",
          url: "https://huggingface.co/poolside/Laguna-XS.2",
          note: "SWE-bench Verified (arXiv:2605.27605)"
        },
        swePro: {
          value: 46.3,
          source: "HF poolside/Laguna-XS.2",
          url: "https://huggingface.co/poolside/Laguna-XS.2",
          note: "SWE-bench Pro Public Dataset"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 67.8,
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval (#95)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "raon-1-mini-preview",
      name: "Raon-1-mini-preview",
      vendor: "KRAFTON AI",
      license: "Apache-2.0",
      release: "2026-09",
      archType: "MoE",
      archDetail: "Sparse MoE Agentic",
      totalParamsB: 29,
      activeParamsB: 4.3,
      q4DiskGb: 18.0,
      q8DiskGb: 31.0,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Agentic)",
      hfRepo: "KRAFTON/Raon-1-mini-preview",
      codingScores: {
        sweVerified: {
          value: 70.8,
          source: "KRAFTON GitHub / xigh",
          url: "https://github.com/krafton-ai/Raon-1-mini-preview",
          note: "SWE-bench Verified Official"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-6-35b-a3b",
      name: "Qwen3.6-35B-A3B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-04",
      archType: "MoE",
      archDetail: "Sparse MoE VLM",
      totalParamsB: 36,
      activeParamsB: 3,
      q4DiskGb: 21.8,
      q8DiskGb: 38.2,
      sizeBand: "<160GB",
      context: "262K–1M",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "Qwen/Qwen3.6-35B-A3B",
      codingScores: {
        sweVerified: {
          value: 73.4,
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Internal Scaffold"
        },
        swePro: {
          value: 49.5,
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Refined SWE-bench Pro"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 80.4,
          source: "Qwen3.6-35B-A3B Blog",
          url: "https://qwen.ai/blog?id=qwen3.6-35b-a3b",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-5-35b-a3b",
      name: "Qwen3.5-35B-A3B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-02",
      archType: "MoE",
      archDetail: "Sparse MoE VLM (35B / 3B active)",
      totalParamsB: 35,
      activeParamsB: 3,
      q4DiskGb: 21.5,
      q8DiskGb: 37.1,
      sizeBand: "<160GB",
      context: "262K",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "Qwen/Qwen3.5-35B-A3B",
      codingScores: {
        sweVerified: {
          value: 69.2,
          source: "HF Qwen/Qwen3.5-35B-A3B",
          url: "https://huggingface.co/Qwen/Qwen3.5-35B-A3B",
          note: "SWE-bench Verified Official"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 74.6,
          source: "HF Qwen/Qwen3.5-35B-A3B",
          url: "https://huggingface.co/Qwen/Qwen3.5-35B-A3B",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-32b",
      name: "Qwen3-32B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-04",
      archType: "Dense",
      archDetail: "Dense Hybrid Thinking",
      totalParamsB: 32.8,
      activeParamsB: 32.8,
      q4DiskGb: 19.5,
      q8DiskGb: 34.8,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "Qwen/Qwen3-32B",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 60.6,
          source: "HF Qwen3-Next Card Table",
          url: "https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Thinking",
          note: "LiveCodeBench v6 Official (Qwen3-32B Thinking)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1376,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "qwq-32b",
      name: "QwQ-32B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-03",
      archType: "Dense",
      archDetail: "Dense RL Reasoning",
      totalParamsB: 32.8,
      activeParamsB: 32.8,
      q4DiskGb: 19.5,
      q8DiskGb: 34.8,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "Qwen/QwQ-32B",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 63.4,
          source: "Qwen Official / Phi-4 Card",
          url: "https://huggingface.co/Qwen/QwQ-32B",
          note: "LiveCodeBench Official (2024.08–2025.02)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1351,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "deepseek-r1-distill-qwen-32b",
      name: "DeepSeek-R1-Distill-Qwen-32B",
      vendor: "DeepSeek",
      license: "MIT",
      release: "2025-01",
      archType: "Dense",
      archDetail: "Dense Reasoning Distill (Qwen2.5)",
      totalParamsB: 32.8,
      activeParamsB: 32.8,
      q4DiskGb: 19.5,
      q8DiskGb: 34.8,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 57.2,
          source: "HF DeepSeek-R1-Distill-Qwen-32B",
          url: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
          note: "LiveCodeBench Pass@1-COT (Codeforces Rating 1691)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "gemma-4-31b",
      name: "Gemma 4 31B",
      vendor: "Google DeepMind",
      license: "Apache-2.0",
      release: "2026-04",
      archType: "Dense",
      archDetail: "Dense Multimodal",
      totalParamsB: 30.7,
      activeParamsB: 30.7,
      q4DiskGb: 19.0,
      q8DiskGb: 32.5,
      sizeBand: "<160GB",
      context: "256K",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "google/gemma-4-31B-it",
      codingScores: {
        sweVerified: {
          value: 52.0,
          source: "HF Qwen/Qwen3.6-27B Comparison",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "SWE-bench Verified (Thinking Machines bash-only = 46.1%)"
        },
        swePro: {
          value: 35.7,
          source: "HF Qwen/Qwen3.6-27B Comparison",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "SWE-bench Pro"
        },
        deepSwe: {
          value: 0.3,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "DeepSWE v1.1 mini-swe-agent v2.4.6"
        },
        liveCodeBench: {
          value: 80.0,
          source: "Gemma 4 Technical Report",
          url: "https://arxiv.org/html/2607.02770v1",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: {
          value: 0.0,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "Terminal-Bench 4.0 mini-swe-agent v2.4.6 (ส่วน TB 2.1 = 43.4% แยกชุด)"
        },
        frontierCode2: {
          value: 0.0,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "FrontierCode v2.0 via stirrup v0.2.1"
        },
        codingElo: {
          value: 1462,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "qwen3-vl-30b-a3b",
      name: "Qwen3-VL-30B-A3B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-10",
      archType: "MoE",
      archDetail: "Multimodal MoE VLM (30B/3B)",
      totalParamsB: 30.5,
      activeParamsB: 3.3,
      q4DiskGb: 19.0,
      q8DiskGb: 33.0,
      sizeBand: "<160GB",
      context: "256K–1M",
      vision: true,
      modality: "Multimodal (Image + Video + GUI)",
      hfRepo: "Qwen/Qwen3-VL-30B-A3B-Instruct",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 47.6,
          labelSuffix: "Instruct · AA",
          source: "Artificial Analysis (via OpenRouter)",
          url: "https://openrouter.ai/qwen/qwen3-vl-30b-a3b-instruct",
          note: "Artificial Analysis LiveCodeBench eval (รุ่น Instruct)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen2-5-coder-32b",
      name: "Qwen2.5-Coder-32B-Instruct",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2024-11",
      archType: "Dense",
      archDetail: "Dense Code Model",
      totalParamsB: 32.5,
      activeParamsB: 32.5,
      q4DiskGb: 19.0,
      q8DiskGb: 34.5,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Code)",
      hfRepo: "Qwen/Qwen2.5-Coder-32B-Instruct",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 31.4,
          source: "Qwen2.5-Coder Paper arXiv:2409.12186",
          url: "https://arxiv.org/html/2409.12186v3",
          note: "LiveCodeBench (2407–2409) Table 16 · HumanEval 92.7% · Aider 73.7%"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen2-5-32b",
      name: "Qwen2.5-32B-Instruct",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2024-09",
      archType: "Dense",
      archDetail: "Dense LLM",
      totalParamsB: 32.5,
      activeParamsB: 32.5,
      q4DiskGb: 19.0,
      q8DiskGb: 34.5,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only",
      hfRepo: "Qwen/Qwen2.5-32B-Instruct",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-coder-30b-a3b",
      name: "Qwen3-Coder-30B-A3B-Instruct",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-07",
      archType: "MoE",
      archDetail: "Sparse MoE Coder (30.5B / 3.3B active)",
      totalParamsB: 30.5,
      activeParamsB: 3.3,
      q4DiskGb: 18.6,
      q8DiskGb: 32.5,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "Qwen/Qwen3-Coder-30B-A3B-Instruct",
      codingScores: {
        sweVerified: {
          value: 51.6,
          source: "OpenHands / Qwen3-Coder Eval",
          url: "https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct",
          note: "OpenHands Pass@1 (~50.0–51.6%)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 40.7,
          source: "OpenReview / Community Eval",
          url: "https://huggingface.co/Qwen/Qwen3-Coder-30B-A3B-Instruct",
          note: "LiveCodeBench Pass@1"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-6-27b",
      name: "Qwen3.6-27B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-04",
      archType: "Dense",
      archDetail: "Dense VLM",
      totalParamsB: 27.8,
      activeParamsB: 27.8,
      q4DiskGb: 18.5,
      q8DiskGb: 29.5,
      sizeBand: "<160GB",
      context: "262K–1M",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "Qwen/Qwen3.6-27B",
      codingScores: {
        sweVerified: {
          value: 77.2,
          altText: "Vals Harness: 70.0%",
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Internal Scaffold @ 200K = 77.2% (Vals = 70.0%)"
        },
        swePro: {
          value: 53.5,
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Refined SWE-bench Pro (แซง 0731 เล็กน้อย)"
        },
        deepSwe: {
          value: 13.3,
          source: "HF Qwen/Qwen3.8-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.8-27B",
          note: "DeepSWE 1.1 Baseline ก่อนอัปเกรดเป็น 3.8-27B (42.2%)"
        },
        liveCodeBench: {
          value: 83.9,
          source: "HF Qwen/Qwen3.8-27B Card",
          url: "https://www.bodegaone.ai/blog/run-qwen-3-8-27b-locally-bodega-one-code",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "muse-glimmer-30b",
      name: "Muse-Glimmer-30B",
      vendor: "Meta Superintelligence Labs",
      license: "Apache-2.0",
      release: "2026-08",
      archType: "Dense",
      archDetail: "Dense Multimodal (52L + ViT-G/14)",
      totalParamsB: 29.6,
      activeParamsB: 29.6,
      q4DiskGb: 18.5,
      q8DiskGb: 31.4,
      sizeBand: "<160GB",
      context: "128K",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "meta-models/Muse-Glimmer-30B",
      codingScores: {
        sweVerified: {
          value: 76.0,
          source: "Meta Muse-Glimmer-30B Card",
          url: "https://huggingface.co/meta-models/Muse-Glimmer-30B",
          note: "SWE-bench Verified Official (LiveCodeBench Pro = 64.1% แยกจาก LCB v6)"
        },
        swePro: {
          value: 51.2,
          source: "Meta Muse-Glimmer-30B Card",
          url: "https://huggingface.co/meta-models/Muse-Glimmer-30B",
          note: "High Reasoning Mode (TB 2.1 = 51.7% ไม่นำมาปนกับ TB 4.0)"
        },
        deepSwe: {
          value: 4.4,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "DeepSWE v1.1 mini-swe-agent v2.4.6"
        },
        liveCodeBench: null,
        terminalBench4: {
          value: 0.5,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "Terminal-Bench 4.0 mini-swe-agent v2.4.6"
        },
        frontierCode2: {
          value: 1.5,
          source: "HF thinkingmachines/Inkling-2-Mini",
          url: "https://huggingface.co/thinkingmachines/Inkling-2-Mini",
          note: "FrontierCode v2.0 via stirrup v0.2.1"
        },
        codingElo: null
      }
    },
    {
      id: "qwen3-30b-a3b-thinking-2507",
      name: "Qwen3-30B-A3B-Thinking-2507",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2025-07",
      archType: "MoE",
      archDetail: "Sparse MoE Reasoning (30.5B/3.3B)",
      totalParamsB: 30.5,
      activeParamsB: 3.3,
      q4DiskGb: 18.5,
      q8DiskGb: 32.5,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "Qwen/Qwen3-30B-A3B-Thinking-2507",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 66.0,
          source: "HF Qwen/Qwen3-30B-A3B-Thinking-2507",
          url: "https://huggingface.co/Qwen/Qwen3-30B-A3B-Thinking-2507",
          note: "LiveCodeBench v6 Official (CFEval 2044; รุ่น Instruct ได้ Coding Elo 1425)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "ernie-4-5-vl-28b-a3b-thinking",
      name: "ERNIE-4.5-VL-28B-A3B-Thinking",
      vendor: "Baidu",
      license: "Apache-2.0",
      release: "2025-11",
      archType: "MoE",
      archDetail: "Multimodal Reasoning MoE (28B/3B)",
      totalParamsB: 28,
      activeParamsB: 3,
      q4DiskGb: 17.0,
      q8DiskGb: 30.0,
      sizeBand: "<160GB",
      context: "128K",
      vision: true,
      modality: "Multimodal (Image + Video + Thinking)",
      hfRepo: "baidu/ERNIE-4.5-VL-28B-A3B-Thinking",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "glm-4-7-flash",
      name: "GLM-4.7-Flash",
      vendor: "Z.ai (Zhipu AI)",
      license: "MIT",
      release: "2026-01",
      archType: "MoE",
      archDetail: "Sparse MoE",
      totalParamsB: 30,
      activeParamsB: 3,
      q4DiskGb: 18.0,
      q8DiskGb: 31.8,
      sizeBand: "<160GB",
      context: "200K",
      vision: false,
      modality: "Text-only (Agentic)",
      hfRepo: "zai-org/GLM-4.7-Flash",
      codingScores: {
        sweVerified: {
          value: 59.2,
          source: "Z.ai GLM-4.7-Flash Card",
          url: "https://huggingface.co/zai-org/GLM-4.7-Flash",
          note: "SWE-bench Verified"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 64.0,
          source: "Z.ai GLM-4.7-Flash Card",
          url: "https://huggingface.co/zai-org/GLM-4.7-Flash",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-8-27b",
      name: "Qwen3.8-27B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-08",
      archType: "Dense",
      archDetail: "Dense VLM",
      totalParamsB: 27.8,
      activeParamsB: 27.8,
      q4DiskGb: 17.6,
      q8DiskGb: 29.5,
      sizeBand: "<160GB",
      context: "262K–1M",
      vision: true,
      modality: "Multimodal (VLM + Video)",
      hfRepo: "Qwen/Qwen3.8-27B",
      codingScores: {
        sweVerified: {
          value: 86.0,
          labelSuffix: "Vals AI Harness",
          source: "Vals AI SWE-bench Verified",
          url: "https://www.vals.ai/benchmarks/swebench",
          note: "Vals AI Harness = 86.0% (Very Hard = 67%)"
        },
        swePro: {
          value: 61.7,
          source: "HF Qwen/Qwen3.8-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.8-27B",
          note: "อันดับ #1 ทั้งตาราง < 200 GB บน SWE-bench Pro (Claude Code Harness)"
        },
        deepSwe: {
          value: 42.2,
          source: "HF Qwen/Qwen3.8-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.8-27B",
          note: "DeepSWE 1.1 (กระโดดจาก 13.3% ในรุ่น 3.6)"
        },
        liveCodeBench: {
          value: 84.0,
          altText: "Official LCB v6: 90.3%",
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval = 84.00% (Qwen card LCB v6 = 90.3%)"
        },
        terminalBench4: {
          value: 5.6,
          source: "Artificial Analysis (via gpuwerk)",
          url: "https://gpuwerk.com/blog/best-open-weight-coding-models",
          note: "AA Xhigh run = 5.6% (ส่วน Terminal-Bench 2.1 = 73.0%)"
        },
        frontierCode2: {
          value: 14.9,
          source: "Artificial Analysis (via gpuwerk)",
          url: "https://gpuwerk.com/blog/best-open-weight-coding-models",
          note: "Artificial Analysis independent eval (เทียบเท่าโมเดลใหญ่หลายเท่าตัว)"
        },
        codingElo: {
          value: 1465,
          source: "OpenLM / LMArena (Nov 2026)",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo (#1 กลุ่ม Dense < 20 GB)"
        }
      }
    },
    {
      id: "qwen3-5-27b",
      name: "Qwen3.5-27B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-02",
      archType: "Dense",
      archDetail: "Dense VLM",
      totalParamsB: 27,
      activeParamsB: 27,
      q4DiskGb: 17.5,
      q8DiskGb: 28.6,
      sizeBand: "<160GB",
      context: "128K–262K",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "Qwen/Qwen3.5-27B",
      codingScores: {
        sweVerified: {
          value: 75.0,
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Official Scaffold"
        },
        swePro: {
          value: 51.2,
          source: "HF Qwen/Qwen3.6-27B Card",
          url: "https://huggingface.co/Qwen/Qwen3.6-27B",
          note: "Refined SWE-bench Pro"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 80.7,
          source: "HF Qwen/Qwen3.5-122B-A10B Card",
          url: "https://huggingface.co/Qwen/Qwen3.5-122B-A10B",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "gemma-4-26b-a4b",
      name: "Gemma 4 26B-A4B-it-AWQ",
      vendor: "Google DeepMind",
      license: "Apache-2.0",
      release: "2026-04",
      archType: "MoE",
      archDetail: "Sparse MoE Multimodal (AWQ 4-bit ~17.2G / GGUF Q4 ~16G)",
      totalParamsB: 25.2,
      activeParamsB: 3.8,
      q4DiskGb: 17.2,
      q8DiskGb: 26.7,
      sizeBand: "<160GB",
      context: "256K",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "google/gemma-4-26B-A4B-it",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 77.1,
          source: "Gemma 4 Technical Report",
          url: "https://arxiv.org/html/2607.02770v1",
          note: "LiveCodeBench v6 Official · AWQ 4-bit: cyankiwi/gemma-4-26B-A4B-it-AWQ-4bit"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1460,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "devstral-small-2",
      name: "Devstral Small 2 (24B)",
      vendor: "Mistral AI",
      license: "Apache-2.0",
      release: "2025-12",
      archType: "Dense",
      archDetail: "Dense Software Agent",
      totalParamsB: 24,
      activeParamsB: 24,
      q4DiskGb: 15.0,
      q8DiskGb: 25.4,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Code)",
      hfRepo: "mistralai/Devstral-Small-2-24B-Instruct-2512",
      codingScores: {
        sweVerified: {
          value: 68.0,
          altText: "Vals Harness: 42.4%",
          source: "HF Devstral-Small-2 Card",
          url: "https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512",
          note: "Official OpenHands = 68.0% (Vals AI = 42.4%)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 43.18,
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "mistral-small-3",
      name: "Mistral Small 3 (24B)",
      vendor: "Mistral AI",
      license: "Apache-2.0",
      release: "2025-01",
      archType: "Dense",
      archDetail: "Dense Low-Latency",
      totalParamsB: 24,
      activeParamsB: 24,
      q4DiskGb: 15.0,
      q8DiskGb: 25.4,
      sizeBand: "<160GB",
      context: "32K",
      vision: false,
      modality: "Text-only",
      hfRepo: "mistralai/Mistral-Small-24B-Instruct-2501",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "magistral-small-2509",
      name: "Magistral-Small-2509 (1.2)",
      vendor: "Mistral AI",
      license: "Apache-2.0",
      release: "2025-09",
      archType: "Dense",
      archDetail: "Dense Multimodal Reasoning (24B)",
      totalParamsB: 24,
      activeParamsB: 24,
      q4DiskGb: 14.5,
      q8DiskGb: 25.5,
      sizeBand: "<160GB",
      context: "128K",
      vision: true,
      modality: "Multimodal (Text + Image + Reasoning)",
      hfRepo: "mistralai/Magistral-Small-2509",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 72.13,
          altText: "HF Card LCB v5: 70.88%",
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval (#84) · Official HF card LCB v5 = 70.88%"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "mistral-small-3-2-24b",
      name: "Mistral-Small-3.2-24B (2506)",
      vendor: "Mistral AI",
      license: "Apache-2.0",
      release: "2025-06",
      archType: "Dense",
      archDetail: "Dense Multimodal (24B)",
      totalParamsB: 24,
      activeParamsB: 24,
      q4DiskGb: 13.6,
      q8DiskGb: 25.4,
      sizeBand: "<160GB",
      context: "128K",
      vision: true,
      modality: "Multimodal (Text + Image)",
      hfRepo: "mistralai/Mistral-Small-3.2-24B-Instruct-2506",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1361,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo (HF Card HumanEval+ Pass@5 = 92.9%)"
        }
      }
    },
    {
      id: "gpt-oss-20b",
      name: "gpt-oss-20b",
      vendor: "OpenAI",
      license: "Apache-2.0",
      release: "2025-08",
      archType: "MoE",
      archDetail: "Sparse MoE (Edge)",
      totalParamsB: 21,
      activeParamsB: 3.6,
      q4DiskGb: 13.0,
      q8DiskGb: 22.3,
      sizeBand: "<160GB",
      context: "131K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "openai/gpt-oss-20b",
      codingScores: {
        sweVerified: {
          value: 60.7,
          source: "OpenAI Model Card",
          url: "https://www.morphllm.com/gpt-oss",
          note: "OpenAI Scaffold High"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 80.39,
          source: "Vals AI LCB Leaderboard",
          url: "https://www.vals.ai/benchmarks/lcb",
          note: "Vals AI uniform eval (#70)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: {
          value: 1371,
          source: "OpenLM / LMArena",
          url: "https://www.openlm.ai/chatbot-arena",
          note: "LMArena Coding Elo"
        }
      }
    },
    {
      id: "gemma-4-12b",
      name: "Gemma 4 12B Unified",
      vendor: "Google DeepMind",
      license: "Apache-2.0",
      release: "2026-04",
      archType: "Dense",
      archDetail: "Dense Encoder-Free Multimodal",
      totalParamsB: 11.95,
      activeParamsB: 11.95,
      q4DiskGb: 8.2,
      q8DiskGb: 12.7,
      sizeBand: "<160GB",
      context: "256K",
      vision: true,
      modality: "Multimodal + Audio",
      hfRepo: "google/gemma-4-12B-it",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 72.0,
          source: "Gemma 4 Technical Report",
          url: "https://arxiv.org/html/2607.02770v1",
          note: "LiveCodeBench v6 Official"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "phi-4-reasoning",
      name: "Phi-4-Reasoning (14B)",
      vendor: "Microsoft",
      license: "MIT",
      release: "2025-04",
      archType: "Dense",
      archDetail: "Dense Reasoning LLM",
      totalParamsB: 14,
      activeParamsB: 14,
      q4DiskGb: 9.0,
      q8DiskGb: 15.5,
      sizeBand: "<160GB",
      context: "32K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "microsoft/Phi-4-reasoning",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 53.8,
          source: "Microsoft / BodegaOne",
          url: "https://huggingface.co/microsoft/Phi-4-reasoning",
          note: "LiveCodeBench (HumanEval+ 92.9%)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "phi-4-reasoning-plus",
      name: "Phi-4-Reasoning-Plus (14B)",
      vendor: "Microsoft",
      license: "MIT",
      release: "2025-04",
      archType: "Dense",
      archDetail: "Dense Extended-RL Reasoning",
      totalParamsB: 14,
      activeParamsB: 14,
      q4DiskGb: 9.0,
      q8DiskGb: 15.5,
      sizeBand: "<160GB",
      context: "32K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "microsoft/Phi-4-reasoning-plus",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 53.1,
          source: "HF microsoft/Phi-4-reasoning-plus",
          url: "https://huggingface.co/microsoft/Phi-4-reasoning-plus",
          note: "LiveCodeBench (2024.08–2025.02) · รุ่น RL เพิ่ม AIME25 เป็น 78.0%"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "deepseek-r1-distill-qwen-14b",
      name: "DeepSeek-R1-Distill-Qwen-14B",
      vendor: "DeepSeek",
      license: "MIT",
      release: "2025-01",
      archType: "Dense",
      archDetail: "Dense Reasoning Distill (Qwen2.5)",
      totalParamsB: 14.8,
      activeParamsB: 14.8,
      q4DiskGb: 9.0,
      q8DiskGb: 15.7,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 53.1,
          source: "HF DeepSeek-R1-Distill-Qwen-14B",
          url: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
          note: "LiveCodeBench Pass@1-COT (Codeforces Rating 1481)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen2-5-coder-14b",
      name: "Qwen2.5-Coder-14B-Instruct",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2024-11",
      archType: "Dense",
      archDetail: "Dense Code Specialist",
      totalParamsB: 14.7,
      activeParamsB: 14.7,
      q4DiskGb: 9.0,
      q8DiskGb: 15.7,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Code)",
      hfRepo: "Qwen/Qwen2.5-Coder-14B-Instruct",
      codingScores: {
        sweVerified: {
          value: 19.4,
          source: "Seed-Coder Paper arXiv:2506.03524",
          url: "https://arxiv.org/html/2506.03524v1",
          note: "SWE-bench Verified (Agentless; OpenHands = 1.4%)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 23.4,
          source: "Qwen2.5-Coder Paper arXiv:2409.12186",
          url: "https://arxiv.org/html/2409.12186v3",
          note: "LiveCodeBench (2407–2409) Table 16 · HumanEval 89.6%"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "mellum-2-1-12b",
      name: "JetBrains Mellum2.1-12B-A2.5B",
      vendor: "JetBrains",
      license: "Apache-2.0",
      release: "2026-10",
      archType: "MoE",
      archDetail: "Sparse MoE Coding Agent (64 experts)",
      totalParamsB: 12,
      activeParamsB: 2.5,
      q4DiskGb: 8.1,
      q8DiskGb: 13.5,
      sizeBand: "<160GB",
      context: "131K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "JetBrains/Mellum2.1-12B-A2.5B-Thinking",
      codingScores: {
        sweVerified: {
          value: 47.0,
          source: "HF JetBrains/Mellum2.1 Thinking",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "SWE-bench Verified (RL in real sandboxes)"
        },
        swePro: {
          value: 28.0,
          source: "HF JetBrains/Mellum2.1 Thinking",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "SWE-bench Pro Official"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 82.0,
          source: "HF JetBrains/Mellum2.1 Thinking",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "LiveCodeBench v6 Official (8.1 GB Q4_K_M)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen3-5-9b",
      name: "Qwen3.5-9B",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2026-02",
      archType: "Dense",
      archDetail: "Dense Edge VLM",
      totalParamsB: 9,
      activeParamsB: 9,
      q4DiskGb: 6.0,
      q8DiskGb: 9.8,
      sizeBand: "<160GB",
      context: "262K–1M",
      vision: true,
      modality: "Multimodal (VLM)",
      hfRepo: "Qwen/Qwen3.5-9B",
      codingScores: {
        sweVerified: {
          value: 50.0,
          source: "JetBrains Mellum2.1 HF Eval",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "SWE-bench Verified uniform comparison"
        },
        swePro: {
          value: 38.0,
          source: "JetBrains Mellum2.1 HF Eval",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "SWE-bench Pro uniform comparison"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 75.4,
          source: "JetBrains Mellum2.1 HF Eval",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "LiveCodeBench v6"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "ornith-1-0-9b",
      name: "Ornith-1.0-9B",
      vendor: "DeepReinforce (Ornith)",
      license: "MIT",
      release: "2026-06",
      archType: "Dense",
      archDetail: "Dense Self-Scaffolding Coder",
      totalParamsB: 9,
      activeParamsB: 9,
      q4DiskGb: 5.6,
      q8DiskGb: 9.6,
      sizeBand: "<160GB",
      context: "256K",
      vision: false,
      modality: "Text-only (Coding)",
      hfRepo: "ornith-ai/Ornith-1.0-9B",
      codingScores: {
        sweVerified: {
          value: 69.4,
          source: "Ornith Official / BetterClaw",
          url: "https://github.com/ornith-ai/Ornith-1",
          note: "SWE-bench Verified Official (9B Dense)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "deepseek-r1-0528-qwen3-8b",
      name: "DeepSeek-R1-0528-Qwen3-8B",
      vendor: "DeepSeek",
      license: "MIT",
      release: "2025-05",
      archType: "Dense",
      archDetail: "Dense Reasoning Distill",
      totalParamsB: 8,
      activeParamsB: 8,
      q4DiskGb: 5.0,
      q8DiskGb: 8.8,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only (Reasoning)",
      hfRepo: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 60.5,
          source: "DeepSeek / BodegaOne",
          url: "https://huggingface.co/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
          note: "LiveCodeBench (distilled from R1-0528)"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "gemma-4-e4b",
      name: "Gemma 4 E4B",
      vendor: "Google DeepMind",
      license: "Apache-2.0",
      release: "2026-04",
      archType: "Dense",
      archDetail: "Edge Multimodal (PLE · 4.5B eff.)",
      totalParamsB: 8,
      activeParamsB: 4.5,
      q4DiskGb: 5.0,
      q8DiskGb: 8.5,
      sizeBand: "<160GB",
      context: "128K",
      vision: true,
      modality: "Multimodal (Text + Image + Audio)",
      hfRepo: "google/gemma-4-E4B-it",
      codingScores: {
        sweVerified: {
          value: 23.0,
          source: "JetBrains Mellum2.1 HF Eval",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "SWE-bench Verified uniform comparison"
        },
        swePro: {
          value: 4.0,
          source: "JetBrains Mellum2.1 HF Eval",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "SWE-bench Pro uniform comparison"
        },
        deepSwe: null,
        liveCodeBench: {
          value: 69.4,
          source: "JetBrains Mellum2.1 HF Eval",
          url: "https://huggingface.co/JetBrains/Mellum2.1-12B-A2.5B-Thinking",
          note: "LiveCodeBench v6"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "seed-coder-8b-instruct",
      name: "Seed-Coder-8B-Instruct",
      vendor: "ByteDance Seed",
      license: "MIT",
      release: "2025-05",
      archType: "Dense",
      archDetail: "Dense Lightweight Coder",
      totalParamsB: 8.2,
      activeParamsB: 8.2,
      q4DiskGb: 5.0,
      q8DiskGb: 8.8,
      sizeBand: "<160GB",
      context: "32K",
      vision: false,
      modality: "Text-only (Code)",
      hfRepo: "ByteDance-Seed/Seed-Coder-8B-Instruct",
      codingScores: {
        sweVerified: {
          value: 19.2,
          source: "Seed-Coder Paper arXiv:2506.03524",
          url: "https://arxiv.org/html/2506.03524v1",
          note: "SWE-bench Verified (Agentless; OpenHands = 11.2%)"
        },
        swePro: null,
        deepSwe: null,
        liveCodeBench: {
          value: 24.7,
          source: "HF ByteDance-Seed/Seed-Coder-8B-Instruct",
          url: "https://huggingface.co/ByteDance-Seed/Seed-Coder-8B-Instruct",
          note: "LiveCodeBench (2410–2502) Pass@1 · HumanEval 84.8%"
        },
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    },
    {
      id: "qwen2-5-7b",
      name: "Qwen2.5-7B-Instruct",
      vendor: "Alibaba Qwen",
      license: "Apache-2.0",
      release: "2024-09",
      archType: "Dense",
      archDetail: "Dense Edge LLM",
      totalParamsB: 7.6,
      activeParamsB: 7.6,
      q4DiskGb: 4.7,
      q8DiskGb: 8.1,
      sizeBand: "<160GB",
      context: "128K",
      vision: false,
      modality: "Text-only",
      hfRepo: "Qwen/Qwen2.5-7B-Instruct",
      codingScores: {
        sweVerified: null,
        swePro: null,
        deepSwe: null,
        liveCodeBench: null,
        terminalBench4: null,
        frontierCode2: null,
        codingElo: null
      }
    }
  ],

  excluded: {
    oversizeOsi: [
      { name: "DeepSeek-V4-Pro", license: "MIT", archType: "MoE", q4DiskGb: 850, vision: true, reason: "Q4 850 GB เกินเพดาน 350 GB" },
      { name: "MiMo-V2.6-Pro", license: "MIT", archType: "MoE", q4DiskGb: 560, vision: true, reason: "Q4 560 GB เกินเพดาน 350 GB" },
      { name: "Inkling (975B)", license: "Apache-2.0", archType: "MoE", q4DiskGb: 540, vision: true, reason: "Q4 540 GB เกินเพดาน 350 GB" },
      { name: "GLM-5.1", license: "MIT", archType: "MoE", q4DiskGb: 490, vision: false, reason: "Q4 490 GB เกินเพดาน 350 GB" },
      { name: "GLM-5.2", license: "MIT", archType: "MoE", q4DiskGb: 485, vision: false, reason: "Q4 485 GB เกินเพดาน 350 GB" },
      { name: "GLM-5", license: "MIT", archType: "MoE", q4DiskGb: 485, vision: false, reason: "Q4 485 GB เกินเพดาน 350 GB" },
      { name: "DeepSeek-V3.2", license: "MIT", archType: "MoE", q4DiskGb: 445, vision: false, reason: "Q4 445 GB เกินเพดาน 350 GB" },
      { name: "DeepSeek-R1", license: "MIT", archType: "MoE", q4DiskGb: 404, vision: false, reason: "Q4 404 GB เกินเพดาน 350 GB" },
      { name: "DeepSeek-V3", license: "MIT", archType: "MoE", q4DiskGb: 404, vision: false, reason: "Q4 404 GB เกินเพดาน 350 GB" }
    ],
    nonOsi: [
      { name: "Qwen3.8-Flash-Next", license: "Qwen Community License 1.0", reason: "ไม่ใช่ OSI Open-Source — มีเงื่อนไขเชิงพาณิชย์เฉพาะค่าย" },
      { name: "Qwen3.8-Max (2.4T)", license: "Qwen3 License (Revenue-Share)", reason: "กำหนดข้อผูกพันแบ่งรายได้เมื่อรายได้เกิน $50M" },
      { name: "Qwen2.5-72B-Instruct", license: "Qwen License (>100M MAU)", reason: "จำกัดผู้ใช้เกิน 100M MAU" },
      { name: "Claude Haiku 5.5", license: "Proprietary Cloud API", reason: "Closed-weight API เท่านั้น" },
      { name: "GPT-6 Luna", license: "Proprietary Cloud API", reason: "Closed-weight API เท่านั้น" },
      { name: "Gemini 3.5 / 3.8 Flash", license: "Proprietary Cloud API", reason: "Closed-weight API เท่านั้น" },
      { name: "Inception Mercury 2", license: "Proprietary Cloud API", reason: "Closed-weight API เท่านั้น" },
      { name: "Gemma 3 (27B)", license: "Gemma Terms of Use", reason: "สัญญาอนุญาตมีข้อจำกัดเฉพาะ (Gemma 4 เปลี่ยนเป็น Apache-2.0 แล้ว)" },
      { name: "Llama 3 / Llama 4 Series", license: "Llama Community License", reason: "มีเพดาน 700M MAU และข้อจำกัดแบรนด์" },
      { name: "Kimi-K3.1-Pro", license: "Modified MIT", reason: "มีเงื่อนไข Attribution/UI เพิ่มเติมจาก MIT" },
      { name: "GLM-5.3 (Flagship)", license: "GLM-5.3 License (Custom)", reason: "สัญญาอนุญาตเฉพาะ (Security-Review สำหรับ MaaS >$10B)" },
      { name: "Nemotron-3-Ultra", license: "NVIDIA Open Model License", reason: "ไม่ใช่ MIT/Apache-2.0" },
      { name: "MiniMax-M2.5 (229B)", license: "Modified MIT (LICENSE-MODEL)", reason: "เพิ่มเงื่อนไขเฉพาะนอกเหนือ MIT" },
      { name: "MiniMax-M3 / M3.1-Flash", license: "MiniMax Community License", reason: "จำกัดการใช้งานเชิงพาณิชย์" },
      { name: "Laguna XS 2.1 (33B-A3B)", license: "OpenMDW-1.1", reason: "เปลี่ยนจาก Apache-2.0 เป็น OpenMDW-1.1 (ไม่ใช่ OSI)" },
      { name: "Nemotron 3.5 Super-VL (120B)", license: "OpenMDW-1.1", reason: "ใช้ OpenMDW-1.1 ไม่ใช่ MIT/Apache-2.0" },
      { name: "Devstral 2 (123B)", license: "Modified MIT", reason: "มีเงื่อนไขเพดานรายได้เฉพาะ (เฉพาะรุ่น Small 2 24B เป็น Apache-2.0)" },
      { name: "Solar Open 2 (250B)", license: "Upstage Solar License", reason: "สัญญาอนุญาตเฉพาะค่าย ไม่ใช่ OSI" }
    ]
  }
};
