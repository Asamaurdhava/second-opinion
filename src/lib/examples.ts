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
];
