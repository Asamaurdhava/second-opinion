import { ContentType } from "./types";

interface ExampleInput {
  label: string;
  contentType: ContentType;
  source: string;
  content: string;
}

export const EXAMPLES: ExampleInput[] = [
  {
    label: "Buggy Python Code",
    contentType: "code",
    source: "ChatGPT",
    content: `def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
    total = 0
    for num in numbers:
        total += num
    average = total / len(numbers)
    return round(average, 2)

def find_duplicates(lst):
    """Find duplicate elements in a list."""
    seen = {}
    duplicates = []
    for item in lst:
        if item in seen:
            duplicates.append(item)
        seen[item] = True
    return duplicates

def merge_sorted_lists(list1, list2):
    """Merge two sorted lists into one sorted list."""
    result = []
    i = j = 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1
    return result`,
  },
  {
    label: "Professional Email",
    contentType: "email",
    source: "Claude",
    content: `Subject: Q3 Performance Review - Action Required

Hi Team,

I wanted to share some exciting updates from our Q3 performance review. Our revenue grew by 15% compared to last quarter, putting us well ahead of our annual target of 40% YoY growth.

Key highlights:
- Customer acquisition cost dropped to $45, down from $52 last quarter
- Net Promoter Score increased to 72, which puts us in the "world-class" category
- Employee retention rate is 94%, above industry average
- We shipped 23 new features, completing 100% of our roadmap

Based on these results, I recommend we accelerate our Series B timeline and increase our hiring targets by 30% across all departments. The market conditions are favorable and our competitors are struggling.

Please review the attached dashboard and confirm your department's numbers by Friday. Let me know if you have any questions.

Best regards,
Sarah`,
  },
  {
    label: "Market Analysis",
    contentType: "analysis",
    source: "ChatGPT",
    content: `Analysis: Should TechStartup Inc. expand into the European market?

RECOMMENDATION: Yes, expand immediately.

The European SaaS market is projected to reach $100B by 2027, growing at 12% CAGR. With the company's current ARR of $5M and 200% YoY growth rate, entering Europe now would allow us to capture significant market share before competitors establish dominance.

Key factors supporting expansion:
1. GDPR compliance is already built into our platform, reducing regulatory barriers
2. English is widely spoken in target markets (UK, Netherlands, Nordics), minimizing localization costs
3. Remote work trends have increased demand for our collaboration tools globally
4. Two competitors recently exited the European market due to economic uncertainty
5. The EUR/USD exchange rate is historically favorable for US companies

Risk assessment: LOW. The company has strong product-market fit domestically, and European customers have similar needs. The main risk is currency fluctuation, which can be hedged.

Timeline: Begin hiring a European sales team in Q1, launch in UK by Q2, expand to DACH region by Q4.`,
  },
  {
    label: "SQL Query",
    contentType: "code",
    source: "Copilot",
    content: `-- Get top customers by revenue with their recent orders
SELECT
    c.customer_id,
    c.name,
    c.email,
    SUM(o.total_amount) as lifetime_value,
    COUNT(o.order_id) as total_orders,
    MAX(o.created_at) as last_order_date
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
    AND o.created_at >= '2024-01-01'
GROUP BY c.customer_id, c.name, c.email
HAVING SUM(o.total_amount) > 1000
ORDER BY lifetime_value DESC
LIMIT 50;

-- Delete inactive users who haven't logged in
DELETE FROM users
WHERE last_login < NOW() - INTERVAL '6 months'
    AND account_type = 'free';

-- Update pricing for all products in a category
UPDATE products
SET price = price * 1.15,
    updated_at = NOW()
WHERE category_id IN (SELECT id FROM categories WHERE name LIKE '%premium%');`,
  },
  {
    label: "Legal Summary",
    contentType: "writing",
    source: "ChatGPT",
    content: `Summary of Non-Disclosure Agreement (NDA) between PartyA Corp and PartyB LLC

This NDA establishes mutual confidentiality obligations between both parties effective January 1, 2025.

Key Terms:
- Duration: 2 years from the effective date, with confidentiality obligations surviving for 5 years after termination
- Scope: Covers all proprietary information shared verbally, in writing, or electronically
- Exclusions: Information that is publicly available, independently developed, or received from a third party without restriction
- Permitted Disclosure: Either party may share confidential information with employees and contractors who "need to know" for the purpose of the business relationship
- Remedies: The injured party is entitled to seek injunctive relief and monetary damages
- Governing Law: State of Delaware

Notable Clauses:
- Non-solicitation of employees for 18 months after termination
- Automatic renewal unless either party provides 30 days written notice
- Neither party may assign this agreement without prior written consent

Risk Assessment: This is a standard mutual NDA with reasonable terms. Recommend signing without modifications.`,
  },
  {
    label: "Product Spec",
    contentType: "analysis",
    source: "Claude",
    content: `Product Requirements Document: AI-Powered Customer Support Chatbot

Overview:
Build an AI chatbot that handles 80% of customer support tickets without human intervention, reducing support costs by 60% within 6 months of deployment.

Technical Architecture:
- Frontend: React widget embedded in existing website
- Backend: Node.js API server with WebSocket for real-time chat
- AI: Fine-tuned GPT-4 model on our support ticket history (50,000 tickets)
- Database: MongoDB for conversation storage, Redis for session management
- Deployment: AWS ECS with auto-scaling

Key Features:
1. Natural language understanding for ticket classification
2. Automated responses for common issues (password reset, billing, shipping)
3. Seamless handoff to human agent when confidence is below 85%
4. Sentiment analysis to prioritize frustrated customers
5. Multi-language support (English, Spanish, French) from day one

Timeline: 8 weeks from kickoff to production
Team: 2 backend engineers, 1 frontend engineer, 1 ML engineer
Budget: $45,000 total (infrastructure + development)

Success Metrics:
- Ticket resolution rate: >80% automated
- Customer satisfaction: Maintain current CSAT of 4.2/5
- Response time: <5 seconds for first response
- Cost reduction: 60% within 6 months`,
  },
];
