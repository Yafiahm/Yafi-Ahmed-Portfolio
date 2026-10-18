/**
 * YAFI AHMED PORTFOLIO — CENTRAL DATA ENGINE & SYNC ADAPTER
 * Manages all portfolio content with dual-engine persistence:
 * 1. LocalStorage (instant client-side zero-latency editing)
 * 2. Supabase Cloud Sync (PostgreSQL cloud database integration)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortfolioData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'yafi_portfolio_data_v1';
  const CONFIG_KEY = 'yafi_supabase_config_v1';

  // DEFAULT BASELINE DATASET (Matches current site perfectly)
  const defaultData = {
    general: {
      siteTitle: "Yafi Ahmed — Independent Builder & Creator",
      monogram: "YA",
      fullName: "Yafi Ahmed",
      greeting: "Hi.",
      roleSubtitle: "I am Yafi Ahmed.",
      location: "Dhaka, Bangladesh",
      manifesto: "Fusing artificial intelligence, autonomous flight mechanics, and high-performance digital architectures into real-world software & hardware.",
      heroMarquee: [
        { label: "AUTONOMOUS DRONES", color: "cyan" },
        { label: "AGENTIC AI SWARMS", color: "purple" },
        { label: "NEXT-GEN SPACECRAFT", color: "pink" },
        { label: "DISTRIBUTED RTOS & C++", color: "green" },
        { label: "EDGE TENSOR INFERENCE", color: "yellow" },
        { label: "HIGH-PERFORMANCE WEB", color: "cyan" },
        { label: "DEEP-TECH R&D", color: "purple" }
      ],
      homepageProjectCount: 4
    },
    about: {
      headlineWhite: "Curiosity drives me.",
      headlineGradient: "Creation defines me.",
      bioP1: "I am an independent aerospace software engineer, hardware hacker, and full-stack system architect based in Dhaka, Bangladesh. I specialize in building autonomous drone navigation platforms, agentic AI systems, and mission-critical web ecosystems from scratch.",
      bioP2: "Rather than treating software and hardware as separate realms, I bridge physical mechanics with distributed intelligence—from custom flight controllers and low-latency motor telemetry to neural network inference on edge microprocessors.",
      yearsExperience: "4+",
      completedBuilds: "24+",
      flightHours: "1,200+",
      profileImg: "yafi_avatar.png"
    },
    techStack: [
      // AI & MACHINE LEARNING TOOLS
      { id: "1", name: "Google Antigravity", category: "AI & ML", desc: "Agentic AI development, pair-programming & autonomous engineering workflows", url: "https://antigravity.google" },
      { id: "2", name: "Google AI Studio", category: "AI & ML", desc: "Gemini 1.5/2.0 multimodal vision, massive context reasoning & structured generation", url: "https://aistudio.google.com" },
      { id: "3", name: "Claude 3.5 Sonnet", category: "AI & ML", desc: "Deep architectural reasoning, complex system blueprints & code verification", url: "https://claude.ai" },
      { id: "4", name: "ChatGPT / GPT-4o", category: "AI & ML", desc: "Conversational agent logic, natural language understanding & prompt orchestration", url: "https://chatgpt.com" },
      { id: "5", name: "Cursor AI", category: "AI & ML", desc: "AI-native IDE for accelerated autonomous development and refactoring", url: "https://cursor.com" },
      { id: "6", name: "Midjourney v6", category: "AI & ML", desc: "Generative sci-fi concept art, spacecraft aesthetic rendering & hardware ideation", url: "https://midjourney.com" },
      { id: "7", name: "Stable Diffusion XL", category: "AI & ML", desc: "Local offline generative image synthesis & custom checkpoint fine-tuning", url: "https://stability.ai" },
      { id: "8", name: "RunPod GPU Cloud", category: "AI & ML", desc: "Serverless cloud GPU clustering for AI model inference and fine-tuning", url: "https://runpod.io" },
      { id: "9", name: "Hugging Face Hub", category: "AI & ML", desc: "Open-source transformer model hub, datasets, pipelines and tokenizers", url: "https://huggingface.co" },
      { id: "10", name: "Ollama Local AI", category: "AI & ML", desc: "Offline local LLM execution on embedded edge hardware & laptops", url: "https://ollama.com" },
      { id: "11", name: "LangChain & RAG", category: "AI & ML", desc: "Multi-agent tool routing, vector memory retrieval and cognitive orchestration", url: "https://langchain.com" },

      // ROBOTICS, SBCS & RTOS EMBEDDED
      { id: "12", name: "Arduino Giga R1 WiFi", category: "Robotics & SBC", desc: "Dual-core M7/M4 microcontroller for real-time sensor fusion & motor actuation", url: "https://arduino.cc" },
      { id: "13", name: "Raspberry Pi 5 (8GB)", category: "Robotics & SBC", desc: "High-performance companion computer for autonomous drone flight telemetry", url: "https://raspberrypi.com" },
      { id: "14", name: "LattePanda 3 Delta / Relitm", category: "Robotics & SBC", desc: "Powerful Intel x86 SBC running Windows/Ubuntu for edge computer vision", url: "https://lattepanda.com" },
      { id: "15", name: "NVIDIA Jetson Orin Nano", category: "Robotics & SBC", desc: "40 TOPS AI compute for real-time stereoscopic obstacle avoidance & SLAM", url: "https://nvidia.com" },
      { id: "16", name: "ESP32-S3 AI Cam", category: "Robotics & SBC", desc: "Ultra-low-power dual-core MCU with built-in Wi-Fi, BLE & camera vision", url: "https://espressif.com" },
      { id: "17", name: "Teensy 4.1", category: "Robotics & SBC", desc: "600 MHz ARM Cortex-M7 board for sub-millisecond quadcopter flight control", url: "https://pjrc.com" },
      { id: "18", name: "Pixhawk 6X Autopilot", category: "Robotics & SBC", desc: "Triple-redundant IMU flight controller for industrial drone avionics", url: "https://holybro.com" },
      { id: "19", name: "PX4 Autopilot Stack", category: "Robotics & SBC", desc: "Industrial open-source flight management RTOS for autonomous navigation", url: "https://px4.io" },

      // CLOUD, EDGE & PLATFORMS
      { id: "20", name: "Supabase Cloud", category: "Cloud & Data", desc: "Real-time PostgreSQL, Edge Functions, Row-Level Security & Auth", url: "https://supabase.com" },
      { id: "21", name: "Cloudflare Edge", category: "Cloud & Data", desc: "Global CDN, edge DNS routing, and distributed serverless workers", url: "https://cloudflare.com" },
      { id: "22", name: "Docker Containers", category: "Cloud & Data", desc: "Containerized deployment pipelines for AI models & distributed telemetry", url: "https://docker.com" },
      { id: "23", name: "Vercel Edge Network", category: "Cloud & Data", desc: "High-speed edge deployment with instant cache invalidation", url: "https://vercel.com" }
    ],
    capabilities: [
      {
        id: "cap-1",
        title: "Autonomous Drone Systems",
        category: "Hardware & Robotics",
        desc: "End-to-end custom autonomous aerial vehicles featuring vision-based obstacle avoidance, GPS-denied SLAM navigation, and real-time ground-station telemetry telemetry.",
        features: ["Custom Flight Controller Firmware (PX4/ArduPilot)", "Edge Object Detection (YOLOv8 + Coral TPU)", "Fail-safe Return-to-Home & Mesh Swarm Relays"]
      },
      {
        id: "cap-2",
        title: "Agentic AI Architectures",
        category: "Machine Intelligence",
        desc: "Autonomous multi-agent systems designed for research synthesis, continuous codebase maintenance, workflow orchestration, and generative user interfaces.",
        features: ["Stateful Agent Memory & Vector RAG (Supabase pgvector)", "Tool-calling MCP Integrations & Sandboxed Runtimes", "Real-time Multi-agent Collaborative Consensus"]
      },
      {
        id: "cap-3",
        title: "High-Performance Web Platforms",
        category: "Full-Stack Software",
        desc: "Ultra-fast, interactive web applications featuring 60FPS fluid canvas graphics, zero-latency state synchronization, and scalable cloud architectures.",
        features: ["Sub-second SSR / Edge Cloud Deployments", "Custom Shader Visuals & Continuous Frame Engines", "PostgreSQL Architectures with Row-Level Security"]
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "Autonomous Drone System",
        category: "Aerospace Robotics",
        year: "2025 - 2026",
        featured: true,
        summary: "Custom carbon-fiber hexacopter with edge AI obstacle clearance, GPS-denied SLAM navigation, and encrypted telemetry.",
        images: ["project_drone.jpg", "project_drone_2.jpg"],
        specs: ["Flight Time: 42 Mins", "Edge Compute: NVIDIA Jetson Orin", "Control: PX4 RTOS"],
        liveUrl: "#",
        githubUrl: "#",
        details: "An industrial-grade autonomous aerial platform built for surveying complex terrain without satellite connectivity. Powered by stereoscopic vision cameras and custom onboard sensor fusion running at 200Hz."
      },
      {
        id: "proj-2",
        title: "Next-Gen Spacecraft Cruiser",
        category: "Aerospace Concept & Sim",
        year: "2025",
        featured: true,
        summary: "Conceptual interplanetary exploration craft engineered with digital cockpit telemetry and orbital trajectory simulations.",
        images: ["project_spacecraft.jpg", "project_spacecraft_2.jpg"],
        specs: ["Sim Engine: WebGL / Three.js", "Physics: Custom Keplerian Orbital Solver", "HUD: Luminous Vector HUD"],
        liveUrl: "#",
        githubUrl: "#",
        details: "Interactive real-time aerospace simulator modeling high-altitude maneuvers, atmospheric re-entry thermal loads, and planetary rendezvous trajectories."
      },
      {
        id: "proj-3",
        title: "AI Assistant Platform",
        category: "Agentic Swarm Platform",
        year: "2025 - 2026",
        featured: true,
        summary: "Autonomous multi-agent swarm platform coordinating specialized AI agents to execute multi-step engineering and research tasks.",
        images: ["project_ai.jpg", "project_ai_2.jpg"],
        specs: ["Agents: 12 Specialized Nodes", "Database: Supabase pgvector", "Latency: <180ms Streaming"],
        liveUrl: "#",
        githubUrl: "#",
        details: "Scalable agent runtime integrating web research, continuous compilation, code generation, and interactive generative UI rendering directly in chat streams."
      },
      {
        id: "proj-4",
        title: "Orivino Food-Tech SaaS",
        category: "Enterprise Restaurant Suite",
        year: "2024 - 2025",
        featured: true,
        summary: "Modern dark-mode restaurant operation OS featuring live floor layout management, table reservations, and financial analytics.",
        images: ["project_orivino.jpg", "project_orivino_2.jpg"],
        specs: ["Frontend: Next.js + Tailwind", "Real-Time: WebSockets", "Analytics: TimescaleDB"],
        liveUrl: "#",
        githubUrl: "#",
        details: "High-volume restaurant hospitality platform used by boutique dining rooms to coordinate kitchen display workflows, table floor plans, and predictive supply orders."
      }
    ],
    faqs: [
      {
        q: "What kind of projects do you take on?",
        a: "I work on high-impact projects bridging hardware and software: autonomous robotics/drones, agentic AI platforms, edge machine learning, and bespoke high-performance web systems."
      },
      {
        q: "Are you available for freelance or contract engineering?",
        a: "Yes. I consult on deep-tech engineering architecture, build end-to-end prototypes, and develop custom production-ready systems for startups and enterprises worldwide."
      },
      {
        q: "Where are you based, and can you collaborate across timezones?",
        a: "I am based in Dhaka, Bangladesh (UTC+6). I collaborate asynchronously and synchronously with teams across North America, Europe, and Asia-Pacific seamlessly."
      },
      {
        q: "What is your hardware prototyping and lab setup?",
        a: "My lab houses high-precision 3D printing, SMD soldering stations, oscilloscope/logic analyzers, Jetson Orin edge boards, and indoor optical flight test zones."
      }
    ],
    socials: {
      github: { handle: "@yafi-ahmed", url: "https://github.com/yafi-ahmed", active: true },
      x: { handle: "@yafi_ahmed", url: "https://twitter.com/yafi_ahmed", active: true },
      whatsapp: { handle: "+880 1800 000000", url: "https://wa.me/", active: true },
      discord: { handle: "yafiahmed#0001", url: "https://discord.com", active: true },
      linkedin: { handle: "yafi-ahmed", url: "https://linkedin.com/in/yafi-ahmed", active: true },
      fiverr: { handle: "@yafi_ahmed", url: "https://fiverr.com", active: true }
    },
    aiSettings: {
      botName: "Yafi AI",
      botTitle: "",
      welcomeMessage: "Hello! I am Yafi AI, your conversational assistant. How can I help you today?",
      botAvatar: "yafi_avatar.png",
      buttonIcon: "",
      maxImagesPerUser: 5,
      sessionTimeLimitMinutes: 30, // 0 for unlimited
      allowCodeExecution: true,
      watermarkText: "Created by Yafi AI — Engineered by Yafi Ahmed"
    }
  };

  class PortfolioDataManager {
    constructor() {
      this.data = this.loadData();
      this.supabaseConfig = this.loadSupabaseConfig();
    }

    loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const merged = Object.assign({}, defaultData, parsed);
          if (Array.isArray(merged.techStack) && merged.techStack.some(t => t.name === 'Python' || t.name === 'C++')) {
            merged.techStack = JSON.parse(JSON.stringify(defaultData.techStack));
          }
          if (!merged.aiSettings) {
            merged.aiSettings = JSON.parse(JSON.stringify(defaultData.aiSettings));
          } else {
            if (merged.aiSettings.botTitle === 'Autonomous Cognitive Systems Agent') {
              merged.aiSettings.botTitle = '';
            }
            if (!merged.aiSettings.botAvatar) {
              merged.aiSettings.botAvatar = 'yafi_avatar.png';
            }
          }
          return merged;
        }
      } catch (err) {
        console.warn('PortfolioData: Could not read localStorage, using default data.', err);
      }
      return JSON.parse(JSON.stringify(defaultData));
    }

    saveData(newData) {
      this.data = newData || this.data;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        window.dispatchEvent(new CustomEvent('yafi_data_updated', { detail: this.data }));
        return true;
      } catch (err) {
        console.error('PortfolioData: Could not save to localStorage.', err);
        return false;
      }
    }

    resetToDefault() {
      this.data = JSON.parse(JSON.stringify(defaultData));
      this.saveData(this.data);
      return this.data;
    }

    exportJSON() {
      return JSON.stringify(this.data, null, 2);
    }

    importJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        this.saveData(parsed);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // SUPABASE CONFIG & CLOUD SYNC
    loadSupabaseConfig() {
      const defaultCfg = {
        url: 'https://yrjpgyvtjvxqumcnpwru.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyanBneXZ0anZ4cXVtY25wd3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMjQ4OTcsImV4cCI6MjEwNzgwMDg5N30.BizV-Ban2oJ-LFa9BEpFEwD1FX0gNdXmFlwGfj6N6Tc',
        tableName: 'portfolio_content'
      };
      try {
        const stored = localStorage.getItem(CONFIG_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return Object.assign({}, defaultCfg, parsed);
        }
      } catch (e) {}
      return defaultCfg;
    }

    saveSupabaseConfig(config) {
      this.supabaseConfig = Object.assign({}, this.supabaseConfig, config);
      this._supabaseClient = null; // reset cached client
      try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(this.supabaseConfig));
        return true;
      } catch (e) {
        return false;
      }
    }

    getClient() {
      const { url, anonKey } = this.supabaseConfig;
      if (!url || !anonKey) return null;
      if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        if (!this._supabaseClient || this._lastClientUrl !== url || this._lastClientKey !== anonKey) {
          this._supabaseClient = window.supabase.createClient(url, anonKey);
          this._lastClientUrl = url;
          this._lastClientKey = anonKey;
        }
        return this._supabaseClient;
      }
      return null;
    }

    async pushToSupabase() {
      const { url, anonKey, tableName } = this.supabaseConfig;
      if (!url || !anonKey) {
        throw new Error('Supabase URL or Anon Key is missing. Configure in Admin Panel.');
      }

      const cleanUrl = url.replace(/\/+$/, '');
      const endpoint = `${cleanUrl}/rest/v1/${tableName || 'portfolio_content'}`;

      const payload = {
        id: 'main',
        data: this.data,
        updated_at: new Date().toISOString()
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Supabase push failed (${response.status}): ${errText}`);
      }

      return { success: true, timestamp: payload.updated_at };
    }

    async pullFromSupabase() {
      const { url, anonKey, tableName } = this.supabaseConfig;
      if (!url || !anonKey) {
        throw new Error('Supabase URL or Anon Key is missing. Configure in Admin Panel.');
      }

      const cleanUrl = url.replace(/\/+$/, '');
      const endpoint = `${cleanUrl}/rest/v1/${tableName || 'portfolio_content'}?id=eq.main&select=*`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Supabase pull failed (${response.status}): ${errText}`);
      }

      const rows = await response.json();
      if (!rows || rows.length === 0) {
        throw new Error('No portfolio data record found in Supabase (id="main"). Push initial data first.');
      }

      const cloudData = rows[0].data;
      this.saveData(cloudData);
      return { success: true, data: cloudData };
    }
  }

  return new PortfolioDataManager();
});
