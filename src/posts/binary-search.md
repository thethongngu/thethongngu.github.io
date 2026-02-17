---
title: A more generalized view on binary search
date: 2026-02-17
---

Binary search works whenever you have:

1. **Ordered search space**: The input that you are searching through must be sorted.
2. **Monotonic predicate**: The output of the predicate function must transition exactly once.

## Pseudo code

```python
function binary_search(lo, hi, predicate):
    while lo < hi:
        mid = lo + (hi - lo) / 2
        if predicate(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
```

`lo` and `hi` define the answer's search space, each value is mapped into the result of `predicate(mid)`, which is monotonic function.
