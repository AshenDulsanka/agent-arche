---
description: Systematically debug a bug or unexpected behaviour. Follows a reproduce → isolate → hypothesize → verify cycle to find root cause before writing any fix.
---

Debug the following issue systematically.

## Step 1: Reproduce
- Confirm the exact steps to reproduce the bug
- Note what is expected vs. what actually happens
- Identify the smallest reproducible case (simplify inputs, remove unrelated code)

## Step 2: Gather Evidence
Before touching any code, collect:
- Exact error message and stack trace (copy verbatim — don't paraphrase)
- Which file, function, and line number the error originates from
- What changed recently (last commit, dependency update, config change)
- Whether this is a regression (worked before) or never worked

## Step 3: Isolate the Boundary
- Find the last point where the system is in a known-good state
- Find the first point where the system is in a known-bad state
- The bug lives in between

## Step 4: Form Hypotheses
List 2–3 plausible root causes in order of likelihood. For each:
- What would cause this exact symptom?
- How would you test whether this hypothesis is correct?
- What would rule it out?

## Step 5: Verify One Hypothesis at a Time
- Test the most likely hypothesis first
- Make one change at a time
- If it doesn't fix the issue, revert before trying the next hypothesis
- Do not make multiple simultaneous changes

## Step 6: Fix and Verify
- Fix only the root cause — don't change unrelated code
- Verify the original reproduction steps no longer trigger the bug
- Check that no regressions were introduced in adjacent functionality
- Write a test that would have caught this bug before merging

## Common Traps
- **Symptom vs. cause**: Don't fix the symptom — find why it happened
- **Correlation vs. causation**: "It broke after X" doesn't mean X caused it
- **Assuming scope**: The bug may be in a layer you haven't looked at yet (data? state? network?)
- **Over-fixing**: A focused fix in 5 lines beats a refactor that touches 50

## Output
Report findings in this format:
1. **Root cause**: One sentence describing exactly what is wrong and why
2. **Fix applied**: What was changed
3. **Verification**: How the fix was confirmed to work
4. **Regression test**: The test added (or why one wasn't needed)
