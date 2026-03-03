---
title: Database reading
date: 2026-03-01
---

32-bit CPU architecture:

- physical width of the CPU's general-purpose registers
- also means the width of the address pointer is 32-bit, so 4GB virtual address space

OS Virtual Page

- the name "page" universally denotes a fixed-length contiguous block of memory
- fixed-size block of contiguous virtual memory address space. It is managed by OS
- Standard user-space program do not interact with OS pages directly
- Size 4KB, page is the smallest unit that OS fetches from disk to page cache

OS Physical Frame

- fixed-size block of physical hardware memory (RAM). The MMU is responsible for translating the virtule pages into physical frames

Page cache

- dynamically sized region of physical RAM maintained by the OS kernel

Journal

- Standard computing terminology refers to ledger of operations or states

Concurrency control

- The core underlying reason for all concurrency issues is the non-deterministic interleaving of operations on the shared mutable state
- [^1] states that there are 2 main categories in non-deadlock concurrency issues:
  - Atomicity Violation: The desired serializability among multiple memory accesses is violated. This occurs when a code region is intended to be atomic, but that atomicity is not enforced during execution
  - Order Violation: The desired order between two memory accesses, or groups of memory accesses, is flipped. This occurs when operation A should always be executed before operation B, but the system fails to enforce this order during execution

[^1]: Learning from mistakes: a comprehensive study on real world concurrency bug characteristics
