export const courseLevels = [
  {
    "title": "Basics of AI",
    "short": "Basics",
    "phase": "FOUNDATION",
    "lead": "Understand AI. Use it. Write your first prompt.",
    "description": "Learn what a language model does, how to work with a chat interface, and where an answer can go wrong. Start with a question, then improve it through a conversation.",
    "topics": [
      "AI, language models and the difference between a model and an AI application.",
      "Your first prompt, follow-up questions, file attachments and conversation context.",
      "Checking answers against sources; recognising unsupported claims and sensitive inputs."
    ],
    "lab": "Work through a technical document with AI. Ask for an explanation, extract its key points, then check the response against the original.",
    "output": "A first prompt, revised response and source-checking checklist.",
    "requirement": "Start here · No prior AI experience"
  },
  {
    "title": "Prompt engineering",
    "short": "Prompts",
    "phase": "FOUNDATION",
    "lead": "Write prompts that get the job done.",
    "description": "Turn a vague request into a specification. Define the task, supply the right context, constrain the answer and test whether the prompt works on more than one input.",
    "topics": [
      "Instructions, context, examples, constraints and output formats.",
      "Reusable templates, structured responses and breaking a task into steps.",
      "Testing prompt versions against varied inputs and explicit success criteria."
    ],
    "lab": "Build a prompt that extracts decisions and action items from meeting notes. Test it on incomplete and ambiguous notes, then revise the instructions.",
    "output": "A reusable prompt template with test cases and a scoring rubric.",
    "requirement": "Builds on Level 1"
  },
  {
    "title": "Tool engineering",
    "short": "Tools",
    "phase": "BUILD",
    "lead": "Give AI capabilities beyond the model.",
    "description": "Connect a model to documents, APIs and functions it can call. Design tools with clear inputs, useful outputs and errors the model can act on.",
    "topics": [
      "Tool use and function calling; defining inputs and outputs with schemas.",
      "Connecting search, calculation and external APIs; authentication and permissions.",
      "MCP as a tool-connection interface; testing tool selection and failure handling."
    ],
    "lab": "Connect a document-search tool and a calculator to an assistant. Make it retrieve evidence, calculate from the result and explain which tools it used.",
    "output": "A working assistant with two tested tools.",
    "requirement": "Builds on Level 2 · APIs and JSON introduced in the lab"
  },
  {
    "title": "Custom LLMs, local models & more",
    "short": "Models",
    "phase": "BUILD",
    "lead": "Choose where the model runs and how it adapts.",
    "description": "Compare hosted and local models, then build an assistant around your own material. Understand which problems need better context, retrieval or fine-tuning.",
    "topics": [
      "Model selection, context limits, quantisation, hardware needs and inference cost.",
      "Custom instructions and retrieval-augmented generation (RAG) over your documents.",
      "Running a local model; fine-tuning concepts, dataset preparation and evaluation."
    ],
    "lab": "Run a local model and connect it to a small document collection. Compare its answers, response time and resource use with a hosted model.",
    "output": "A configured local assistant and a model-comparison report.",
    "requirement": "Builds on Level 3 · Local-model setup agreed before the lab"
  },
  {
    "title": "Automation",
    "short": "Automation",
    "phase": "BUILD",
    "lead": "Make a useful process run repeatedly.",
    "description": "Connect AI steps to triggers, data and other applications. Define what happens next, how failures are handled and where a person must review the result.",
    "topics": [
      "Schedules, webhooks, event triggers and conditional routing.",
      "Connecting extraction, validation and application updates in a workflow.",
      "Retries, duplicate prevention, error handling and approval steps."
    ],
    "lab": "Build a document-processing workflow: detect a new file, extract fields, validate them and prepare a reviewed update to a test record.",
    "output": "A repeatable workflow with tested failure and review paths.",
    "requirement": "Builds on Levels 3–4"
  },
  {
    "title": "Harness engineering",
    "short": "Harnesses",
    "phase": "ENGINEER",
    "lead": "Build the environment that makes AI work reliably.",
    "description": "Engineer the system around the model: what it can see, which tools it can use, how state is carried forward and how success is checked.",
    "topics": [
      "Context engineering: instructions, project knowledge, skills and working memory.",
      "Tool permissions, isolated execution, checkpoints, time limits and cost budgets.",
      "Logs, traces, evaluations and feedback loops that reveal and recover from failure."
    ],
    "lab": "Wrap a tool-using assistant in a controlled runtime. Save its state, capture a trace, enforce limits and resume a deliberately interrupted task.",
    "output": "A reusable harness with checkpoints and an evaluation suite.",
    "requirement": "Builds on Levels 3–5 · Configuration and code-based labs"
  },
  {
    "title": "Agent engineering",
    "short": "Agents",
    "phase": "ENGINEER",
    "lead": "Build systems that plan, act and adapt.",
    "description": "Give an agent a goal and bounded room to work towards it. Design how it chooses tools, observes results, revises its plan and decides when to stop.",
    "topics": [
      "Agent loops: planning, tool selection, action, observation and replanning.",
      "Single-agent design, delegation and when multiple agents are useful.",
      "Completion criteria, human handovers and evaluation against a simpler workflow."
    ],
    "lab": "Build a research agent that gathers sources, compares evidence and produces a cited report. Test its stopping rules, recovery behaviour and output quality.",
    "output": "A working agent, run traces, evaluations and a handover guide.",
    "requirement": "Builds on Level 6 · Final engineering project"
  }
];
