# AI Engineering Protocol & Performance Standards

This document outlines the core operational strategies for high-stakes AI-driven development, focusing on plan-based execution, autonomous verification, and continuous self-improvement.

---

## 1. Plan Mode Default
**Requirement:** Enter "Plan Mode" for any non-trivial task (3+ steps or architectural decisions).
* **Stop and Pivot:** If a plan fails, **STOP** and re-plan immediately. Do not force a failing path.
* **Verification-Centric:** Use plan mode for verification steps, not just implementation.
* **Specifications:** Write detailed specs upfront to eliminate ambiguity before the first line of code is written.

## 2. Subagent Strategy
**Requirement:** Use subagents to maintain a clean main context window.
* **Task Offloading:** Delegate research, exploration, and parallel analysis to subagents.
* **Compute Scaling:** For complex problems, increase effective compute by deploying multiple subagents.
* **Focused Execution:** Assign exactly one task per subagent to ensure high-fidelity output.

## 3. Self-Improvement Loop
**Requirement:** Treat every correction as a data point for optimization.
* **Lesson Tracking:** After any user correction, update `tasks/lessons.md` with the failure pattern.
* **Rule Generation:** Write explicit rules to prevent repeating specific mistakes.
* **Iteration:** Ruthlessly refine these lessons until the error rate drops to near-zero.
* **Context Priming:** Review the `lessons.md` file at the start of every session.

## 4. Verification Before Done
**Requirement:** Never mark a task complete without empirical proof of success.
* **Behavioral Diffing:** Compare behavior between the original state and the changes.
* **Staff Engineer Standard:** Ask: *"Would a staff engineer approve this?"*
* **Validation Suite:** Run tests, inspect logs, and demonstrate correctness through logs or terminal output.

## 5. Demand Elegance (Balanced)
**Requirement:** Prioritize the most elegant solution for non-trivial changes.
* **The Elegant Pivot:** If a fix feels "hacky," pause and ask: *"Knowing everything I know now, what is the elegant solution?"*
* **Anti-Overengineering:** Skip this for simple fixes; do not over-engineer minor patches.
* **Internal Critique:** Challenge your own work rigorously before presenting it to the user.

## 6. Autonomous Bug Fixing
**Requirement:** Fully own the debugging lifecycle.
* **Root Cause Analysis:** Use logs, errors, and failing tests to diagnose the source, not just the symptom.
* **Zero Context Switching:** Aim to fix bugs with zero additional input required from the user.
* **CI Integration:** Automatically address and fix failing CI/CD tests.

## 7. Task Management Workflow
1.  **Plan First:** Write the execution strategy in `tasks/todo.md` with checkable items.
2.  **Verify Plan:** Confirm the plan with the user before implementation.
3.  **Track Progress:** Update the `todo.md` in real-time.
4.  **Explain Changes:** Provide a high-level summary at each major step.
5.  **Document Results:** Add a comprehensive review section to `tasks/todo.md`.
6.  **Capture Lessons:** Update `tasks/lessons.md` immediately following any corrections.

## 8. Core Principles
* **Simplicity First:** Make every change as simple as possible. Minimize code impact and "surface area."
* **No Laziness:** Find root causes. Avoid temporary fixes. Maintain senior-level engineering standards at all times.

---

## 9. The CLAUDE.md Dynamic Improvement Hack
**The Pattern:** Do not treat `CLAUDE.md` as a static configuration file. 

To achieve compounding value, `CLAUDE.md` must be a **living document**. It should evolve based on the project's specific architectural debt, the user's stylistic preferences, and the specific failure modes encountered during development. 

* **Static config = 20% value.**
* **Dynamic, evolving context = 100% value.**
