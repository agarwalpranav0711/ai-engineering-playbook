from pydantic import BaseModel, Field
from typing import List, Optional

class Issue(BaseModel):
    severity: str = Field(description="Severity level: 'high', 'medium', or 'low'")
    category: str = Field(description="Issue category: 'bug', 'security', 'performance', or 'quality'")
    title: str = Field(description="Short descriptive title of the issue")
    line: Optional[int] = Field(default=None, description="Line number where issue is located, if applicable")
    explanation: str = Field(description="Detailed explanation of why this is a problem")
    suggestion: str = Field(description="Concrete actionable recommendation or code snippet fix")

class Complexity(BaseModel):
    time_complexity: str = Field(description="Big-O time complexity (e.g. 'O(n)', 'O(n²)', 'O(log n)')")
    space_complexity: str = Field(description="Big-O auxiliary space complexity (e.g. 'O(1)', 'O(n)')")
    explanation: str = Field(description="Explanation of loops, recursions, or auxiliary data structures")

class TestCase(BaseModel):
    test_name: str = Field(description="Short test case title (e.g. 'Standard Case', 'Empty Input')")
    input_data: str = Field(description="Input value or arguments for the test case")
    expected_output: str = Field(description="Expected output or return value")
    explanation: str = Field(description="Why this test case is relevant")

class CodeReview(BaseModel):
    overall_score: int = Field(ge=0, le=100, description="Overall code rating (0-100)")
    summary: str = Field(description="Executive overview summary of code quality and finding highlights")
    bugs: List[Issue] = Field(default_factory=list, description="Correctness and logic errors identified")
    security_issues: List[Issue] = Field(default_factory=list, description="Security vulnerabilities and credential risks")
    performance_issues: List[Issue] = Field(default_factory=list, description="Inefficient loops, memory allocations, or redundant operations")
    quality_issues: List[Issue] = Field(default_factory=list, description="Readability, naming conventions, and structure improvements")
    complexity: Complexity = Field(description="Time and space complexity breakdown")
    edge_cases: List[str] = Field(default_factory=list, description="Important edge cases to handle (empty input, negatives, duplicates)")
    test_cases: List[TestCase] = Field(default_factory=list, description="Generated test cases for validation")
    improved_code: str = Field(description="Refactored, corrected, and clean version of the input code")
    changes_made: List[str] = Field(default_factory=list, description="Itemized list of specific improvements applied in refactored code")

class ReviewRequest(BaseModel):
    language: str = Field(default="cpp", description="Programming language ('cpp', 'python', 'javascript', 'java', 'go', etc.)")
    code: str = Field(description="Source code snippet to review")
    review_mode: str = Field(default="full", description="Mode: 'full', 'dsa', 'bugs', 'security', 'performance'")

class ReviewResponse(BaseModel):
    success: bool
    review: Optional[CodeReview] = None
    error: Optional[str] = None
    processing_time_sec: float = 0.0
