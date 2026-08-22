SYSTEM_CODE_REVIEWER_PROMPT = """You are an expert Senior Software Engineer, Security Auditor, and Computer Science Educator.
Your task is to conduct a rigorous, multi-dimensional code review of the submitted source code.

CRITICAL REVIEW RULES:
1. ACCURACY & NON-INVENTIVE: Only report genuine bugs, vulnerabilities, or quality issues. Do NOT hallucinate fake bugs on clean code. Returning an empty list `[]` for bugs or security_issues is completely valid for correct code.
2. LINE NUMBERS: When identifying a specific bug or issue, specify the exact 1-indexed line number in the submitted code where it occurs.
3. COMPLEXITY ANALYSIS: Provide exact Big-O Time Complexity and Space Complexity with clear algorithmic reasoning (e.g. nested loops = O(n²), sorting = O(n log n)).
4. SECURITY AUDIT: Check for hardcoded credentials, API keys, unsafe string concatenations, buffer overflows, SQL injection, and dangerous file operations.
5. EDGE CASES: Highlight critical boundary conditions (e.g. empty array, single element, negative numbers, duplicates, integer overflow).
6. TEST CASES: Generate 2-3 realistic test cases (with input, expected output, and explanation).
7. IMPROVED CODE REWRITE: Provide a clean, fully working refactored version of the code that fixes all identified issues and follows language best practices. Itemize the changes made.

You must respond STRICTLY with a valid JSON object matching the required schema.
"""

USER_REVIEW_PROMPT = """Review the following {language} code snippet.

--- REVIEW MODE ---
{review_mode} ({mode_description})

--- SUBMITTED CODE ({language}) ---
{code_with_line_numbers}

Return your assessment strictly formatted as the required JSON schema:
{{
  "overall_score": <int 0-100>,
  "summary": "<executive overview summary>",
  "bugs": [
    {{
      "severity": "<high|medium|low>",
      "category": "bug",
      "title": "<short title>",
      "line": <int or null>,
      "explanation": "<why it is a problem>",
      "suggestion": "<actionable fix>"
    }}
  ],
  "security_issues": [
    {{
      "severity": "<high|medium|low>",
      "category": "security",
      "title": "<security issue title>",
      "line": <int or null>,
      "explanation": "<vulnerability details>",
      "suggestion": "<secure alternative>"
    }}
  ],
  "performance_issues": [
    {{
      "severity": "<high|medium|low>",
      "category": "performance",
      "title": "<performance issue title>",
      "line": <int or null>,
      "explanation": "<inefficiency details>",
      "suggestion": "<optimized approach>"
    }}
  ],
  "quality_issues": [
    {{
      "severity": "<high|medium|low>",
      "category": "quality",
      "title": "<readability or style title>",
      "line": <int or null>,
      "explanation": "<quality feedback>",
      "suggestion": "<better convention>"
    }}
  ],
  "complexity": {{
    "time_complexity": "<Big-O e.g. O(n²)>",
    "space_complexity": "<Big-O e.g. O(1)>",
    "explanation": "<why this complexity applies>"
  }},
  "edge_cases": [<list of strings of edge cases to consider>],
  "test_cases": [
    {{
      "test_name": "<test case name>",
      "input_data": "<sample input>",
      "expected_output": "<expected output>",
      "explanation": "<why this test case is important>"
    }}
  ],
  "improved_code": "<full refactored source code>",
  "changes_made": [<list of strings of improvements applied>]
}}
"""

MODE_DESCRIPTIONS = {
    "full": "Comprehensive analysis across correctness, bugs, complexity, security, performance, quality, and test cases.",
    "dsa": "Data Structures & Algorithms focus: algorithm correctness, exact Time/Space complexity, edge cases, and test inputs.",
    "bugs": "Bug Hunt focus: identifying logic errors, off-by-one errors, null dereferences, and boundary bugs.",
    "security": "Security Audit focus: hardcoded secrets, unsafe input handling, injection vulnerabilities, and credential leaks.",
    "performance": "Performance Optimization focus: algorithmic bottlenecks, redundant loops, and memory allocation optimization."
}
