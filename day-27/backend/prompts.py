"""
Prompts and templates for AI Workflow Builder.
"""

DEFAULT_SYSTEM_PROMPT = """You are a helpful, clear, and precise AI assistant. 
Execute the task requested in the prompt with high quality, structured responses, and logical reasoning."""

FALLBACK_RESPONSES = {
    "summary": "Summary of provided topic:\n- Key point 1: Core concepts and execution mechanism.\n- Key point 2: Streamlined data movement through connected visual graph ports.\n- Key point 3: Direct orchestration and production output.",
    "translation": "Translated Text (Hindi):\nयह एआई वर्कफ़्लो बिल्डर का सिमुलेशन उत्तर है।",
    "email": "Subject: Professional Request / Follow-up\n\nDear Team,\n\nI am writing to share an update regarding our recent workflow execution. Everything has processed successfully.\n\nBest regards,\nAI Workflow Engine",
    "default": "AI Model Response: Successfully processed prompt. Visual DAG graph execution completed without errors."
}
